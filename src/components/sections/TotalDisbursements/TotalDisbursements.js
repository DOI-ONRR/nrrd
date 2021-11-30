import React, { useContext, useRef } from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'
import { DataFilterContext } from '../../../stores/data-filter-store'

import {
  Box,
  Grid
} from '@material-ui/core'

// not used import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'
import StackedBarChart2 from '../../data-viz/StackedBarChart/StackedBarChart2'
import SectionHeader from '../../sections/SectionHeader'
import HomeDataFilters from '../../../components/toolbars/HomeDataFilters'
import Link from '../../../components/Link'
import ComparisonTable from '../ComparisonTable'

import utils, { formatDate } from '../../../js/utils'

const TOTAL_DISBURSEMENTS_QUERY = gql`
  query TotalYearlyDisbursements {

    total_yearly_fiscal_disbursement(order_by: [{year: asc}]) {
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

    total_monthly_fiscal_disbursement {
      period
      sum
      source: land_type
      year
      sort_order
      period_date
      month
      month_long
      recipient: fund_class
    }

    total_monthly_fiscal_disbursement_last_two_years {
      period
      sum
      source: land_type
      year
      sort_order
      period_date
      month
      month_long
      recipient: fund_class
    }

    total_monthly_calendar_disbursement {
      source: land_type
      sum
      month_long
      period_date
      month
      year
      recipient: fund_class
    }

    total_monthly_last_twelve_disbursement {
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
  const { state: filterState } = useContext(DataFilterContext)
  const { monthly, period, breakoutBy, dataType } = filterState
  const disbursementsComparison = useRef(null)

  const chartTitle = props.chartTitle || `${ DFC.DISBURSEMENT } by ${ period.toLowerCase() } (dollars)`
  const periodAbbr = (period === DFC.PERIOD_FISCAL_YEAR) ? 'FY' : 'CY'

  const { loading, error, data } = useQuery(TOTAL_DISBURSEMENTS_QUERY)

  const handleBarHover = d => {
    disbursementsComparison.current.setSelectedItem(d[2])
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
  let legendHeaders
  let currentMonthNum
  let currentYearSoFarText = ''
  const monthRange = ['', undefined]
  let monthRangeText
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
		   : ['Native American', 'Federal offshore', 'Federal onshore']

  // console.debug(" Comparison yOrderBy ", yOrderBy)

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

    data.total_yearly_fiscal_disbursement.filter(item => {
      if (item.year === (maxFiscalYear + 1)) {
        if (monthRange.indexOf(item.monthLong) === -1) monthRange.push(item.monthLong)
      }
    })
    if (monthRange.length > 2) {
      startMonth = monthRange[2]
      endMonth = monthRange[monthRange.length - 1]
      monthRangeText = startMonth === endMonth ? `(${ startMonth.substring(0, 3) })` : `(${ startMonth.substring(0, 3) } - ${ endMonth.substring(0, 3) })`
      currentYearSoFarText = `so far ${ monthRangeText }`
    }

    if (monthly === DFC.MONTHLY_CAPITALIZED) {
      if (period === DFC.PERIOD_FISCAL_YEAR) {
        switch (yGroupBy) {
        case 'recipient':
          comparisonData = data.total_monthly_fiscal_disbursement.filter(item => yOrderBy.includes(item.recipient))
          chartData = data.total_monthly_fiscal_disbursement_last_two_years.filter(item => yOrderBy.includes(item.recipient) && item.year >= maxFiscalYear)
          break
        default:
          comparisonData = data.total_monthly_fiscal_disbursement
          chartData = data.total_monthly_fiscal_disbursement_last_two_years.filter(item => item.year >= maxFiscalYear)
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
        months.push(months)
        r[year] = months
        return r
      }, {})

      // console.log('chartData: ', chartData)

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
      switch (breakoutBy) {
	  case 'recipient':
        comparisonData = data.total_yearly_fiscal_disbursement.filter(item => yOrderBy.includes(item.recipient))
        chartData = data.total_yearly_fiscal_disbursement.filter(item => (item.year >= maxFiscalYear - 9 && yOrderBy.includes(item.recipient)))
        // console.log('Comparison chartData: ', chartData, ' comparison ', comparisonData, ' total_yearly_fiscal_disbursement ', data.total_yearly_fiscal_disbursement)
	      // console.debug("Comparison yOrderBy ", yOrderBy)
        break
	  default:
        comparisonData = data.total_yearly_fiscal_disbursement
        chartData = data.total_yearly_fiscal_disbursement.filter(item => item.year >= maxFiscalYear - 9)
        break
      }

      xGroups['Fiscal Year'] = chartData.map((row, i) => row.year)
      xLabels = (x, i) => {
        // console.log('xLabels x, i: ', x, i)
        return x.map(v => '\'' + v.toString().substr(2))
      }

      legendHeaders = headers => {
        // console.log('legendHeaders: ', headers)
        const headerArr = [breakoutBy.charAt(0).toUpperCase() + breakoutBy.slice(1),
			   `${ periodAbbr } ${ headers[1] } ${ ((currentMonthNum !== parseInt('09') ||
                            startMonth === endMonth) && headers[1] > maxFiscalYear) ? currentYearSoFarText : '' }`]
        return headerArr
      }
    }
  }
  // console.debug('Comparison chartData: ', chartData, " comparison ", comparisonData, " total_yearly_fiscal_disbursement ", data.total_yearly_fiscal_disbursement)
  // console.debug("Comparison yOrderBy ", yOrderBy)
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
          <StackedBarChart2
		  key={`tdsbc__${ monthly }${ period }${ breakoutBy }${ dataType }`}
		  title={chartTitle}
		  units={units}
		  data={chartData}
		  xAxis={xAxis}
		  yAxis={yAxis}
		  xGroups={xGroups}
		  yGroupBy={yGroupBy}
		  yOrderBy={yOrderBy}
		  xLabels={d => xLabels(d)}
		  legendFormat={d => utils.formatToDollarInt(d)}
		  legendHeaders={legendHeaders}
		  handleBarHover={d => handleBarHover(d)}
		  showTooltips={false}
		  chartTooltip={
		  d => {
                // console.log('chartTooltip d: ', d)
                const r = []
                r[0] = d.key
                r[1] = utils.formatToDollarInt(d[0].data[d.key])
                return r
		  }
		  }
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
		  monthRange={monthRange}
          />
        </Grid>
	  </Grid>
    </>
  )
}

export default TotalDisbursements
