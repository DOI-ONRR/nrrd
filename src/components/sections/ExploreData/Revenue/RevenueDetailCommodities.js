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
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.FISCAL_YEAR_LABEL
  const commodities = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY].split(',') : undefined
  let locationName = props.locationName

  if (state.length === 3) {
    locationName = `${ props.regionType } ${ props.locationName }`
  }

  if (state.length === 5) {
    locationName = props.name
  }

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { year: year, state: state, period: period, commodities }
  })

  const dataSet = (period === DFC.FISCAL_YEAR_LABEL) ? `FY ${ year }` : `CY ${ year }`
  const dataKey = dataSet + '-' + state + (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'ALL'

  // get year range from selected year
  const getYearRange = (start, end) => {
    return new Array(end - start + 1).fill().map((_, idx) => start + idx)
  }

  const periodParam = (period === DFC.FISCAL_YEAR_LABEL) ? DFC.FISCAL_YEAR : DFC.CALENDAR_YEAR
  const yearRange = getYearRange((parseInt(year) - 5), parseInt(year))

  // Get query url
  const getQueryUrl = (baseSegment, fipsCode) => {
    const sharedParams = `/${ baseSegment }/?dataType=${ DFC.REVENUE }&period=${ period }&${ periodParam }=${ yearRange }`
    let queryLink

    // State
    if (fipsCode.length === 2) {
    // Nationwide Federal
      if (fipsCode === DFC.NATIONWIDE_FEDERAL_FIPS) {
        queryLink = `${ sharedParams }&groupBy=${ DFC.COMMODITY }&landType=Federal - not tied to a lease,Federal Offshore,Federal Onshore`
      }

      // Native American
      else if (fipsCode === DFC.NATIVE_AMERICAN_FIPS) {
        queryLink = `${ sharedParams }&groupBy=${ DFC.COMMODITY }&landType=${ DFC.NATIVE_AMERICAN }`
      }

      else {
        queryLink = `${ sharedParams }&groupBy=${ DFC.COMMODITY }&stateOffshoreName=${ locationName }`
      }
    }

    // Offshore
    if (fipsCode.length === 3) {
      queryLink = `${ sharedParams }&groupBy=${ DFC.COMMODITY }&stateOffshoreName=${ locationName }`
    }

    // County
    if (fipsCode.length === 5) {
      queryLink = `${ sharedParams }&groupBy=${ DFC.COUNTY }&stateOffshoreName=${ locationName }`
    }

    return queryLink
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
                <Link href={getQueryUrl('query-data', state)} linkType="FilterTable">
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
