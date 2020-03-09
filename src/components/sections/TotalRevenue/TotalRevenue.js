import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Grid from '@material-ui/core/Grid'

import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'
import SectionHeader from '../../sections/SectionHeader'
import SectionControls from '../../sections/SectionControls'

import utils from '../../../js/utils'
import CONSTANTS from '../../../js/constants'

const TOTAL_REVENUE_QUERY = gql`
  query TotalYearlyRevenue {
    total_yearly_fiscal_revenue2 { 
      year,
      source,
      sum
    }
    total_yearly_calendar_revenue2 { 
      year,
      source,
      sum
    }
    total_monthly_fiscal_revenue2 {
      source
      sum
      month_long
      period_date
      month
     year
    }
    total_monthly_calendar_revenue2 {
      source
      sum
      month_long
      period_date
      month
     year

  } 
 last_twelve_revenue2 {
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
  const [period, setPeriod] = useState(null)
  const [toggle, setToggle] = useState(null)

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
  }
  const menuChange = value => {
    // console.debug('ON Menu CHANGE: ', value)
    setPeriod(value)
  }

  if (error) return `Error! ${ error.message }`
  let chartData
  let xAxis
  const yAxis = 'sum'
  const yGroupBy = 'source'
  let xLabels = 'month'
  const units = 'dollars'

  if (data) {
    if (toggle === 'month') {
      if (period === 'fiscal') {
        chartData = data.total_monthly_fiscal_revenue2
      }
      else if (period === 'calendar') {
        chartData = data.total_monthly_calendar_revenue2
      }
      else {
        chartData = data.last_twelve_revenue2
      }

      xAxis = 'month_long'
      xLabels = (x, i) => {
        // console.debug(x)
        return x.map(v => v.substr(0, 3))
      }
    }
    else {
      if (period === 'fiscal_year') {
        chartData = data.total_yearly_fiscal_revenue2
      }
      else {
        chartData = data.total_yearly_calendar_revenue2
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
        title="Revenue"
        showExploreLink
      />
      <Grid container spacing={4}>
        <SectionControls
          onToggleChange={toggleChange}
          onMenuChange={menuChange}
          maxFiscalYear={2019}
          maxCalendarYear={2020}
          monthlyDropdownValues={MONTHLY_DROPDOWN_VALUES}
          toggleValues={TOGGLE_VALUES}
          yearlyDropdownValues={YEARLY_DROPDOWN_VALUES} />
        <Grid item xs={12}>
          <StackedBarChart
            data={chartData}
            legendFormat={v => {
              return utils.formatToDollarInt(v)
            }}
            title={chartTitle}
            units={units}
            xAxis={xAxis}
            xLabels={xLabels}
            yAxis={yAxis}
            yGroupBy={yGroupBy}
            yOrderBy={yOrderBy}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default TotalRevenue
