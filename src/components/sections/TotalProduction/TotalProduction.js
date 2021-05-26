import React, { useContext, useState, useRef } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'
import { DataFilterContext } from '../../../stores/data-filter-store'

import {
  Box,
  Grid
} from '@material-ui/core'

// import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'
import StackedBarChart2 from '../../data-viz/StackedBarChart/StackedBarChart2'
import SectionHeader from '../../sections/SectionHeader'
import HomeDataFilters from '../../../components/toolbars/HomeDataFilters'
import Link from '../../../components/Link'
import ComparisonTable from '../ComparisonTable'
import GlossaryTerm from '../../GlossaryTerm/GlossaryTerm'

import utils, { formatDate } from '../../../js/utils'

const TOTAL_PRODUCTION_QUERY = gql`
  query TotalYearlyProduction {

    total_yearly_fiscal_production {
      product,
      year,
      source,
      sum: total,
      month,
      monthLong: month_long
    }

    total_yearly_calendar_production {
      product,
      year,
      source,
      sum: total,
      month,
      monthLong: month_long
    }   

    total_monthly_fiscal_production {
      source
      product
      sum
      month_long
      period_date
      month
      year
    }

    total_monthly_calendar_production {
      source
      product
      sum
      month_long
      period_date
      month
      year
    } 

    total_monthly_last_twelve_production {
      source
      product
      sum
      month_long
      period_date
      month
      year
    }

    total_monthly_last_two_years_production {
      source
      product
      sum
      month_long
      period_date
      month
      year
    } 
  }
`

