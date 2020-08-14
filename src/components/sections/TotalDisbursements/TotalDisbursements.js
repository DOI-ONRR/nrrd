import React, { useState } from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {
  Box,
  Grid
} from '@material-ui/core'

import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'
import SectionHeader from '../../sections/SectionHeader'
import SectionControls from '../../sections/SectionControls'
import Link from '../../../components/Link'

import utils from '../../../js/utils'
import CONSTANTS from '../../../js/constants'

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
  Fiscal: 'fiscal_year'
}

const TOTAL_DISBURSEMENTS_QUERY = gql`
  query TotalYearlyDisbursements {
    total_yearly_fiscal_disbursement {
      year,
      source,
      sum
    }   

    total_monthly_fiscal_disbursement {
      source
      sum
      month_long
      period_date
      month
     year
    }
    total_monthly_calendar_disbursement {
      source
      sum
      month_long
      period_date
      month
     year

  } 
     total_monthly_last_twelve_disbursement {
      source
      sum
      month_long
      period_date
      month
     year

  } 
  }
`

// TotalDisbursements
const TotalDisbursements = props => {
  // const classes = useStyles()
  const [period, setPeriod] = useState(YEARLY_DROPDOWN_VALUES.Fiscal)
  const [toggle, setToggle] = useState(TOGGLE_VALUES.Year)

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

  const chartTitle = props.chartTitle || `${ CONSTANTS.DISBURSEMENT } (dollars)`

  const { loading, error, data } = useQuery(TOTAL_DISBURSEMENTS_QUERY)
  if (loading) {
    return 'Loading...'
  }
  let chartData
  let xAxis = 'year'
  const yAxis = 'sum'
  const yGroupBy = 'source'
  const units = 'dollars'
  let xLabels
  let maxFiscalYear
  let maxCalendarYear
  let xGroups = {}
  let disabledInput = false
  let legendHeaders

  if (error) return `Error! ${ error.message }`
  if (data) {
    // console.log('TotalDisbursements data: ', data)
    maxFiscalYear = data.total_monthly_fiscal_disbursement.reduce((prev, current) => {
      return (prev.year > current.year) ? prev.year : current.year
    })
    maxCalendarYear = data.total_monthly_calendar_disbursement.reduce((prev, current) => {
      return (prev.year > current.year) ? prev.year : current.year
    })

    if (toggle === TOGGLE_VALUES.Month) {
      if (period === MONTHLY_DROPDOWN_VALUES.Fiscal) {
        chartData = data.total_monthly_fiscal_disbursement
      }
      else if (period === MONTHLY_DROPDOWN_VALUES.Calendar) {
        chartData = data.total_monthly_calendar_disbursement
      }
      else {
        chartData = data.total_monthly_last_twelve_disbursement
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
        // console.debug(x)
        return x.map(v => v.substr(0, 3))
      }

      legendHeaders = (headers, row) => {
        const headerArr = [headers[0], '', `${ row.xLabel } ${ row.year }`]
        return headerArr
      }
    }
    else {
      disabledInput = true
      chartData = data.total_yearly_fiscal_disbursement
      xGroups['Fiscal Year'] = chartData.map((row, i) => row.year)
      xLabels = (x, i) => {
        return x.map(v => '\'' + v.toString().substr(2))
      }
    }
  }

  return (
    <>
      <SectionHeader
        title="Total disbursements"
        linkLabel="disbursements"
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
          toggle={toggle}
          period={period}
          disabledInput={disabledInput} />
        <Grid item xs>
          <StackedBarChart
            title={chartTitle}
            units={units}
            data={chartData}
            xAxis={xAxis}
            yAxis={yAxis}
            xGroups={xGroups}
            yGroupBy={yGroupBy}
            xLabels={xLabels}
            legendFormat={v => utils.formatToDollarInt(v)}
            legendHeaders={legendHeaders}
          />
          <Box fontStyle="italic" textAlign="right" fontSize="h6.fontSize">
            { (toggle === TOGGLE_VALUES.Month)
              ? <Link href='/downloads/disbursements-by-month/'>Source file</Link>
              : <Link href='/downloads/disbursements/'>Source file</Link>
            }
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default TotalDisbursements
