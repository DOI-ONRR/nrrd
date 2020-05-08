import React, { useContext } from 'react'
// import { graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
// utility functions
import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'

import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import LineChart from '../../../data-viz/LineChart/LineChart.js'
import ChipLabel from '../../ExploreData/ChipLabel'

import {
  Box,
  Container,
  Grid,
  Chip,
  useTheme
} from '@material-ui/core'

const LINE_DASHES = ['1,0', '5,5', '10,10', '20,10,5,5,5,10']

const APOLLO_QUERY = gql`
  query FiscalRevenueSummary {
    fiscal_revenue_summary(
      order_by: { fiscal_year: asc }
    ) {
      fiscal_year
      state_or_area
      sum
    }

  }
`
const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    width: '100%',
    margin: theme.spacing(1),
    '@media (max-width: 768px)': {
      maxWidth: '100%',
    },
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
  chipRoot: {
    height: 40,
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    '& > span': {
      fontWeight: 'bold',
    },
  },
  chipContainer: {
    '& .MuiChip-root:nth-child(1) .line': {
      stroke: theme.palette.blue[300],
    },
    '& .MuiChip-root:nth-child(2) .line': {
      stroke: theme.palette.orange[300],
    },
    '& .MuiChip-root:nth-child(3) .line': {
      stroke: theme.palette.green[300],
    },
    '& .MuiChip-root:nth-child(4) .line': {
      stroke: theme.palette.purple[300],
    }
  }
}))

const RevenueOverTime = props => {
  const classes = useStyles()
  const theme = useTheme()
  const title = props.title || ''

  const { state: pageState, dispatch } = useContext(StoreContext)
  const cards = pageState.cards

  const { loading, error, data } = useQuery(APOLLO_QUERY)

  const handleDelete = props.handleDelete || ((e, val) => {
    dispatch({ type: 'CARDS', payload: cards.filter(item => item.fips !== val) })
  })

  if (loading) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </div>
    )
  }
  if (error) return `Error! ${ error.message }`
  let chartData = [[]]
  if (data && cards && cards.length > 0) {
    const years = [...new Set(data.fiscal_revenue_summary.map(item => item.fiscal_year))]
    const sums = cards.map(yData => [...new Set(data.fiscal_revenue_summary.filter(row => row.state_or_area === yData.abbr).map(item => item.sum))])

    chartData = [years, ...sums]

    return (
        <Container id={utils.formatToSlug(title)}>
        <Grid item md={12}>
          <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
            <Box component="h4" color="secondary.dark">{title}</Box>
          </Box>
        </Grid>
        <Grid item md={12}>
          <LineChart
            data={chartData}
            chipLabels={cards}
            chartColors={[theme.palette.blue[300], theme.palette.orange[300], theme.palette.green[300], theme.palette.purple[300]]}
            lineDashes={LINE_DASHES}
            lineTooltip={
              (d, i) => {
                const r = []
                r[0] = utils.formatToDollarInt(d)
                return r
              }
            } />
          <Box mt={1} className={classes.chipContainer}>
            {
              cards.map((card, i) => {
                return (
                  <Chip
                    key={`RevenueOverTimeChip_${ card.fips }`}
                    variant='outlined'
                    onDelete={ e => handleDelete(e, card.fips)}
                    label={<ChipLabel labelIndex={i} label={card.name} />}
                    classes={{ root: classes.chipRoot }} />
                )
              })
            }
          </Box>
        </Grid>
      </Container>
    )
  }
  else {
    return (null)
  }
}

export default RevenueOverTime
