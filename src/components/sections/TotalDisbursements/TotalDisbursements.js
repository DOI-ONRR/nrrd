import React, { useContext, useEffect, useRef } from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'
import { DataFilterContext } from '../../../stores/data-filter-store'

import {
  Box,
  Grid,
  useTheme
} from '@material-ui/core'

import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'
import SectionHeader from '../../sections/SectionHeader'
import HomeDataFilters from '../../../components/toolbars/HomeDataFilters'
import Link from '../../../components/Link'
import ComparisonTable from '../ComparisonTable'

import utils, { getMonthRange } from '../../../js/utils'

const TOTAL_DISBURSEMENTS_QUERY = gql`
  query TotalYearlyDisbursements {
    # total_yearly_fiscal_disbursement {
    #   year,
    #   source,
    #   sum
    # }

    total_yearly_fiscal_disbursement: total_yearly_fiscal_disbursement_2(order_by: [{year: asc}]) {
      period
      sum
      source: land_type
      year
      sort_order
      fiscalMonth: fiscal_month
      currentMonth: month
      monthLong: month_long
      recipient: fund_class
    }

    # total_monthly_fiscal_disbursement {
    #   source
    #   sum
    #   month_long
    #   period_date
    #   month
    #   year
    # }

    total_monthly_fiscal_disbursement: total_monthly_fiscal_disbursement_2 {
      source
      sum
      month_long
      period_date
      month
      year
      recipient
    }

    total_monthly_calendar_disbursement: total_monthly_calendar_disbursement_2 {
      source
      sum
      month_long
      period_date
      month
      year
      recipient
    }

    total_monthly_last_twelve_disbursement: total_monthly_last_twelve_disbursement_2 {
      source
      sum
      month_long
      period_date
      month
      year
      recipient: fund_class
    } 

    total_monthly_last_three_years_disbursement {
      source: land_type,
      sum
      month_long
      period_date
      month
      year
      recipient: fund_class
    }
  }
`

