import React, { useContext } from 'react'
// import { graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
// utility functions
import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

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
  query FiscalProductionSummary($commodity: String!, $period: String!) {
    production_summary(
      where: { commodity: {_eq: $commodity}, period: {_eq: $period } }
      order_by: { year: asc }
    ) {
      year
      location
      total
      unit_abbr
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

const ProductionOverTime = props => {
  const classes = useStyles()
  const theme = useTheme()
  const title = props.title || ''
  const { state: filterState } = useContext(DataFilterContext)
  const { state: pageState, dispatch } = useContext(StoreContext)
  const cards = pageState.cards
  const commodity = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : 'Fiscal Year'
  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { commodity: commodity, period: period }
  })

  const handleDelete = props.handleDelete || ((e, val) => {
    dispatch({ type: 'CARDS', payload: cards.filter(item => item.fipsCode !== val) })
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
  if (data && data.production_summary.length > 0 && cards && cards.length > 0) {
    const years = [...new Set(data.production_summary.map(item => item.year))]
    const sums = cards.map(yData => [...new Set(data.production_summary.filter(row => row.location === yData.abbr).map(item => item.total))])
    const units = cards.map(yData => [...new Set(data.production_summary.filter(row => row.location === yData.abbr).map(item => item.unit_abbr))])

    chartData = [years, ...sums]

    return (
      <Container id={utils.formatToSlug(title)}>
        <Grid item md={12}>
          <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
            <Box component="h4" color="secondary.dark">{title + ' (' + units[0] + ')' }</Box>
          </Box>
        </Grid>
        <Grid item md={12}>
          <LineChart
            key={'POT' + period + cards.length } 
            data={chartData}
            chartColors={[theme.palette.blue[300], theme.palette.orange[300], theme.palette.green[300], theme.palette.purple[300]]}
            lineDashes={LINE_DASHES}
            lineTooltip={
              (d, i) => {
                const r = []
                r[0] = `${ cards[i].name }: ${ utils.formatToCommaInt(d) } ${ units[i] }`
                return r
              }
            } />
          <Box mt={1} className={classes.chipContainer}>
            {
              cards.map((card, i) => {
                return (
                  <Chip
                    key={`ProductionOverTimeChip_${ card.fips }`}
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

export default ProductionOverTime
