import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import * as d3 from 'd3'

import { formatToDollarInt } from '../../../../js/utils'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'
import { useInView } from 'react-intersection-observer'

import { CircleChart } from '../../../data-viz/CircleChart'
import QueryLink from '../../../../components/QueryLink'
import CircularProgress from '@material-ui/core/CircularProgress'

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
      display: 'flex',
      flexDirection: 'column',
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
  // not used const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR
  const dataSet = (period === DFC.PERIOD_FISCAL_YEAR) ? `FY ${ year }` : `CY ${ year }`
  const commodities = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY].split(',') : undefined
  const state = (props.fipsCode === DFC.NATIONWIDE_FEDERAL_ABBR || props.fipsCode === DFC.NATIVE_AMERICAN_ABBR) ? props.name : props.fipsCode

  const isCounty = props.fipsCode && props.fipsCode.length === 5
  // const isNativeAmerican = props.fipsCode && props.fipsCode === DFC.NATIVE_AMERICAN_FIPS
  // const isNationwideFederal = props.fipsCode && props.fipsCode === DFC.NATIONWIDE_FEDERAL_FIPS
  // const isState = props.fipsCode && props.fipsCode.length === 2 && !isNativeAmerican && !isNationwideFederal
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true
  })

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: state, year: year, period: period, commodities: commodities },
    skip: inView === false
  })
  const dataKey = dataSet + '-' + props.name
  let chartData

  const xAxis = 'revenue_type'
  const yAxis = 'total'

  if (loading) {
    return (<div className={classes.progressContainer} ref={ref}>
      <CircularProgress classes={{ root: classes.circularProgressRoot }} />
    </div>)
  }

  if (error) return `Error! ${ error.message }`

  if (data) {
    //       chartData = data
    chartData = d3.nest()
	  .key(k => k.revenue_type)
	  .rollup(v => d3.sum(v, i => i.total))
	  .entries(data.revenue_type_summary)
	  .map(d => ({ revenue_type: d.key, total: d.value }))

    return (
	  <div ref={ref}>
	    { chartData && chartData.length > 0
	    ? (
	    <Box className={classes.root}>
	      <Box component="h4" fontWeight="bold">Revenue types</Box>
	      <Box>
                <CircleChart
                  key={`RDTY__${ dataKey }`}
                  data={chartData}
                  xAxis={xAxis}
                  yAxis={yAxis}
                  maxCircles={6}
                  legendHeaders={['Revenue type', 'Total']}
                  showLabels={false}
                  showTooltips={true}
                  chartTooltip={
                    d => {
                      const r = []
                      r[0] = d.data[xAxis]
                      r[1] = formatToDollarInt(d.data[yAxis])
                      return r
                    }
                  }
                  labelFormat={d => formatToDollarInt(d)}
                  legendFormat={d => formatToDollarInt(d)} />
                {!isCounty &&
		<QueryLink
		    groupBy={DFC.REVENUE_TYPE}
		    landType="Federal - not tied to a lease,Federal Offshore,Federal Onshore"
		    linkType="FilterTable"
		  {...props}>
		  Query revenue by type
		</QueryLink>
                }
                {isCounty &&
		<QueryLink
		    groupBy={DFC.COUNTY}
		    landType="Federal - not tied to a lease,Federal Offshore,Federal Onshore"
		    linkType="FilterTable"
		    breakoutBy={DFC.REVENUE_TYPE}
		  {...props}>
		  Query revenue by type
		</QueryLink>
                }
	      </Box>
	    </Box>
	    )
	  : (
	      <Box className={classes.boxSection}>
	      </Box>
	  )
	    }
	  </div>
    )
  }
  else {
    return (<div className={classes.progressContainer} ref={ref}>
      <CircularProgress classes={{ root: classes.circularProgressRoot }} />
    </div>)
  }
}

export default RevenueDetailTypes
