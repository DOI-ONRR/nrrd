import React, { useContext, useRef } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {
  Box,
  Grid
} from '@material-ui/core'

import { useTheme } from '@material-ui/core/styles'

// not used import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'
import StackedBarChart2 from '../../data-viz/StackedBarChart/StackedBarChart2'
// not used import SectionHeader from '../../sections/SectionHeader'
// not used import HomeDataFilters from '../../../components/toolbars/HomeDataFilters'
import Link from '../../../components/Link/'
import ComparisonTable from '../ComparisonTable'

import utils, { formatDate } from '../../../js/utils'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const FISCAL = gql`
    query TotalYearlyRevenue($period_group: String!, $breakout_group: String!)  {  
	total_yearly_fiscal_revenue: total_revenue_summary(
	  where: {period_group: {_eq: $period_group},  
	  breakout_group:  {_eq: $breakout_group}}, 
	  order_by: {fiscal_year: asc, fiscal_month: asc, sort_order: asc}) {
	    period
	    sum
	    source
	    year: fiscal_year
	    revenue_type
	    sort_order
	    commodity
	    fiscalMonth: fiscal_month
	    currentMonth: month
	    monthLong: month_long
	}

    }
`

const CALENDAR = gql`
    query TotalYearlyRevenue($period_group: String!, $breakout_group: String!) {  
	total_yearly_calendar_revenue: total_revenue_summary(
	  where: {period_group: {_eq: $period_group},  
	  breakout_group:  {_eq: $breakout_group}}, 
	    order_by: {calendar_year: asc, month: asc, sort_order: asc}) {
	    period
	    sum
	    source
	    year: calendar_year
	    revenue_type
	    sort_order
	    commodity
            currentMonth: month
	    monthLong: month_long
	}
	
    }
`

const TOTAL_REVENUE_QUERY = gql`
    query TotalYearlyRevenue($period_group: String!, $breakout_group: String!) {
	total_yearly_fiscal_revenue: total_revenue_summary(
	    where: {period_group: {_eq: $period_group},  breakout_group:  {_eq: $breakout_group}}, 
	    order_by: {fiscal_year: asc,fiscal_month: asc,  sort_order: asc}) {
	    period
	    sum
	    source
	    year: fiscal_year
	    revenue_type
	    sort_order
	    commodity
	    fiscalMonth: fiscal_month
	    currentMonth: month
	    monthLong: month_long
	}

	total_yearly_calendar_revenue: total_revenue_summary(
	    where: {period_group: {_eq: $period_group},  breakout_group:  {_eq: $breakout_group}}, 
	    order_by: {calendar_year: asc, month: asc, sort_order: asc}) {
	    period
	    sum
	    source
	    year: calendar_year
	    revenue_type
	    sort_order
	    commodity
	    monthLong: month_long
	}

	total_monthly_fiscal_revenue( order_by: {year: asc, month: asc, sort_order: asc})  {
	    source: land_type
	    sum
	    month_long
	    period_date
	    month
	    year
	    revenue_type
	    sort_order
	    commodity
	}

	total_monthly_calendar_revenue( order_by: {year: asc, month: asc, sort_order: asc}) {
	    source: land_type
	    sum
	    month_long
	    period_date
	    month
	    year
	    revenue_type
	    sort_order
	    commodity
	}

	total_monthly_last_twelve_revenue( order_by: {year: asc, month: asc, sort_order: asc}) {
	    source: land_type
	    sum
	    month_long
	    period_date
	    month
	    year
	    revenue_type
	    sort_order
	    commodity_order
	    commodity
	}

	total_monthly_last_three_years_revenue( order_by: {year: asc, month: asc, sort_order: asc}) {
	    source: land_type
	    sum
	    month_long
	    period_date
	    month
	    year
	    revenue_type
	    sort_order
	    commodity_order
	    commodity
	}
    }
`
/*

   create or replace view total_revenue_summary as
   select * from _mview_cy_commodity
   union
   select * from _mview_cy_revenue_type
   union
   select * from _mview_cy_source
   union
   select * from _mview_fy_commodity
   union
   select * from _mview_fy_revenue_type
   union
   select * from _mview_fy_source
 */
