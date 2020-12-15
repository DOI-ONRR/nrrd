import React, { useContext, useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'

import { useTheme, makeStyles } from '@material-ui/core/styles'

import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'
import SectionHeader from '../../sections/SectionHeader'
import SectionControls from '../../sections/SectionControls'
import Link from '../../../components/Link/'

import utils, { monthLookup } from '../../../js/utils'
import PercentDifference from '../../utils/PercentDifference'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const TOTAL_REVENUE_QUERY = gql`
  query TotalYearlyRevenue {
    # total_yearly_fiscal_revenue { 
    #   year,
    #   source,
    #   sum
    # }
    total_yearly_fiscal_revenue: total_yearly_fiscal_revenue_2 {
      period
      sum
      source: land_type
      year
      revenue_type
      sort_order
      commodity_order
      commodity
    }
    # total_yearly_calendar_revenue { 
    #   year,
    #   source,
    #   sum
    # }
    total_yearly_calendar_revenue: total_yearly_calendar_revenue_2 {
      period
      sum
      source: land_type
      year
      revenue_type
      sort_order
      commodity_order
      commodity
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

const useStyles = makeStyles(theme => ({
  inlineSourceLinks: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
  }
}))

const RevenueComparison = forwardRef((props, ref) => {
  const {
    data,
    title,
    yGroupBy
  } = props

  console.log('RevenueComparison data: ', data)

  const classes = useStyles()
  const { state: filterState } = useContext(DataFilterContext)
  const { period, monthly } = filterState
  const [selectedItem, setSelectedItem] = useState({
    month: 'November',
    year: 2020
  })

  useImperativeHandle(ref, () => ({
    setSelectedItem (d) {
      console.log('getSelected from Child', d)
      if (d.year) setSelectedItem({ ...selectedItem, year: d.year })

      if (d.month_long) {
        const monthNum = parseInt(monthLookup(d.month_long), 10)
        // get year key from xGroups
        if (d.xGroups) {
          Object.entries(d.xGroups).map((item, index) => {
            if (item[1].includes(monthNum)) {
              // console.log('current selected year and month: ', d.month_long, item[0])
              setSelectedItem({ ...selectedItem, year: item[0], month: d.month_long })
            }
          })
        }
      }
    }
  }))

  const periodAbbr = period === DFC.PERIOD_CALENDAR_YEAR ? 'CY' : 'FY'

  // Get the latest date then subtract 1 year to filter previous year data to compare current year data
  const d = new Date()
  const currentMonth = monthLookup(d.getMonth())
  const currentYear = parseInt(selectedItem.year)
  const currentYearDate = new Date(`${ currentYear }-${ currentMonth }-01`)

  // Get previous year
  const previousYear = currentYear - 1

  console.log('previous year yo: ', previousYear)

  // Text output
  const month = (monthly === DFC.MONTHLY_CAPITALIZED && selectedItem.month) && selectedItem.month.substring(0, 3)
  const previousYearText = `${ periodAbbr }${ previousYear.toString().substring(2) }`
  const changeText = 'Change'
  const changeAdditionalText = month
    ? `${ month } ${ previousYear } - ${ month } ${ currentYear }`
    : `${ previousYearText } - ${ periodAbbr }${ currentYear.toString().substring(2) }`

  let currentYearText = `${ periodAbbr }${ currentYear.toString().substring(2) }`
  if (currentMonth !== '09') {
    currentYearText = `${ currentYearText } ${ (period === DFC.PERIOD_FISCAL_YEAR) ? ' so far' : '' }`
  }



  // Comparison data
  const groupedData = utils.groupBy(data, yGroupBy)

  console.log('groupedData: ', groupedData)

  const comparisonData = Object.entries(groupedData).map((item, index) => {
    const newObj = {}
    const previousSum = item[1].filter(item => item.year === previousYear).reduce((prev, curr) => prev + curr.sum, 0)
    const currentSum = item[1].filter(item => item.year === currentYear).reduce((prev, curr) => prev + curr.sum, 0)
    newObj.previous = { ...item[1].filter(item => item.year === previousYear)[0], sum: previousSum }
    newObj.current = { ...item[1].filter(item => item.year === currentYear)[0], sum: currentSum }

    return newObj
  })

  console.log('RevenueComparison data: ', comparisonData)

  useEffect(() => {
    if (period === DFC.PERIOD_FISCAL_YEAR) setSelectedItem({ ...selectedItem, year: 2020 })
    if (period !== DFC.PERIOD_FISCAL_YEAR) setSelectedItem({ ...selectedItem, year: 2019 })
  }, [period])

  return (
    <Box ref={ref} style={{ position: 'relative', top: -16 }}>
      <Box color="secondary.main" mb={2} borderBottom={2} pb={1}>
        <Box component="h3" m={0} color="primary.dark">
          {title}
        </Box>
      </Box>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} size="small" aria-label="Revenue Trends Table">
          <TableHead>
            <TableRow>
              <TableCell style={{ verticalAlign: 'bottom' }}>
                <Box fontWeight="bold" style={{ textTransform: 'capitalize' }}>{yGroupBy}</Box>
              </TableCell>
              <TableCell style={{ verticalAlign: 'bottom' }}>
                <Box fontWeight="bold">
                  {month ? `${ month } ${ previousYear }` : previousYearText }
                </Box>
                {(!month) && <Box>{'(Oct - Sep)' }</Box>}
              </TableCell>
              <TableCell style={{ verticalAlign: 'bottom' }} align="right">
                <Box fontWeight="bold">{changeText}</Box>
                <Box>{changeAdditionalText}</Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { comparisonData.map((item, index) => (
              <TableRow>
                <TableCell style={{ verticalAlign: 'bottom' }}>
                  <Box fontSize="16px">{item.current ? item.current[yGroupBy] : ''}</Box>
                </TableCell>
                <TableCell component="th" scope="row" style={{ verticalAlign: 'bottom' }}>
                  <Box>
                    {item.previous ? utils.formatToDollarInt(item.previous.sum) : '--'}
                  </Box>
                </TableCell>
                <TableCell align="right" width="30%" style={{ verticalAlign: 'bottom' }}>
                  <Box>
                    {item.previous && item.current
                      ? <PercentDifference
                        currentAmount={item.current.sum}
                        previousAmount={item.previous.sum}
                      />
                      : '--'
                    }
                  </Box>
                </TableCell>
              </TableRow>
            ))
            }
          </TableBody>
		      </Table>
		    </TableContainer>
      <Box fontStyle="italic" fontSize="h6.fontSize" className={classes.inlineSourceLinks}>
        <Link href='/downloads/revenue-by-month/'>Source file</Link>
        <Link href='/downloads/revenue-by-month/'>Source file</Link>
      </Box>
    </Box>
  )
})

// TotalRevenue component
const TotalRevenue = props => {
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const { monthly, period, breakoutBy, year } = filterState
  const revenueComparison = useRef(null)

  const revenueComparisonTitle = monthly === 'Monthly' ? 'Month over month comparison' : 'Year over year comparison'
  const chartTitle = props.chartTitle || `${ DFC.REVENUE } by ${ period.toLowerCase() } (dollars)`
  const yOrderBy = ['Federal onshore', 'Federal offshore', 'Native American', 'Federal - Not tied to a lease']

  const { loading, error, data } = useQuery(TOTAL_REVENUE_QUERY)

  const handleBarHover = d => {
    console.log('handleBarHover d: ', d)
    revenueComparison.current.setSelectedItem(d)
  }

  if (loading) {
    return 'Loading...'
  }

  if (error) return `Error! ${ error.message }`
  let chartData
  let comparisonData
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

    console.log('maxCalendarYear: ', maxCalendarYear)

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
        comparisonData = data.total_yearly_fiscal_revenue
        chartData = data.total_yearly_fiscal_revenue.filter(item => item.year >= maxFiscalYear - 9)
        console.log('TotalRevenue chartData: ', chartData)
        xGroups[DFC.PERIOD_FISCAL_YEAR] = chartData.map((row, i) => row.year)
      }
      else {
        comparisonData = data.total_yearly_calendar_revenue
        chartData = data.total_yearly_calendar_revenue.filter(item => item.year <= maxCalendarYear && item.year >= maxCalendarYear - 9)
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
        <Grid item xs={12} md={7}>
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
            handleBarHover={handleBarHover}
          />
          <Box fontStyle="italic" textAlign="right" fontSize="h6.fontSize">
            <Link href='/downloads/revenue-by-month/'>Source file</Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <RevenueComparison
            ref={revenueComparison}
            title={revenueComparisonTitle}
            data={comparisonData}
            yGroupBy={yGroupBy}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default TotalRevenue