// TotalProduction
const TotalProduction = props => {
  const { state: filterState } = useContext(DataFilterContext)
  const { monthly, period, commodity, dataType } = filterState
  console.log('filterState: ', filterState)
  const [selected, setSelected] = useState(undefined)
  const productionComparison = useRef(null)
  const periodAbbr = (period === DFC.PERIOD_FISCAL_YEAR) ? 'FY' : 'CY'

  const handleSelect = value => {
    setSelected(value.selectedIndex)
  }

  const handleBarHover = d => {
    productionComparison.current.setSelectedItem(d[2])
  }

  const { loading, error, data } = useQuery(TOTAL_PRODUCTION_QUERY)

  let chartData
  let comparisonData
  let xAxis = 'year'
  const yAxis = 'sum'
  const yGroupBy = 'source'
  const yOrderBy = ['Native American', 'Federal offshore', 'Federal onshore']
  let xLabels
  let maxFiscalYear
  let maxCalendarYear
  let xGroups = {}
  let legendHeaders
  const monthRange = []
  let startMonth
  let endMonth
  let monthRangeText
  let currentYearSoFarText
  let currentMonthNum

  if (loading) {
    return 'Loading...'
  }

  if (error) return `Error! ${ error.message }`
  if (data) {
    // console.debug('Total Production:', data)
    maxFiscalYear = data.total_yearly_fiscal_production.reduce((prev, current) => {
      return (prev.year > current.year) ? prev.year : current.year
    })
    maxCalendarYear = data.total_yearly_calendar_production.reduce((prev, current) => {
      return (prev.year > current.year) ? prev.year : current.year
    })

    console.log('maxFiscalYear, maxCalendarYear: ', maxFiscalYear, maxCalendarYear)

    if (monthly === DFC.MONTHLY_CAPITALIZED) {
      if (period === DFC.PERIOD_FISCAL_YEAR) {
        comparisonData = data.total_monthly_fiscal_production.filter(row => row.product === commodity)
        chartData = data.total_monthly_fiscal_production.filter(row => row.product === commodity && row.year >= maxFiscalYear - 1)
      }
      else if (period === DFC.PERIOD_CALENDAR_YEAR) {
        comparisonData = data.total_monthly_calendar_production.filter(row => row.product === commodity)
        chartData = data.total_monthly_calendar_production.filter(row => row.product === commodity && row.year >= maxCalendarYear - 1)
      }
      else {
        comparisonData = data.total_monthly_last_two_years_production.filter(row => row.product === commodity)
        chartData = data.total_monthly_last_twelve_production.filter(row => row.product === commodity)
      }

      xGroups = chartData.filter(row => row.product === commodity).reduce((g, row, i) => {
        const r = g
        const year = row.period_date.substring(0, 4)
        const months = g[year] || []
        months.push(row.month)
        r[year] = months
        return r
      }, [])
      console.debug('XXXXXXXXXXXXXXXXXXXXXXXXXXXXGROUPS', xGroups)
      console.debug('XXXXXXXXXXXXXXXXXXXXXXXXXXXXCHARTDATA', chartData)

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
        const headerArr = [headers[0].charAt(0).toUpperCase() + headers[0].slice(1), `${ month } ${ year }`]
        return headerArr
      }
    }
    else {
      if (period === DFC.PERIOD_FISCAL_YEAR) {
        currentMonthNum = data.total_yearly_fiscal_production[data.total_yearly_fiscal_production.length - 1].month
        data.total_yearly_fiscal_production.filter(item => {
          if (item.year === (maxFiscalYear)) {
            if (monthRange.indexOf(item.monthLong) === -1) monthRange.push(item.monthLong)
          }
        })
        comparisonData = data.total_yearly_fiscal_production.filter(row => row.product === commodity)
	      // console.debug('COMPARISON DATA:', comparisonData)
        chartData = data.total_yearly_fiscal_production.filter(item => item.year >= maxFiscalYear - 10)
        xGroups['Fiscal Year'] = chartData.filter(row => row.product === commodity).map((row, i) => row.year)
      }
      else {
        currentMonthNum = data.total_yearly_calendar_production[data.total_yearly_calendar_production.length - 1].month
        data.total_yearly_calendar_production.filter(item => {
          if (item.year === (maxCalendarYear)) {
            if (monthRange.indexOf(item.monthLong) === -1) monthRange.push(item.monthLong)
          }
        })
        comparisonData = data.total_yearly_calendar_production.filter(row => row.product === commodity)
        chartData = data.total_yearly_calendar_production.filter(item => item.year >= maxCalendarYear - 10)
        xGroups['Calendar Year'] = chartData.filter(row => row.product === commodity).map((row, i) => row.year)
      }
      // console.debug(chartData)
      xLabels = (x, i) => {
        return x.map(v => '\'' + v.toString().substr(2))
      }

      legendHeaders = (headers, row) => {
        const fySoFar = (period === DFC.PERIOD_FISCAL_YEAR && (currentMonthNum !== parseInt('09') || startMonth === endMonth) && headers[1] > maxFiscalYear - 1)
        const cySoFar = (period === DFC.PERIOD_CALENDAR_YEAR && (currentMonthNum !== parseInt('12') || startMonth === endMonth) && headers[1] > maxCalendarYear - 1)
        const headerArr = [headers[0].charAt(0).toUpperCase() + headers[0].slice(1), `${ periodAbbr } ${ headers[1] } ${ (fySoFar || cySoFar) ? currentYearSoFarText : '' }`]
        return headerArr
      }
    }

    if (monthRange.length > 0) {
      startMonth = monthRange[0]
      endMonth = monthRange[monthRange.length - 1]
      monthRangeText = startMonth === endMonth ? `(${ startMonth.substring(0, 3) })` : `(${ startMonth.substring(0, 3) } - ${ endMonth.substring(0, 3) })`
      currentYearSoFarText = `so far ${ monthRangeText }`
    }
  }
  if (chartData.length > 0) {
    return (
      <>
        <SectionHeader
          title="Total production"
          linkLabel="production"
          showLinks
        />
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <HomeDataFilters
              maxFiscalYear={maxFiscalYear}
              maxCalendarYear={maxCalendarYear} />
          </Grid>
          <Grid item xs={12} md={7}>
            {commodity === 'Oil (bbl)' &&
              <StackedBarChart2
                key={`tpsbc__${ monthly }${ period }${ commodity }${ dataType }`}
                title={['Oil ', <GlossaryTerm termKey={'(bbl)'}>(bbl)</GlossaryTerm>]}
                data={chartData.filter(row => row.product === 'Oil (bbl)')}
                xAxis={xAxis}
                yAxis={yAxis}
                xGroups={xGroups}
                yGroupBy={yGroupBy}
                yOrderBy={yOrderBy}
                xLabels={xLabels}
                legendFormat={v => utils.formatToCommaInt(v)}
                onSelect={ d => handleSelect(d) }
                selectedIndex={selected}
                units='bbl'
                showLegendUnits
                legendHeaders={legendHeaders}
                handleBarHover={d => handleBarHover(d)}
              />
            }
            {commodity === 'Gas (mcf)' &&
              <StackedBarChart2
                key={`tpsbc__${ monthly }${ period }${ commodity }`}
                title={['Gas ', <GlossaryTerm termKey={'(mcf)'}>(mcf)</GlossaryTerm>]}
                data={chartData.filter(row => row.product === 'Gas (mcf)')}
                xAxis={xAxis}
                yAxis={yAxis}
                xGroups={xGroups}
                yGroupBy={yGroupBy}
                yOrderBy={yOrderBy}
                xLabels={xLabels}
                legendFormat={v => {
                  return utils.formatToCommaInt(v)
                }}
                onSelect={ d => {
                  // console.log('handle select', d)
                  return handleSelect(d)
                }
                }
                selectedIndex={selected}
                units='mcf'
                showLegendUnits
                legendHeaders={legendHeaders}
                handleBarHover={d => handleBarHover(d)}
              />
            }
            {commodity === 'Coal (tons)' &&
              <StackedBarChart2
                key={`tpsbc__${ monthly }${ period }${ commodity }`}
                title={['Coal ', <GlossaryTerm termKey={'(tons)'}>(tons)</GlossaryTerm>]}
                data={chartData.filter(row => row.product === 'Coal (tons)')}
                xAxis={xAxis}
                yAxis={yAxis}
                xGroups={xGroups}
                yGroupBy={yGroupBy}
                yOrderBy={yOrderBy}
                xLabels={xLabels}
                legendFormat={v => {
                  if (v) {
                    return utils.formatToCommaInt(v)
                  }
                  else {
                    return '-'
                  }
                }}
                onSelect={ d => {
                  // console.log('handle select', d)
                  return handleSelect(d)
                }
                }
                selectedIndex={selected}
                units='tons'
                showLegendUnits
                legendHeaders={legendHeaders}
                handleBarHover={d => handleBarHover(d)}
              />
            }
            <Box fontStyle="italic" textAlign="left" fontSize="h6.fontSize">
              <Link href='/downloads/production-by-month/'>Source file</Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <ComparisonTable
              key={`ct__${ monthly }${ period }${ commodity }`}
              ref={productionComparison}
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
  else {
    return (null)
  }
}

export default TotalProduction
