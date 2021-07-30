import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { formatToDollarInt } from '../../../../js/utils'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import { CircleChart } from '../../../data-viz/CircleChart'
import QueryLink from '../../../../components/QueryLink'
import { useInView } from 'react-intersection-observer'
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
    },
  }
}))

const APOLLO_QUERY = gql`
    query RevenueCommodityQuery($year: Int!, $state: String!, $period: String!, $commodities: [String!]) {
	# Revenue commodity summary
	revenue_summary(
	    where: { year: { _eq: $year }, location: { _eq: $state }, period: { _eq: $period}, commodity: {_in: $commodities} },
	    order_by: { year: asc, total: desc }
	) {
	    year
	    commodity
	    location
	    total
	}
    }
`

const RevenueDetailCommodities = props => {
  // console.log('RevenueDetailCommodities props: ', props)
  const classes = useStyles()
  // not used const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const state = props.fipsCode
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.FISCAL_YEAR_LABEL
  const commodities = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY].split(',') : undefined

  const dataSet = (period === DFC.FISCAL_YEAR_LABEL) ? `FY ${ year }` : `CY ${ year }`
  const dataKey = `${ dataSet }-${ state }`
  const xAxis = 'commodity'
  const yAxis = 'total'

  const isCounty = state && state.length === 5
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true
  })

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { year: year, state: state, period: period, commodities },
    skip: inView === false
  })

  let chartData

  if (loading) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </div>
    )
  }
  if (error) return `Error! ${ error.message }`

  if (data) {
    chartData = data

    return (
	    <div ref={ref}>
	      { (chartData.revenue_summary.length > 0)
          ? (
		    <Box className={classes.root}>
		      <Box component="h4" fontWeight="bold">Commodities</Box>
		      <Box>
                <CircleChart
                  key={`RDC__${ dataKey }`}
                  data={chartData.revenue_summary}
                  xAxis={xAxis}
                  yAxis={yAxis}
                  maxCircles={6}
                  legendHeaders={['Commodity', 'Total']}
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
                <QueryLink
                  groupBy={isCounty ? DFC.COUNTY : DFC.COMMODITY}
                  landType="Federal - not tied to a lease,Federal Offshore,Federal Onshore"
                  linkType="FilterTable"
                  breakoutBy={DFC.COMMODITY}
                  {...props}>
                Query revenue by commodity
                </QueryLink>
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

export default RevenueDetailCommodities
