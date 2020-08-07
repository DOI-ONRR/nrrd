import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {
  Box,
  Grid
} from '@material-ui/core'

import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'
import SectionHeader from '../../sections/SectionHeader'
import SectionControls from '../../sections/SectionControls'
import Link from '../../../components/Link/'

import utils from '../../../js/utils'
import CONSTANTS from '../../../js/constants'

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
const TOGGLE_VALUES = {
  Year: 'year',
  Month: 'month'
}

const MONTHLY_DROPDOWN_VALUES = {
  Recent: 'recent',
  Fiscal: 'fiscal',
  Calendar: 'calendar'
}

const YEARLY_DROPDOWN_VALUES = {
  Fiscal: 'fiscal_year',
  Calendar: 'calendar_year'
}

// TotalRevenue component
const TotalRevenue = props => {
  const [period, setPeriod] = useState(YEARLY_DROPDOWN_VALUES.Fiscal)
  const [toggle, setToggle] = useState(TOGGLE_VALUES.Year)

  // const period = state.period

  const chartTitle = props.chartTitle || `${ CONSTANTS.REVENUE } (dollars)`
  const yOrderBy = ['Federal onshore', 'Federal offshore', 'Native American', 'Federal - Not tied to a lease']
  const { loading, error, data } = useQuery(TOTAL_REVENUE_QUERY)

  if (loading) {
    return 'Loading...'
  }

  const toggleChange = value => {
    // console.debug('ON TOGGLE CHANGE: ', value)
    setToggle(value)
    if (value && value.toLowerCase() === TOGGLE_VALUES.Month.toLowerCase()) {
      setPeriod(MONTHLY_DROPDOWN_VALUES.Recent)
    }
    else {
      setPeriod(YEARLY_DROPDOWN_VALUES.Fiscal)
    }
  }

  const menuChange = value => {
    // console.debug('ON Menu CHANGE: ', value)
    setPeriod(value)
  }

  const findXGroupYear = (monthNumber, xGroups) => {
    for (const elem of xGroups) {
      const foundElem = elem.filter(item => item.includes(monthNumber))
      // console.log('foundElem: ', foundElem)
    }
  }

  if (error) return `Error! ${ error.message }`
  let chartData
  let xAxis
  const yAxis = 'sum'
  const yGroupBy = 'source'
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

    if (toggle === TOGGLE_VALUES.Month) {
      if (period === MONTHLY_DROPDOWN_VALUES.Fiscal) {
        chartData = data.total_monthly_fiscal_revenue
      }
      else if (period === MONTHLY_DROPDOWN_VALUES.Calendar) {
        chartData = data.total_monthly_calendar_revenue
      }
      else {
        chartData = data.total_monthly_last_twelve_revenue
	  console.debug("monthly last chart Data: ", data.total_monthly_last_twelve_revenue)

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
      if (period === YEARLY_DROPDOWN_VALUES.Fiscal) {
        chartData = data.total_yearly_fiscal_revenue
        xGroups['Fiscal Year'] = chartData.map((row, i) => row.year)
      }
      else {
          chartData = data.total_yearly_calendar_revenue
        xGroups['Calendar Year'] = chartData.map((row, i) => row.year)
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
        <SectionControls
          onToggleChange={toggleChange}
          onMenuChange={menuChange}
          maxFiscalYear={maxFiscalYear}
          maxCalendarYear={maxCalendarYear}
          monthlyDropdownValues={MONTHLY_DROPDOWN_VALUES}
          toggleValues={TOGGLE_VALUES}
          yearlyDropdownValues={YEARLY_DROPDOWN_VALUES}
          period={period}
          toggle={toggle} />
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
