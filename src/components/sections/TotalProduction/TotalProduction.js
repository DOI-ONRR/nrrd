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

const TOTAL_PRODUCTION_QUERY = gql`
  query TotalYearlyProduction {
    total_yearly_fiscal_production {
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
  const [period, setPeriod] = useState(YEARLY_DROPDOWN_VALUES.Fiscal)
  const [toggle, setToggle] = useState(TOGGLE_VALUES.Year)
  const [selected, setSelected] = useState(undefined)

  const toggleChange = value => {
    // console.debug('ON TOGGLE CHANGE: ', value)
    setSelected(undefined)
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
    setSelected(undefined)
    setPeriod(value)
  }

  const handleSelect = value => {
    // console.debug('handle select CHANGE: ', value)
    setSelected(value.selectedIndex)
  }

  const { loading, error, data } = useQuery(TOTAL_PRODUCTION_QUERY)
  if (loading) {
    return 'Loading...'
  }
  let chartData
  let xAxis = 'year'
  const yAxis = 'sum'
  const yGroupBy = 'source'
  let xLabels
  let maxFiscalYear
  let maxCalendarYear
  let xGroups = {}

  if (loading) {
    return 'Loading...'
  }

  if (error) return `Error! ${ error.message }`
  if (data) {
    // console.debug(data)
    maxFiscalYear = data.total_yearly_fiscal_production.reduce((prev, current) => {
      return (prev.year > current.year) ? prev.year : current.year
    })
    maxCalendarYear = data.total_yearly_calendar_production.reduce((prev, current) => {
      return (prev.year > current.year) ? prev.year : current.year
    })

    if (toggle === TOGGLE_VALUES.Month) {
      if (period === MONTHLY_DROPDOWN_VALUES.Fiscal) {
        chartData = data.total_monthly_fiscal_production
      }
      else if (period === MONTHLY_DROPDOWN_VALUES.Calendar) {
        chartData = data.total_monthly_calendar_production
      }
      else {
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
        // console.debug(x)
        return x.map(v => v.substr(0, 3))
      }
    }
    else {
      if (period === YEARLY_DROPDOWN_VALUES.Fiscal) {
        chartData = data.total_yearly_fiscal_production
        xGroups['Fiscal Year'] = chartData.filter(row => row.product === 'Oil (bbl)').map((row, i) => row.year)
      }
      else {
        chartData = data.total_yearly_calendar_production
        xGroups['Calendar Year'] = chartData.filter(row => row.product === 'Oil (bbl)').map((row, i) => row.year)
      }
      console.debug(chartData)
      xLabels = (x, i) => {
        return x.map(v => '\'' + v.toString().substr(2))
      }
    }
  }

  return (
    <>
      <SectionHeader
        title="Total production"
        linkLabel="production"
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
          period={period} />
        <Grid item xs={12} md={4}>
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
          />
        </Grid>
        <Grid item xs={12} md={4}>
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
              console.log('handle select', d)
              return handleSelect(d)
            }
            }
            selectedIndex={selected}
            units='mcf'
            showLegendUnits
          />
        </Grid>
        <Grid item xs={12} md={4}>
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
              console.log('handle select', d)
              return handleSelect(d)
            }
            }
            selectedIndex={selected}
            units='tons'
            showLegendUnits
          />

        </Grid>
      </Grid>
      <Box fontStyle="italic" textAlign="right" fontSize="h6.fontSize">
        <Link href='/downloads/federal-production-by-month/'>Source file</Link>
      </Box>
    </>
  )
}

export default TotalProduction
