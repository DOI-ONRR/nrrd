import React, { useContext } from 'react'
import PropTypes from 'prop-types'
// import { graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import QueryLink from '../../../../components/QueryLink'

// utility functions
import utils, { formatToDollarInt } from '../../../../js/utils'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'
import { useInView } from 'react-intersection-observer'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import { CircleChart } from '../../../data-viz/CircleChart'

import {
  Box,
  Container,
  Grid,
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
      '@media (max-width: 426px)': {
        display: 'block',
        margin: 0,
      },
      '& .chart': {
        marginRight: theme.spacing(2),
        width: '70%',
        '@media (max-width: 426px)': {
          marginRight: 0,
          width: '100%',
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

  const colorRange = [
    theme.palette.explore[700],
    theme.palette.explore[600],
    theme.palette.explore[500],
    theme.palette.explore[400],
    theme.palette.explore[300],
    theme.palette.explore[200],
    theme.palette.explore[100]
  ]
  const xAxis = 'recipient'
  const yAxis = 'total'
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true
  })

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { year },
    skip: inView === false
  })

  if (loading) {
    return (
      <div className={classes.progressContainer} ref={ref} >
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
      <Container id={utils.formatToSlug(title)} ref={ref} >
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
                key={`DTR__${ dataSet }`}
                data={chartData}
                xAxis={xAxis}
                yAxis={yAxis}
                legendHeaders={['Recipient', dataSet]}
                legendPosition={'right'}
                legendFormat={d => formatToDollarInt(d)}
                colorRange={colorRange}
                circleLabel={
                  d => {
                    const r = []
                    r[0] = d.data[xAxis]
                    r[1] = formatToDollarInt(d.data[yAxis])
                    return r
                  }
                }
                chartTooltip={
                  d => {
                    const r = []
                    r[0] = d.data[xAxis]
                    r[1] = formatToDollarInt(d.data[yAxis])
                    return r
                  }
                } />
            </Box>
          </Box>
        </Grid>
      </Container>
    )
  }
  else {
    return (
      <div className={classes.progressContainer} ref={ref} >
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </div>
    )
  }
}

export default DisbursementTopRecipients

DisbursementTopRecipients.propTypes = {
  title: PropTypes.string
}
