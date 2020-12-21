import React, { useContext, useRef } from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'
import { DataFilterContext } from '../../../stores/data-filter-store'

import {
  Box,
  Grid
} from '@material-ui/core'

import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'
import SectionHeader from '../../sections/SectionHeader'
import HomeDataFilters from '../../../components/toolbars/HomeDataFilters'
import Link from '../../../components/Link'
import ComparisonTable from '../ComparisonTable'

import utils from '../../../js/utils'

const TOTAL_DISBURSEMENTS_QUERY = gql`
  query TotalYearlyDisbursements {
    # total_yearly_fiscal_disbursement {
    #   year,
    #   source,
    #   sum
    # }

    total_yearly_fiscal_disbursement: total_yearly_fiscal_disbursement_2 {
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
  const { state: filterState } = useContext(DataFilterContext)
  const { monthly, period, breakoutBy, dataType } = filterState
  const disbursementsComparison = useRef(null)

  const chartTitle = props.chartTitle || `${ DFC.DISBURSEMENT } (dollars)`

  const { loading, error, data } = useQuery(TOTAL_DISBURSEMENTS_QUERY)

  const handleBarHover = d => {
    disbursementsComparison.current.setSelectedItem(d)
  }

  if (loading) {
    return 'Loading...'
  }
  let chartData
  let comparisonData
  let xAxis = 'year'
  const yAxis = 'sum'
  const yGroupBy = breakoutBy || 'source'
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

    if (monthly === DFC.MONTHLY_CAPITALIZED) {
      if (period === DFC.PERIOD_FISCAL_YEAR) {
        comparisonData = data.total_monthly_fiscal_disbursement
        chartData = data.total_monthly_fiscal_disbursement
      }
      else if (period === DFC.PERIOD_CALENDAR_YEAR) {
        comparisonData = data.total_monthly_calendar_disbursement
        chartData = data.total_monthly_calendar_disbursement
      }
      else {
        comparisonData = data.total_monthly_last_twelve_disbursement
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
      comparisonData = data.total_yearly_fiscal_disbursement
      chartData = data.total_yearly_fiscal_disbursement.filter(item => item.year >= maxFiscalYear - 9)
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
        <Grid item xs={12}>
          <HomeDataFilters
            maxFiscalYear={maxFiscalYear}
            maxCalendarYear={maxCalendarYear} />
        </Grid>
        <Grid item xs={12} md={7}>
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
            handleBarHover={handleBarHover}
          />
          <Box fontStyle="italic" textAlign="left" fontSize="h6.fontSize">
            { (monthly === DFC.MONTHLY_CAPITALIZED)
              ? <Link href='/downloads/disbursements-by-month/'>Source file</Link>
              : <Link href='/downloads/disbursements/'>Source file</Link>
            }
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <ComparisonTable
            ref={disbursementsComparison}
            data={comparisonData}
            yGroupBy={yGroupBy}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default TotalDisbursements