// TotalDisbursements
const TotalDisbursements = props => {
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const { monthly, period, breakoutBy, dataType } = filterState
  const disbursementsComparison = useRef(null)

  const chartTitle = props.chartTitle || `${ DFC.DISBURSEMENT } by ${ period.toLowerCase() } (dollars)`
  const periodAbbr = (period === DFC.PERIOD_FISCAL_YEAR) ? 'FY' : 'CY'

  const { loading, error, data } = useQuery(TOTAL_DISBURSEMENTS_QUERY)

  const handleBarHover = d => {
    disbursementsComparison.current.setSelectedItem(d)
  }

  // useEffect(() => {
  // }, [breakoutBy])

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
  let legendHeaders
  let currentMonthNum
  let currentYearSoFarText
  let monthRange
  let monthRangeText
  let monthStartDate
  let monthEndDate
  let startMonth
  let endMonth
  const yOrderBy = (breakoutBy === DFC.RECIPIENT)
    ? [
      'Other funds',
      'Historic Preservation Fund',
      'Land and Water Conservation Fund',
      'Native American tribes and individuals',
      'Reclamation Fund',
      'State and local governments',
      'U.S. Treasury'
    ]
    : ['Native American', 'Federal Offshore', 'Federal Onshore']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  if (error) return `Error! ${ error.message }`
  if (data) {
    // console.log('TotalDisbursements data: ', data)
    maxFiscalYear = data.total_monthly_fiscal_disbursement.reduce((prev, current) => {
      return (prev.year > current.year) ? prev.year : current.year
    })
    maxCalendarYear = data.total_monthly_calendar_disbursement.reduce((prev, current) => {
      return (prev.year > current.year) ? prev.year : current.year
    })

    // Month range and month range text
    currentMonthNum = data.total_yearly_fiscal_disbursement[data.total_yearly_fiscal_disbursement.length - 1].currentMonth
    monthStartDate = `10-01-${ data.total_yearly_fiscal_disbursement[data.total_yearly_fiscal_disbursement.length - 1].year }`
    monthEndDate = `${ data.total_yearly_fiscal_disbursement[data.total_yearly_fiscal_disbursement.length - 1].currentMonth }-01-${ data.total_yearly_fiscal_disbursement[data.total_yearly_fiscal_disbursement.length - 1].year }`

    monthRange = getMonthRange(monthStartDate, monthEndDate)
    startMonth = months[9]
    endMonth = months[monthRange[monthRange.length - 1].split('-')[0] - 1]
    monthRangeText = (endMonth === 'October') ? startMonth.substring(0, 3) : `${ startMonth.substring(0, 3) } - ${ endMonth.substring(0, 3) }`
    currentYearSoFarText = `so far (${ monthRangeText })`

    if (monthly === DFC.MONTHLY_CAPITALIZED) {
      if (period === DFC.PERIOD_FISCAL_YEAR) {
        switch (yGroupBy) {
        case 'recipient':
          comparisonData = data.total_monthly_fiscal_disbursement.filter(item => yOrderBy.includes(item.recipient))
          chartData = data.total_monthly_fiscal_disbursement.filter(item => (item.year >= maxFiscalYear - 1 && yOrderBy.includes(item.recipient)))
          break
        default:
          comparisonData = data.total_monthly_fiscal_disbursement
          chartData = data.total_monthly_fiscal_disbursement.filter(item => item.year >= maxFiscalYear - 1)
          break
        }
      }
      else if (period === DFC.PERIOD_CALENDAR_YEAR) {
        switch (yGroupBy) {
        case 'recipient':
          comparisonData = data.total_monthly_calendar_disbursement.filter(item => yOrderBy.includes(item.recipient))
          chartData = data.total_monthly_calendar_disbursement.filter(item => item.year >= maxCalendarYear && yOrderBy.includes(item.recipient))
          break
        default:
          comparisonData = data.total_monthly_calendar_disbursement
          chartData = data.total_monthly_calendar_disbursement.filter(item => item.year >= maxCalendarYear)
          break
        }
      }
      else {
        switch (yGroupBy) {
        case 'recipient':
          comparisonData = data.total_monthly_last_three_years_disbursement.filter(item => yOrderBy.includes(item.recipient))
          chartData = data.total_monthly_last_twelve_disbursement.filter(item => yOrderBy.includes(item.recipient))
          break
        default:
          comparisonData = data.total_monthly_last_three_years_disbursement
          chartData = data.total_monthly_last_twelve_disbursement
          break
        }
      }

      xGroups = chartData.reduce((g, row, i) => {
        const r = g
        const year = row.period_date.substring(0, 4)
        const months = g[year] || []
        months.push(row.month)
        r[year] = months
        return r
      }, {})

      console.log('chartData: ', chartData)

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
      switch (breakoutBy) {
      case 'recipient':
        comparisonData = data.total_yearly_fiscal_disbursement.filter(item => yOrderBy.includes(item.recipient))
        chartData = data.total_yearly_fiscal_disbursement.filter(item => (item.year >= maxFiscalYear - 9 && yOrderBy.includes(item.recipient)))
        console.log('chartData: ', chartData)
        break
      default:
        comparisonData = data.total_yearly_fiscal_disbursement
        chartData = data.total_yearly_fiscal_disbursement.filter(item => item.year >= maxFiscalYear - 9)
        break
      }

      xGroups['Fiscal Year'] = chartData.map((row, i) => row.year)
      xLabels = (x, i) => {
        return x.map(v => '\'' + v.toString().substr(2))
      }

      legendHeaders = (headers, row) => {
        const headerArr = [headers[0], '', `${ periodAbbr } ${ headers[2] } ${ ((currentMonthNum !== parseInt('09') || startMonth === endMonth) && headers[2] > maxFiscalYear - 1) ? currentYearSoFarText : '' }`]
        return headerArr
      }
    }
  }

  return (
    <>
      <SectionHeader
        title="Total disbursements"
        linkLabel="disbursements"
        showLinks
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <HomeDataFilters
            maxFiscalYear={maxFiscalYear}
            maxCalendarYear={maxCalendarYear} />
        </Grid>
        <Grid item xs={12} md={7}>
          <StackedBarChart
            key={`tdsbc__${ monthly }${ period }${ breakoutBy }${ dataType }`}
            title={chartTitle}
            units={units}
            data={chartData.filter(item => item.sum * 10)}
            xAxis={xAxis}
            yAxis={yAxis}
            xGroups={xGroups}
            yGroupBy={yGroupBy}
            yOrderBy={yOrderBy}
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
            key={`tdct__${ monthly }${ period }${ breakoutBy }`}
            ref={disbursementsComparison}
            data={comparisonData}
            yGroupBy={yGroupBy}
            yOrderBy={yOrderBy}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default TotalDisbursements
