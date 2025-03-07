import React, { useContext } from 'react'
// import { graphql } from 'gatsby'
import { useQuery, gql } from '@apollo/client'
// utility functions
import utils from '../../../../js/utils'
import { ExploreDataContext } from '../../../../stores/explore-data-store'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'
import * as d3 from 'd3'
import { useInView } from 'react-intersection-observer'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import LineChart from '../../../data-viz/LineChart/LineChart.js'
import ChipLabel from '../../ExploreData/ChipLabel'

import {
  Box,
  Container,
  Grid,
  Chip
} from '@material-ui/core'

const LINE_DASHES = ['1,0', '5,5', '10,10', '20,10,5,5,5,10']

const QUERY = gql`
  query FiscalProductionSummary($product: String!, $period: String!) {
    production_summary(
      where: { product: {_eq: $product}, period: {_eq: $period } }
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
      stroke: theme.palette.explore[400],
    },
    '& .MuiChip-root:nth-child(2) .line': {
      stroke: theme.palette.explore[300],
    },
    '& .MuiChip-root:nth-child(3) .line': {
      stroke: theme.palette.explore[200],
    },
    '& .MuiChip-root:nth-child(4) .line': {
      stroke: theme.palette.explore[100],
    }
  }
}))

const ProductionOverTime = props => {
  const classes = useStyles()
  const theme = useTheme()
  const title = props.title || ''
  const { state: filterState } = useContext(DataFilterContext)
  const { state: pageState, updateExploreDataCards } = useContext(ExploreDataContext)
  const cards = pageState.cards
  const product = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true
  })

  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      product: product, 
      period: period
    },
    skip: inView === false,
  });

  const handleDelete = props.handleDelete || ((e, fips) => {
    updateExploreDataCards({ ...pageState, cards: cards.filter(item => item.fipsCode !== fips) })
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
  if (data && cards && data.production_summary.length > 0 && cards.length > 0) {
    // const years = [...new Set(data.production_summary.map(item => item.year))]
    // const sums = cards.map(yData => [...new Set(data.production_summary.filter(row => row.location === yData.fipsCode).map(item => item.total))])

    const years = [...new Set(d3.nest()
      .key(k => k.year)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(data.production_summary)
      .map(d => parseInt(d.key))
    )]

    const sums = cards.map(yData => [...new Set(
      d3.nest()
        .key(k => k.year)
        .rollup(v => d3.sum(v, i => i.total))
        .entries(data.production_summary.filter(row => row.location === yData.fipsCode))
        .map(d => ({ year: parseInt(d.key), value: d.value }))
    )])

    // eslint-disable-next-line no-unused-vars
    for (const [i, arr] of sums.entries()) {
      sums[i] = years.map(year => {
        const sum = sums[i].find(x => x.year === year)
        return sum ? sum.value : 0
      })
    }

    const units = cards.map(yData => [...new Set(data.production_summary.filter(row => row.location === yData.fipsCode).map(item => item.unit_abbr))])

    chartData = [years, ...sums]

    // console.log('chartData: ', chartData)

    return (
      <div ref={ref} >
        <Container id={utils.formatToSlug(title)}>
          <Grid item md={12}>
            <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
              <Box component="h4" color="secondary.dark">{`${ title } (${ units[0] })`}</Box>
            </Box>
          </Grid>
          <Grid item md={12}>
            <LineChart
              key={'POT' + period + cards.length + product }
              data={chartData}
              chartColors={[theme.palette.explore[400], theme.palette.explore[300], theme.palette.explore[200], theme.palette.explore[100]]}
              lineDashes={LINE_DASHES}
              lineTooltip={
                (d, i) => {
                  const r = []
                  r[0] = `${ cards[i].locationName }: ${ utils.formatToCommaInt(d) } (${ units[i] })`
                  return r
                }
              } />
            <Box mt={1} className={classes.chipContainer}>
              {
                cards.map((card, i) => {
                  return (
                    <Chip
                      key={`ProductionOverTimeChip_${ card.fipsCode }`}
                      variant='outlined'
                      onDelete={ e => handleDelete(e, card.fipsCode)}
                      label={<ChipLabel labelIndex={i} label={card.locationName} />}
                      classes={{ root: classes.chipRoot }} />
                  )
                })
              }
            </Box>
          </Grid>
        </Container>
      </div>
    )
  }
  else {
    return (
	  <Box className={classes.root} ref={ref}>
	  </Box>

    )
  }
}

export default ProductionOverTime
