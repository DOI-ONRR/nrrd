import React, { useContext, useRef } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {
  Box,
  Grid
} from '@material-ui/core'

import { useTheme } from '@material-ui/core/styles'

import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'
import SectionHeader from '../../sections/SectionHeader'
import SectionControls from '../../sections/SectionControls'
import Link from '../../../components/Link/'
import ComparisonTable from '../ComparisonTable'

import utils from '../../../js/utils'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const TOTAL_REVENUE_QUERY = gql`
  query TotalYearlyRevenue {
    # total_yearly_fiscal_revenue { 
    #   year,
    #   source,
    #   sum
    # }
    total_yearly_fiscal_revenue: total_yearly_fiscal_revenue_2 {
      period
      sum
      source: land_type
      year
      revenue_type
      sort_order
      commodity_order
      commodity
    }
    # total_yearly_calendar_revenue { 
    #   year,
    #   source,
    #   sum
    # }
    total_yearly_calendar_revenue: total_yearly_calendar_revenue_2 {
      period
      sum
      source: land_type
      year
      revenue_type
      sort_order
      commodity_order
      commodity
    }
    # total_monthly_fiscal_revenue {
    #   source
    #   sum
    #   month_long
    #   period_date
    #   month
    #   year
    # }
    total_monthly_fiscal_revenue: total_monthly_fiscal_revenue_2 {
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
    # total_monthly_calendar_revenue {
    #   source
    #   sum
    #   month_long
    #   period_date
    #   month
    #   year
    # } 
    total_monthly_calendar_revenue: total_monthly_calendar_revenue_2 {
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
    total_monthly_last_twelve_revenue {
      source
      sum
      month_long
      period_date
      month
      year
    } 
    total_monthly_last_twenty_four_revenue: total_monthly_last_twelve_revenue_2 {
      source: land_type
      sum
      month_long
      period_date
      month
      year
      # revenue_type
      # sort_order
      # commodity_order
      # commodity
    }
  }
`

// TotalRevenue component
const TotalRevenue = props => {
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const { monthly, period, breakoutBy, year } = filterState
  const revenueComparison = useRef(null)

  const chartTitle = props.chartTitle || `${ DFC.REVENUE } by ${ period.toLowerCase() } (dollars)`
  const yOrderBy = ['Federal onshore', 'Federal offshore', 'Native American', 'Federal - Not tied to a lease']

  const { loading, error, data } = useQuery(TOTAL_REVENUE_QUERY)

  const handleBarHover = d => {
    revenueComparison.current.setSelectedItem(d)
  }

  if (loading) {
    return 'Loading...'
  }

  if (error) return `Error! ${ error.message }`
  let chartData
  let comparisonData
  let xAxis
  const yAxis = 'sum'
  const yGroupBy = breakoutBy || 'source'
  let xLabels = 'month'
  const units = 'dollars'
  let maxFiscalYear
  let maxCalendarYear
  let maxPeriodDate
  let xGroups = {}
  let legendHeaders
  if (data) {
    maxFiscalYear = data.total_monthly_fiscal_revenue.reduce((prev, current) => {
      return (prev.year > current.year) ? prev.year : current.year
    })
    maxCalendarYear = data.total_monthly_calendar_revenue.reduce((prev, current) => {
      return (prev.year > current.year) ? prev.year : current.year
    })

    maxPeriodDate = data.total_monthly_last_twelve_revenue.reduce((prev, current) => {
      return (prev.period_date > current.period_date) ? prev.period_date : current.period_date
    })

    console.log('maxPeriodDate: ', (maxPeriodDate > '2018-12-01'))

    if (monthly === DFC.MONTHLY_CAPITALIZED) {
      if (period === DFC.PERIOD_FISCAL_YEAR) {
        comparisonData = data.total_monthly_fiscal_revenue
        chartData = data.total_monthly_fiscal_revenue.filter(item => item.year >= maxFiscalYear)
      }
      else if (period === DFC.PERIOD_CALENDAR_YEAR) {
        comparisonData = data.total_monthly_calendar_revenue
        chartData = data.total_monthly_calendar_revenue.filter(item => item.year >= maxCalendarYear)
      }
      else {
        comparisonData = data.total_monthly_last_twenty_four_revenue
        chartData = data.total_monthly_last_twelve_revenue
	      console.debug('monthly last chart Data: ', data.total_monthly_last_twelve_revenue)
      }

      xGroups = chartData.reduce((g, row, i) => {
        const r = g
        const year = row.period_date.substring(0, 4)
        const months = g[year] || []
        months.push(row.month)
        r[year] = months
        return r
      }, {})

      xAxis = 'month_long'
      xLabels = (x, i) => {
        // console.debug('xLabels x: ', x)
        return x.map(v => v.substr(0, 3))
      }

      legendHeaders = (headers, row) => {
        const headerArr = [headers[0], '', `${ row.xLabel } ${ row.year }`]
        return headerArr
      }
    }
    else {
      if (period === DFC.PERIOD_FISCAL_YEAR) {
        comparisonData = data.total_yearly_fiscal_revenue
        chartData = data.total_yearly_fiscal_revenue.filter(item => item.year >= maxFiscalYear - 9)
        xGroups[DFC.PERIOD_FISCAL_YEAR] = chartData.map((row, i) => row.year)
      }
      else {
        comparisonData = data.total_yearly_calendar_revenue
        chartData = data.total_yearly_calendar_revenue.filter(item => item.year <= maxCalendarYear && item.year >= maxCalendarYear - 9)
        xGroups[DFC.PERIOD_CALENDAR_YEAR] = chartData.map((row, i) => row.year)
      }
      xAxis = 'year'
      xLabels = (x, i) => {
        return x.map(v => '\'' + v.toString().substr(2))
      }
    }
  }
  return (
    <>
      <SectionHeader
        title="Total revenue"
        linkLabel="revenue"
        showExploreLink
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <SectionControls
            maxFiscalYear={maxFiscalYear}
            maxCalendarYear={maxCalendarYear}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <StackedBarChart
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
            primaryColor={theme.palette.chart.primary}
            secondaryColor={theme.palette.chart.secondary}
            handleBarHover={handleBarHover}
          />
          <Box fontStyle="italic" textAlign="right" fontSize="h6.fontSize">
            <Link href='/downloads/revenue-by-month/'>Source file</Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <ComparisonTable
            ref={revenueComparison}
            data={comparisonData}
            yGroupBy={yGroupBy}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default TotalRevenue
