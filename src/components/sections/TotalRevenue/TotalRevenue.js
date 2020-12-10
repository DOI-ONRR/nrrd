import React, { useContext, useState } from 'react'
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

import utils from '../../../js/utils'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const TOTAL_REVENUE_QUERY = gql`
  query TotalYearlyRevenue {
    total_yearly_fiscal_revenue { 
      year,
      source,
      sum
    }
    total_yearly_calendar_revenue { 
      year,
      source,
      sum
    }
    total_monthly_fiscal_revenue {
      source
      sum
      month_long
      period_date
      month
      year
    }
    total_monthly_calendar_revenue {
      source
      sum
      month_long
      period_date
      month
      year
    } 
    total_monthly_last_twelve_revenue {
      source
      sum
      month_long
      period_date
      month
      year
    } 
  }
`

// TotalRevenue component
const TotalRevenue = props => {
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const { monthly, period, breakoutBy, year } = filterState
  const [chartYear, setChartYear] = useState(year)

  const chartTitle = props.chartTitle || `${ DFC.REVENUE } by ${ period.toLowerCase() } (dollars)`
  const yOrderBy = ['Federal onshore', 'Federal offshore', 'Native American', 'Federal - Not tied to a lease']
  const { loading, error, data } = useQuery(TOTAL_REVENUE_QUERY)

  const onHover = d => {
    console.log('TotalRevenue onHover: ', d)
    if (d.year) setChartYear(d.year)
  }

  if (loading) {
    return 'Loading...'
  }

  if (error) return `Error! ${ error.message }`
  let chartData
  let xAxis
  const yAxis = 'sum'
  const yGroupBy = breakoutBy || 'source'
  let xLabels = 'month'
  const units = 'dollars'
  let maxFiscalYear
  let maxCalendarYear
  let xGroups = {}
  let legendHeaders
  if (data) {
    maxFiscalYear = data.total_monthly_fiscal_revenue.reduce((prev, current) => {
      return (prev.year > current.year) ? prev.year : current.year
    })
    maxCalendarYear = data.total_monthly_calendar_revenue.reduce((prev, current) => {
      return (prev.year > current.year) ? prev.year : current.year
    })

    if (monthly === DFC.MONTHLY_CAPITALIZED) {
      if (period === DFC.PERIOD_FISCAL_YEAR) {
        chartData = data.total_monthly_fiscal_revenue
      }
      else if (period === DFC.PERIOD_CALENDAR_YEAR) {
        chartData = data.total_monthly_calendar_revenue
      }
      else {
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
        chartData = data.total_yearly_fiscal_revenue
        xGroups[DFC.PERIOD_FISCAL_YEAR] = chartData.map((row, i) => row.year)
        console.log('chartData: ', chartData)
      }
      else {
        chartData = data.total_yearly_calendar_revenue
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
        <Grid item xs={12}>
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
            onHover={onHover}
          />
          <Box fontStyle="italic" textAlign="right" fontSize="h6.fontSize">
            <Link href='/downloads/revenue-by-month/'>Source file</Link>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default TotalRevenue
