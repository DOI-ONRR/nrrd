import React, { useContext, useState, useRef } from 'react'
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

const TOTAL_PRODUCTION_QUERY = gql`
  query TotalYearlyProduction {
    # total_yearly_fiscal_production {
    #   product,
    #   year,
    #   source,
    #   sum
    # }
    total_yearly_fiscal_production: total_yearly_fiscal_production_2 {
      product,
      year,
      source,
      sum
    }  

    total_yearly_calendar_production {
      product,
      year,
      source,
      sum
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
  }
`

// TotalProduction
const TotalProduction = props => {
  const { state: filterState } = useContext(DataFilterContext)
  const { monthly, period, commodity } = filterState
  const [selected, setSelected] = useState(undefined)
  const productionComparison = useRef(null)

  const handleSelect = value => {
    setSelected(value.selectedIndex)
  }

  const handleBarHover = d => {
    productionComparison.current.setSelectedItem(d)
  }

  const { loading, error, data } = useQuery(TOTAL_PRODUCTION_QUERY)

  let chartData
  let comparisonData
  let xAxis = 'year'
  const yAxis = 'sum'
  const yGroupBy = 'source'
  let xLabels
  let maxFiscalYear
  let maxCalendarYear
  let xGroups = {}
  let legendHeaders

  console.log('TotalProduction init commodity: ', commodity)

  if (loading) {
    return 'Loading...'
  }

  if (error) return `Error! ${ error.message }`
  if (data) {
    console.debug('Total Production:', data)
    maxFiscalYear = data.total_yearly_fiscal_production.reduce((prev, current) => {
      return (prev.year > current.year) ? prev.year : current.year
    })
    maxCalendarYear = data.total_yearly_calendar_production.reduce((prev, current) => {
      return (prev.year > current.year) ? prev.year : current.year
    })

    if (monthly === DFC.MONTHLY_CAPITALIZED) {
      if (period === DFC.PERIOD_FISCAL_YEAR) {
        comparisonData = data.total_monthly_fiscal_production
        chartData = data.total_monthly_fiscal_production
      }
      else if (period === DFC.PERIOD_CALENDAR_YEAR) {
        comparisonData = data.total_monthly_calendar_production
        chartData = data.total_monthly_calendar_production
      }
      else {
        comparisonData = data.total_monthly_last_twelve_production
        chartData = data.total_monthly_last_twelve_production
      }

      xGroups = chartData.filter(row => row.product === 'Oil (bbl)').reduce((g, row, i) => {
        const r = g
        const year = row.period_date.substring(0, 4)
        const months = g[year] || []
        months.push(row.month)
        r[year] = months
        return r
      }, [])
      console.debug('XXXXXXXXXXXXXXXXXXXXXXXXXXXXGROUPS', xGroups)
      console.debug('XXXXXXXXXXXXXXXXXXXXXXXXXXXXGROUPS', chartData)

      xAxis = 'month_long'
      xLabels = (x, i) => {
        return x.map(v => v.substr(0, 3))
      }

      legendHeaders = (headers, row) => {
        const headerArr = [headers[0], '', `${ row.xLabel } ${ row.year }`]
        return headerArr
      }
    }
    else {
      if (period === DFC.PERIOD_FISCAL_YEAR) {
        comparisonData = data.total_yearly_fiscal_production
        chartData = data.total_yearly_fiscal_production.filter(item => item.year >= maxFiscalYear - 9)
        xGroups['Fiscal Year'] = chartData.filter(row => row.product === 'Oil (bbl)').map((row, i) => row.year)
      }
      else {
        comparisonData = data.total_yearly_calendar_production
        chartData = data.total_yearly_calendar_production
        xGroups['Calendar Year'] = chartData.filter(row => row.product === 'Oil (bbl)').map((row, i) => row.year)
      }
      console.debug(chartData)
      xLabels = (x, i) => {
        return x.map(v => '\'' + v.toString().substr(2))
      }
    }
  }
  if (chartData.length > 0) {
    return (
      <>
        <SectionHeader
          title="Total production"
          linkLabel="production"
          showExploreLink
        />
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <HomeDataFilters
              maxFiscalYear={maxFiscalYear}
              maxCalendarYear={maxCalendarYear} />
          </Grid>
          <Grid item xs={12} md={7}>
            {commodity === 'Oil (bbl)' &&
              <StackedBarChart
                title={'Oil (bbl)'}
                data={chartData.filter(row => row.product === 'Oil (bbl)')}
                xAxis={xAxis}
                yAxis={yAxis}
                xGroups={xGroups}
                yGroupBy={yGroupBy}
                xLabels={xLabels}
                legendFormat={v => utils.formatToCommaInt(v)}
                onSelect={ d => handleSelect(d) }
                selectedIndex={selected}
                units='bbl'
                showLegendUnits
                legendHeaders={legendHeaders}
                handleBarHover={handleBarHover}
              />
            }
            {commodity === 'Gas (mcf)' &&
              <StackedBarChart
                title={'Gas (mcf)'}
                data={chartData.filter(row => row.product === 'Gas (mcf)')}
                xAxis={xAxis}
                yAxis={yAxis}
                xGroups={xGroups}

                yGroupBy={yGroupBy}
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
                handleBarHover={handleBarHover}
              />
            }
            {commodity === 'Coal (tons)' &&
              <StackedBarChart
                title={'Coal (tons)'}
                data={chartData.filter(row => row.product === 'Coal (tons)')}
                xAxis={xAxis}
                yAxis={yAxis}
                xGroups={xGroups}

                yGroupBy={yGroupBy}
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
                handleBarHover={handleBarHover}
              />
            }
            <Box fontStyle="italic" textAlign="left" fontSize="h6.fontSize">
              <Link href='/downloads/production-by-month/'>Source file</Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <ComparisonTable
              ref={productionComparison}
              data={comparisonData}
              yGroupBy={yGroupBy}
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
