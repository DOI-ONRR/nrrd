import React, { useContext } from 'react'
// import { graphql } from 'gatsby'
import { useQuery, gql } from 'urql'
// utility functions
import utils from '../../../../js/utils'
import { ExploreDataContext } from '../../../../stores/explore-data-store'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'
import * as d3 from 'd3'
import { useInView } from 'react-intersection-observer'
import CircularProgress from '@material-ui/core/CircularProgress'

import { makeStyles, useTheme } from '@material-ui/core/styles'

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
    query RevenueOverTime($period: String!, $commodities: [String!]) {
	revenue_summary(where: {period: {_eq: $period}, commodity: {_in: $commodities}, location: {_neq: ""}}, order_by: {year: asc}) {
	    year
	    location
	    total
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

const RevenueOverTime = props => {
  const classes = useStyles()
  const theme = useTheme()

  const { title } = props
  const { state: filterState } = useContext(DataFilterContext)
  const { state: pageState, updateExploreDataCards } = useContext(ExploreDataContext)
  const cards = pageState.cards
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR
  const commodities = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY].split(',') : undefined
  const commodityKey = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'all'
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true
  })

  const [result, _reexecuteQuery] = useQuery({
    query: QUERY,
    variables: { 
      period: period, 
      commodities: commodities 
    },
    pause: inView === false,
  });

  const { data, fetching, error } = result;

  const handleDelete = props.handleDelete || ((e, fips) => {
    updateExploreDataCards({ ...pageState, cards: cards.filter(item => item.fipsCode !== fips) })
  })

  if (fetching) {
    return (
      <Box display="flex" justifyContent="center" id={utils.formatToSlug(title)} ref={ref} height={300}>
        <CircularProgress />
      </Box>
    )
  }
  if (error) return `Error! ${ error.message }`
  let chartData = [[]]
  if (data && cards && cards.length > 0 && data.revenue_summary.length > 0) {
    const years = [...new Set(d3.nest()
      .key(k => k.year)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(data.revenue_summary)
      .map(d => parseInt(d.key))
    )]

    const sums = cards.map(yData => [...new Set(
      d3.nest()
        .key(k => k.year)
        .rollup(v => d3.sum(v, i => i.total))
        .entries(data.revenue_summary.filter(row => row.location === yData.fipsCode))
        .map(d => ({ year: parseInt(d.key), value: d.value }))
    )])

    // eslint-disable-next-line no-unused-vars
    for (const [i, arr] of sums.entries()) {
      sums[i] = years.map(year => {
        const sum = sums[i].find(x => x.year === year)
        return sum ? sum.value : 0
      })
    }

    //  data.fiscal_revenue_summary.filter(row => row.state_or_area === yData.abbr).map(item => item.sum)
    chartData = [years, ...sums]
    // console.debug('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCHARRRT DAAAAAAAAAAAAAAAAAAAAATA', chartData)
    return (
      <Container id={utils.formatToSlug(title)} ref={ref}>
        <Grid item md={12}>
          <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
            <Box component="h4" color="secondary.dark">{title}</Box>
          </Box>
        </Grid>
        <Grid item md={12}>
          <LineChart
		       key={'ROT' + commodityKey + period}
		       data={chartData}
		       chartColors={[theme.palette.explore[400], theme.palette.explore[300], theme.palette.explore[200], theme.palette.explore[100]]}
		       lineDashes={LINE_DASHES}
		       lineTooltip={
              (d, i) => {
                const r = []
                r[0] = `${ cards[i].locationName }: ${ utils.formatToDollarInt(d) }`
                return r
              }
            }
            svgTitle='A line graph that shows the change in the value of the data over time. This graph compares Nationwide Federal and Native American sources.'
          />
          <Box mt={1} className={classes.chipContainer}>
            {
		  cards.map((card, i) => {
                return (
			  <Chip
			      key={`RevenueOverTimeChip_${ card.fipsCode }`}
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
    )
  }
  else {
    return (
      <Box display="flex" justifyContent="center" id={utils.formatToSlug(title)} ref={ref} height={300}>
        <CircularProgress />
      </Box>
    )
  }
}

export default RevenueOverTime
