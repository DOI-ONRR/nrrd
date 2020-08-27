import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import * as d3 from 'd3'

import utils from '../../../../js/utils'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import CircleChart from '../../../data-viz/CircleChart/CircleChart'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    '& .chart-container': {
      // display: 'grid',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'top',
    }
  }
}))

const APOLLO_QUERY = gql`
  query RevenueTypes($state: String!, $year: Int!, $period: String!, $commodities: [String!]) {
    revenue_type_summary(
      where: { year: { _eq: $year }, location: { _eq: $state }, period: { _eq: $period}, commodity: {_in: $commodities} },
      order_by: { year: asc, total: desc }
    ) {
      year
      revenue_type
      location
      total
    }
  }
`

const RevenueDetailTypes = props => {
  const classes = useStyles()

  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR
  const dataSet = (period === DFC.PERIOD_FISCAL_YEAR) ? `FY ${ year }` : `CY ${ year }`
  const commodities = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY].split(',') : undefined
  const state = (props.fipsCode === DFC.NATIONWIDE_FEDERAL_ABBR || props.fipsCode === DFC.NATIVE_AMERICAN_ABBR) ? props.name : props.fipsCode

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: state, year: year, period: period, commodities: commodities }
  })
  const dataKey = dataSet + '-' + props.name
  let chartData

  if (loading) return ''

  if (error) return `Error! ${ error.message }`

  if (data) {
    //       chartData = data
    chartData = d3.nest()
	  .key(k => k.revenue_type)
	  .rollup(v => d3.sum(v, i => i.total))
	  .entries(data.revenue_type_summary)
	  .map(d => ({ revenue_type: d.key, total: d.value }))
  }

  return (
    <>
      { chartData && chartData.length > 0
        ? (
          <Box className={classes.root}>
            <Box component="h4" fontWeight="bold">Revenue types</Box>
            <Box>
              <CircleChart
                key={'RDTY' + dataKey }
                data={chartData} xAxis='revenue_type' yAxis='total'
                format={ d => utils.formatToDollarInt(d) }
                yLabel={dataSet}
                maxCircles={6}
                minColor='#FCBA8B'
                maxColor='#B64D00'
                circleTooltip={
                  d => {
                    // console.debug('circleLABLE yo: ', d)
                    const r = []
                    r[0] = d.revenue_type
                    r[1] = utils.formatToDollarInt(d.total)
                    return r
                  }
                } />
              {/*  <Box mt={3}>
                 <ExploreDataLink to="/query-data/?dataType=Revenue" icon="filter">
                Query revenue by type
                </ExploreDataLink>
                </Box>
             */}
            </Box>
          </Box>
        )
        : (
          <Box className={classes.boxSection}>
          </Box>
        )
      }
    </>
  )
}

export default RevenueDetailTypes