// TotalRevenue component
const TotalRevenue = props => {
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  filterState.period = (filterState.monthly !== DFC.MONTHLY_CAPITALIZED && filterState.period === 'Most recent 12 months') ? DFC.PERIOD_FISCAL_YEAR : filterState.period
  const { monthly, period, breakoutBy, periodAllYears } = filterState
  const revenueComparison = useRef(null)

  const chartTitle = props.chartTitle || `${ DFC.REVENUE } by ${ period.toLowerCase() } (dollars)`
  const periodAbbr = (period === DFC.PERIOD_FISCAL_YEAR) ? 'FY' : 'CY'
  let QUERY = FISCAL
  let VARIABLES = { period_group: 'Fiscal Year', breakout_group: 'source' }

  if (filterState.period === DFC.PERIOD_FISCAL_YEAR && filterState.monthly !== DFC.MONTHLY_CAPITALIZED) {
    QUERY = FISCAL
    VARIABLES = { period_group: period || 'Fiscal Year', breakout_group: breakoutBy || 'source' }
  }
  else if (filterState.period === DFC.PERIOD_CALENDAR_YEAR && filterState.monthly !== DFC.MONTHLY_CAPITALIZED) {
    QUERY = CALENDAR
    VARIABLES = { period_group: filterState.period || 'Calendar Year', breakout_group: filterState.breakoutBy || 'source' }
  }
  else {
    VARIABLES = { period_group: filterState.period || 'Fiscal Year', breakout_group: filterState.breakoutBy || 'source' }
    QUERY = TOTAL_REVENUE_QUERY
  }

  const { loading, error, data } = useQuery(QUERY, { variables: VARIABLES })

  const handleBarHover = d => {
    revenueComparison.current.setSelectedItem(d[2])
  }

  if (loading) {
    return 'Loading...'
  }

  if (error) return `Error! ${ error.message }`
  let chartData
  let comparisonData
  let xAxis
  const yAxis = 'sum'
  const yGroupBy = breakoutBy || DFC.SOURCE
  let xLabels = 'month'
  const units = 'dollars'
  let maxFiscalYear
  let maxCalendarYear
  let xGroups = {}
  let legendHeaders
  let currentMonthNum
  let currentYearSoFarText = ''
  const monthRange = []
  let monthRangeText
  let startMonth
  let endMonth
  let yOrderBy
  let commodityChartData
  let commodityChartComparisonData

  switch (breakoutBy) {
  case 'revenue_type':
    yOrderBy = ['Other revenues', 'Inspection fees', 'Civil penalties', 'Rents', 'Bonus', 'Royalties']
    break
  case 'commodity':
    yOrderBy = ['Not tied to a commodity', 'Other commodities', 'Coal', 'Gas', 'Oil']
    break
  default:
    yOrderBy = ['Federal - not tied to a lease', 'Native American', 'Federal offshore', 'Federal onshore']
    break
  }

  // commodity chart data, roll up of Other commodities
  const rollUpCommodityData = cData => {
    const topCommoditiesData = []
    const otherCommoditiesData = []
    cData.map(item => {
      if (yOrderBy.includes(item.commodity)) {
        topCommoditiesData.push(item)
      }
      else {
        const newObj = { ...item, commodity: 'Other commodities', commodityName: item.commodity, commodity_order: 1 }
        otherCommoditiesData.push(newObj)
      }
    })
    commodityChartData = [...topCommoditiesData, ...otherCommoditiesData]
    return commodityChartData
  }

  if (data) {
    // console.log('TotalRevenue data: ', data)

    maxFiscalYear = periodAllYears[DFC.PERIOD_FISCAL_YEAR][periodAllYears[DFC.PERIOD_FISCAL_YEAR].length - 1]
    maxCalendarYear = periodAllYears[DFC.PERIOD_CALENDAR_YEAR][periodAllYears[DFC.PERIOD_CALENDAR_YEAR].length - 1]

    // Month range
    if (monthly === DFC.MONTHLY_CAPITALIZED) {
	    if (period === DFC.PERIOD_FISCAL_YEAR) {
	      currentMonthNum = data.total_yearly_fiscal_revenue[data.total_yearly_fiscal_revenue.length - 1].currentMonth

        switch (yGroupBy) {
		  case 'revenue_type':
		      comparisonData = data.total_monthly_fiscal_revenue.filter(item => yOrderBy.includes(item.revenue_type))
          chartData = data.total_monthly_fiscal_revenue.filter(item => (item.year >= maxFiscalYear && yOrderBy.includes(item.revenue_type)))
          break
        case 'commodity':
          commodityChartData = rollUpCommodityData(data.total_monthly_fiscal_revenue)
          comparisonData = commodityChartData.filter(item => yOrderBy.includes(item.commodity))
          chartData = commodityChartData.filter(item => (item.year >= maxFiscalYear && yOrderBy.includes(item.commodity)))
          break
        default:
          comparisonData = data.total_monthly_fiscal_revenue
          chartData = data.total_monthly_fiscal_revenue.filter(item => item.year >= maxFiscalYear)
          break
        }
      }
      else if (period === DFC.PERIOD_CALENDAR_YEAR) {
	  currentMonthNum = data.total_yearly_calendar_revenue[data.total_yearly_calendar_revenue.length - 1].currentMonth

        switch (yGroupBy) {
        case 'revenue_type':
		  comparisonData = data.total_monthly_calendar_revenue.filter(item => yOrderBy.includes(item.revenue_type))
          chartData = data.total_monthly_calendar_revenue.filter(item => (item.year >= maxCalendarYear && yOrderBy.includes(item.revenue_type)))
          break
        case 'commodity':
          commodityChartData = rollUpCommodityData(data.total_monthly_calendar_revenue)
          comparisonData = commodityChartData.filter(item => yOrderBy.includes(item.commodity))
          chartData = commodityChartData.filter(item => (item.year >= maxCalendarYear && yOrderBy.includes(item.commodity)))
          break
        default:
          comparisonData = data.total_monthly_calendar_revenue
          chartData = data.total_monthly_calendar_revenue.filter(item => item.year >= maxCalendarYear)
          break
        }
      }
      else {
        switch (yGroupBy) {
        case 'revenue_type':
          comparisonData = data.total_monthly_last_three_years_revenue.filter(item => yOrderBy.includes(item.revenue_type))
          chartData = data.total_monthly_last_twelve_revenue.filter(item => yOrderBy.includes(item.revenue_type))
          break
        case 'commodity':
          commodityChartComparisonData = rollUpCommodityData(data.total_monthly_last_three_years_revenue)
          commodityChartData = rollUpCommodityData(data.total_monthly_last_twelve_revenue)
          comparisonData = commodityChartComparisonData.filter(item => yOrderBy.includes(item.commodity))
          chartData = commodityChartData.filter(item => yOrderBy.includes(item.commodity))
          break
        default:
          comparisonData = data.total_monthly_last_three_years_revenue
          chartData = data.total_monthly_last_twelve_revenue
          break
        }
      }

      xGroups = chartData.reduce((g, row, i) => {
        // console.log('xGroup g, row: ', g, row)
        const r = g
        const year = row.period_date.substring(0, 4)
        const months = g[year] || []
        months.push(months)
        r[year] = months
        return r
      }, {})

      xAxis = 'period_date'

      xLabels = (x, i) => {
        return x.map(v => {
          const dateArr = formatDate(v)
          const date = new Date(dateArr[0], dateArr[1], dateArr[2])
          const month = date.toLocaleDateString('en-US', { month: 'short' })
          return month
        })
      }

      legendHeaders = (headers, row) => {
        // console.log('legendHeaders: ', headers, row)
        const dateArr = formatDate(headers[1])
        const year = dateArr[0]
        const date = new Date(dateArr[0], dateArr[1], dateArr[2])
        const month = date.toLocaleString('en-US', { month: 'short' })
        const headerArr = [(breakoutBy === 'revenue_type') ? 'Revenue type' : breakoutBy.charAt(0).toUpperCase() + breakoutBy.slice(1), `${ month } ${ year }`]
        return headerArr
      }
    }
    else {
      if (period === DFC.PERIOD_FISCAL_YEAR) {
	  currentMonthNum = data.total_yearly_fiscal_revenue[data.total_yearly_fiscal_revenue.length - 1].currentMonth
        switch (yGroupBy) {
        case 'revenue_type':
          comparisonData = data.total_yearly_fiscal_revenue.filter(item => yOrderBy.includes(item.revenue_type))
          chartData = data.total_yearly_fiscal_revenue.filter(item => (item.year >= maxFiscalYear - 9 && yOrderBy.includes(item.revenue_type)))
          break
        case 'commodity':
          commodityChartData = rollUpCommodityData(data.total_yearly_fiscal_revenue)
          comparisonData = commodityChartData.filter(item => yOrderBy.includes(item.commodity))
          chartData = commodityChartData.filter(item => (item.year >= maxFiscalYear - 9 && yOrderBy.includes(item.commodity)))
          break
        default:
          comparisonData = data.total_yearly_fiscal_revenue
          chartData = data.total_yearly_fiscal_revenue.filter(item => item.year >= maxFiscalYear - 9)
          break
        }
        xGroups[DFC.PERIOD_FISCAL_YEAR] = chartData.map((row, i) => row.year)
        data.total_yearly_fiscal_revenue.filter(item => {
          if (item.year === (maxFiscalYear + 1)) {
            if (monthRange.indexOf(item.monthLong) === -1) {
              monthRange.push(item.monthLong)
	    }
	  }
        })
      }
      else {
	  currentMonthNum = data.total_yearly_calendar_revenue[data.total_yearly_calendar_revenue.length - 1].currentMonth
        switch (yGroupBy) {
        case 'revenue_type':
		  comparisonData = data.total_yearly_calendar_revenue.filter(item => yOrderBy.includes(item.revenue_type))
          chartData = data.total_yearly_calendar_revenue.filter(item => item.year >= maxCalendarYear - 9 && yOrderBy.includes(item.revenue_type))
          break
        case 'commodity':
          commodityChartData = rollUpCommodityData(data.total_yearly_calendar_revenue)
          comparisonData = commodityChartData.filter(item => yOrderBy.includes(item.commodity))
          chartData = commodityChartData.filter(item => item.year >= maxCalendarYear - 9 && yOrderBy.includes(item.commodity))
          break
        default:
          comparisonData = data.total_yearly_calendar_revenue
          chartData = data.total_yearly_calendar_revenue.filter(item => item.year >= maxCalendarYear - 9)
          break
        }

        xGroups[DFC.PERIOD_CALENDAR_YEAR] = chartData.map((row, i) => row.year)

        data.total_yearly_calendar_revenue.filter(item => {
          if (item.year === (maxCalendarYear + 1)) {
            if (monthRange.indexOf(item.monthLong) === -1) monthRange.push(item.monthLong)
          }
        })
      }
      if (monthRange.length > 0) {
        startMonth = monthRange[0]
        endMonth = monthRange[monthRange.length - 1]
        monthRangeText = startMonth === endMonth ? `(${ startMonth.substring(0, 3) })` : `(${ startMonth.substring(0, 3) } - ${ endMonth.substring(0, 3) })`
        currentYearSoFarText = `so far ${ monthRangeText }`
      }
      xAxis = 'year'
      xLabels = (x, i) => {
        return x.map(v => '\'' + v.toString().substr(2))
      }

      legendHeaders = (headers, row) => {
	    let headerLabel = `${ periodAbbr } ${ headers[1] }`
	    if (period === DFC.PERIOD_FISCAL_YEAR) {
          headerLabel = `${ periodAbbr } ${ headers[1] } ${ (currentMonthNum !== parseInt('09') && headers[1] > maxFiscalYear) ? currentYearSoFarText : '' }`
	    }
        else {
	        headerLabel = `${ periodAbbr } ${ headers[1] } ${ (currentMonthNum !== parseInt('12') && headers[1] > maxCalendarYear) ? currentYearSoFarText : '' }`
	    }
        const headerArr = [(breakoutBy === 'revenue_type') ? 'Revenue type' : breakoutBy.charAt(0).toUpperCase() + breakoutBy.slice(1), headerLabel]
        return headerArr
      }
    }

    // console.log('TotalRevenue chartData: ', chartData)
  }
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <StackedBarChart2
            key={`trsbc__${ monthly }${ period }${ breakoutBy }`}
            data={chartData}
            legendFormat={v => utils.formatToDollarInt(v)}
            title={chartTitle}
            units={units}
            xAxis={xAxis}
            xLabels={xLabels}
            yAxis={yAxis}
            xGroups={xGroups}
            yGroupBy={yGroupBy}
            yOrderBy={yOrderBy}
            legendHeaders={legendHeaders}
            primaryColor={theme.palette.explore[700]}
            secondaryColor={theme.palette.explore[100]}
            handleBarHover={d => handleBarHover(d)}
          />
          <Box fontStyle="italic" textAlign="left" fontSize="h6.fontSize">
		        <Link href='/downloads/revenue/'>Source file</Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <ComparisonTable
            key={`trct__${ monthly }${ period }${ breakoutBy }`}
            ref={revenueComparison}
            data={comparisonData}
            yGroupBy={yGroupBy}
            yOrderBy={yOrderBy}
            monthRange={monthRange}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default TotalRevenue
