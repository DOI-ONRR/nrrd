import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import * as d3 from 'd3'
import utils from '../../../../js/utils'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import CircleChart from '../../../data-viz/CircleChart/CircleChart'
import Link from '../../../../components/Link'

import { makeStyles, useTheme } from '@material-ui/core/styles'
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
  console.log('RevenueDetailCommodities props: ', props)
  const classes = useStyles()
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const state = props.fipsCode
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : 'Fiscal Year'
  const commodities = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY].split(',') : undefined

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { year: year, state: state, period: period, commodities }
  })

  const dataSet = (period === 'Fiscal Year') ? `FY ${ year }` : `CY ${ year }`
  const dataKey = dataSet + '-' + state + (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'ALL'

  const getQueryParams = fipsCode => {
    let params

    // Nationwide Federal
    if (fipsCode === 'NF') {
      params = `/query-data?dataType=${ DFC.REVENUE }&period=${ period }&landType=${ DFC.NATIONWIDE_FEDERAL }&groupBy=${ DFC.COMMODITY }`
    }

    // Native American
    if (fipsCode === 'NA') {
      params = `/query-data?dataType=${ DFC.REVENUE }&period=${ period }&landType=${ DFC.NATIVE_AMERICAN }&groupBy=${ DFC.COMMODITY }`
    }

    // State
    if (fipsCode.length === 2 && (fipsCode !== 'NF' && fipsCode !== 'NA')) {
      params = `/query-data?dataType=${ DFC.REVENUE }&period=${ period }&stateOffshoreName=New Mexico&groupBy=${ DFC.COMMODITY }`
    }

    // County
    if (fipsCode.length === 5) {
      params = `/query-data?dataType=${ DFC.REVENUE }&period=${ period }&county=Washoe County,NV&groupBy=${ DFC.COMMODITY }`
    }

    // Offshore
    if (fipsCode.length === 3) {
      params = `/query-data?dataType=${ DFC.REVENUE }&period=${ period }&county=Pacific Region&groupBy=${ DFC.COMMODITY }`
    }

    return params
  }

  let chartData

  if (loading) return ''
  if (error) return `Error! ${ error.message }`

  if (data) {
    chartData = data
  }

  return (
    <>
	  { (chartData.revenue_summary.length > 0)
        ? (
          <Box className={classes.root}>
            <Box component="h4" fontWeight="bold">Commodities</Box>
            <Box>
              <CircleChart key={'RDC' + dataKey} data={chartData.revenue_summary}
                xAxis='commodity' yAxis='total'
                format={ d => {
                  return utils.formatToDollarInt(d)
                }
                }
                circleTooltip={
                  d => {
                    const r = []
                    r[0] = d.commodity
                    r[1] = utils.formatToDollarInt(d.total)
                    return r
                  }
                }
                yLabel={dataSet}
                maxCircles={6}
                minColor={theme.palette.purple[100]}
                maxColor={theme.palette.purple[600]} />
              <Box mt={3}>
                <Link href={getQueryParams(state)} linkType="FilterTable">
                  Query revenue by commodity
                </Link>
              </Box>

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

export default RevenueDetailCommodities
