import React, { useContext } from 'react'
import PropTypes from 'prop-types'
// import { graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import QueryLink from '../../../../components/QueryLink'

// utility functions
import utils from '../../../../js/utils'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import { makeStyles } from '@material-ui/core/styles'

import CircularProgress from '@material-ui/core/CircularProgress'
import CircleChart from '../../../data-viz/CircleChart/CircleChart.js'

import {
  Box,
  Container,
  Grid,
  Chip,
  useTheme
} from '@material-ui/core'

const APOLLO_QUERY = gql`
  query NationwideDisbursemtSummary($year: Int!) {
    fiscal_disbursement_recipient_summary( where: {year: {_eq: $year}}) {
      total
      recipient
      year
    }
  }
`
const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    width: '100%',
    margin: 0,
    '@media (max-width: 767px)': {
      maxWidth: '100%',
      minHeight: 'inherit',
    }
  },

  progressContainer: {
    maxWidth: '25%',
    display: 'flex',
    '& > *': {
      marginTop: theme.spacing(3),
      marginRight: 'auto',
      marginLeft: 'auto',
    }
  },
  circularProgressRoot: {
    color: theme.palette.primary.dark,
  },
  topRecipientChart: {
    '& .chart-container': {
      display: 'flex',
      // alignItems: 'top',
      '@media (max-width: 426px)': {
        display: 'block',
        margin: 0,
      },
      '& .chart': {
        marginRight: theme.spacing(2),
        width: '70%',
        '@media (max-width: 426px)': {
          marginRight: 0,
        },
      },
    }
  }
}))

const DisbursementTopRecipients = props => {
  const classes = useStyles()
  const theme = useTheme()
  const title = props.title || ''

  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]

  const { loading, error, data } = useQuery(APOLLO_QUERY, { variables: { year } })
  const handleDelete = props.handleDelete || ((e, val) => {
    console.debug('handle delete')
  })

  if (loading) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </div>
    )
  }
  if (error) return `Error! ${ error.message }`
  let chartData = []
  const dataSet = `FY ${ year }`
  if (data) {
    chartData = data.fiscal_disbursement_recipient_summary

    return (
      <Container id={utils.formatToSlug(title)}>
        <Grid item xs={12}>
          <Box color="secondary.main" mt={5} mb={2} borderBottom={2} display="flex" justifyContent="space-between">
            <Box component="h3" color="secondary.dark" display="inline">{title}</Box>
            <Box display={{ xs: 'none', sm: 'inline' }} align="right" position="relative" top={5}>
              <QueryLink groupBy={DFC.RECIPIENT} linkType="FilterTable" {...props}>
                Query nationwide disbursements
              </QueryLink>
            </Box>
          </Box>
          <Box display={{ xs: 'block', sm: 'none' }} align="left">
            <QueryLink groupBy={DFC.RECIPIENT} linkType="FilterTable" {...props}>
                Query nationwide disbursements
            </QueryLink>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box className={classes.root}>
            <Box className={classes.topRecipientChart}>
              <CircleChart
                key={'DTR' + dataSet }
                data={chartData}
                maxLegendWidth='800px'
                xAxis='recipient'
                yAxis='total'
                format={ d => utils.formatToDollarInt(d) }
                circleLabel={ d => {
                  // console.debug('circleLABLE: ', d)
                  const r = []
                  r[0] = d.recipient
                  r[1] = utils.formatToDollarInt(d.total)
                  return r
                }
                }
                yLabel={dataSet}
                minColor={theme.palette.green[100]}
                maxColor={theme.palette.green[600]} />
            </Box>
          </Box>
        </Grid>
      </Container>
    )
  }
  else {
    return (null)
  }
}

export default DisbursementTopRecipients

DisbursementTopRecipients.propTypes = {
  title: PropTypes.string
}
