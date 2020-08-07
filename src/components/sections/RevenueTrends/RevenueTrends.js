import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import * as d3 from 'd3'
import utils from '../../../js/utils'
import PercentDifference from '../../utils/PercentDifference'
import Link from '../../../components/Link'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core'

import Sparkline from '../../data-viz/Sparkline'

const TREND_LIMIT = 10

/**
* RevenueTrends - react functional component that generates revenue trends graph
*
* uses hook useStaticQuery and graphl to get revenue data then
* summarizes data for graphical representation
*/

const APOLLO_QUERY = gql`
    query RevenueTrendsQuery {
      revenue_trends(order_by: {fiscal_year: desc, current_month: desc}) {
        fiscalYear:fiscal_year
        revenue:total
        revenue_ytd:total_ytd
        revenueType:trend_type
        month:current_month
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

const RevenueTrends = props => {
  const classes = useStyles()

  const { state: filterState } = useContext(DataFilterContext)
  let year

  const { loading, error, data } = useQuery(APOLLO_QUERY)

  if (loading) return null
  if (error) return `Error! ${ error }`

  if (
    data &&
    data.revenue_trends.length > 0
  ) {
    // Group data by year
    const groupedData = utils.groupBy(data.revenue_trends, 'fiscalYear')

    const fiscalYearData = Object.entries(groupedData).map((item, index) => {
      const newObj = {}
      newObj.fiscalYear = item[0]
      newObj.data = item[1]

      return newObj
    })

    // Get the latest date then subtract 1 year to filter previous year data to compare current year data
    const currentMonth = monthLookup(fiscalYearData[0].data[0].month)
    const currentYear = fiscalYearData[fiscalYearData.length - 1].fiscalYear
    const currentYearDate = new Date(`${ currentYear }-${ currentMonth }-01`)

    // Get previous year
    const previousYear = currentYear - 1

    // Trends
    const trends = aggregateData(data.revenue_trends)

    // maxMonth Min/Max Year
    const maxMonth = currentYearDate.toLocaleString('en-us', { timeZone: 'UTC', month: 'long' })
    const minYear = trends[0].histData[0][0].substring(2)
    const maxYear = trends[0].histData[trends[0].histData.length - 1][0].substring(2)

    // Text output
    const currentFiscalYearText = `FY${ currentYear.toString().substring(2) } so far`
    const longCurrentYearText = `${ maxMonth } ${ currentYear }`
    const previousFiscalYearText = `from FY${ previousYear.toString().substring(2) }`
    const currentTrendText = `FY${ minYear } - FY${ maxYear }`
    console.debug("Fitler State", filterState, "DFC.year", DFC.YEAR, " OR ", trends[0], "WTH ", DFC)
    
    year = filterState[DFC.year] || trends[0].histData[trends[0].histData.length - 1][0]

    return (
      <Box component="section">
        <Box color="secondary.main" mb={2} borderBottom={2} pb={1}>
          <Box component="h3" m={0} color="primary.dark">{props.title}</Box>
        </Box>
        <Box component="p" color="text.primary">
          Includes federal and Native American revenue through {longCurrentYearText}
        </Box>

        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} size="small" aria-label="Revenue Trends Table">
            <TableHead>
              <TableRow>
                <TableCell><Box fontWeight="bold">{currentTrendText}</Box></TableCell>
                <TableCell align="right"><Box fontWeight="bold">{currentFiscalYearText}</Box></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                trends.map((trend, index) => (
                  <TableRow key={`tableRow${ index }`}>
                    <TableCell component="th" scope="row">
                      <Box fontWeight={trend.className === 'strong' ? 'bold' : 'regular'}>
                        {trend.fund}
                      </Box>
                      <Sparkline
                        key={`sparkline${ index }`}
                        data={trend.histData}
                        highlightIndex={trend.histData.findIndex(
                          x => x[0] === parseInt(year)
                        )} />
                    </TableCell>
                    <TableCell align="right">
                      <Box fontWeight={trend.className === 'strong' ? 'bold' : 'regular'}>
                        {utils.formatToSigFig_Dollar(trend.current, 3)}
                      </Box>
                      <Box>
                        <PercentDifference
                          currentAmount={trend.current}
                          previousAmount={trend.previous}
                        />{` ${ previousFiscalYearText }`}
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
  }
  else {
    return (
      <span>Cannot locate any revenue data</span>
    )
  }
}

export default RevenueTrends

const monthLookup = month => {
  const monthNumber = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12'
  }

  return monthNumber[month]
}

/**
* calculateOtherRevenues(data) - calculates other revenus from other revenues, inspections fees and civil penalties.
*
*  @param {object} data item
*
*  @example
*            calculateOtherRevenues(yearData);
*
**/

const calculateOtherRevenues = data => {
  const otherRevenuesAmount = (data.amountByRevenueType['Other Revenues']) ? data.amountByRevenueType['Other Revenues'] : 0
  const inspectionFeesAmount = (data.amountByRevenueType['Inspection Fees']) ? data.amountByRevenueType['Inspection Fees'] : 0
  const civilPenaltiesAmount = (data.amountByRevenueType['Civil Penalties']) ? data.amountByRevenueType['Civil Penalties'] : 0

  data.amountByRevenueType['Other Revenues'] = otherRevenuesAmount + inspectionFeesAmount + civilPenaltiesAmount
}

/**
* Group by defined property and return object with key, value
* @param array of items to do groupings
* @prop property field to group by, this will be the key
*
*/
// const groupBy = (arr, prop) => {
//   const map = new Map(Array.from(arr, obj => [obj[prop], []]))
//   arr.forEach(obj => map.get(obj[prop]).push(obj))
//   return Array.from(map.values())
// }

/**
* calculateRevenueTypeAmountsByYear(data,index) - calculates other revenus from other revenues, inspections fees and civil penalties.
*
*
**/

const calculateRevenueTypeAmountsByYear = (yearData, index) => {
  const fiscalYear = yearData.fiscalYear
  const sums = yearData.data.reduce((total, item) => {
    total[item.revenueType] =
      (total[item.revenueType] !== undefined)
        ? total[item.revenueType] + item.revenue
        : item.revenue

    return total
  }, {})

  return { year: fiscalYear, amountByRevenueType: sums }
}

const aggregateData = data => {
  const r = [
    { fund: 'Royalties', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Bonuses', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Rents', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Other revenues', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Total revenues', current: 0, previous: 0, histSum: {}, histData: [], className: 'strong' }
  ]

  const currentYear = data[0].fiscalYear
  const currentMonth = data[0].month
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (item.revenueType.match(/Royalties/)) {
      sumData(item, r, 0, currentYear) // sum into Royalties
    }
    else if (item.revenueType.match(/Bonus/)) {
      sumData(item, r, 1, currentYear) // sum into Bonus
    }
    else if (item.revenueType.match(/Rents/)) {
      sumData(item, r, 2, currentYear) // sum into Rents
    }
    else if (item.revenueType.match(/Other Revenues/)) {
      sumData(item, r, 3, currentYear) // sum into Other Revenues
    }
    else if (item.revenueType.match(/All Revenue/)) {
      sumData(item, r, 4, currentYear) // sum into Total
    }
  }

  r.map((row, i) => {
    let a = []
    const years = Object.keys(row.histSum).sort()
    a = years.map((year, i) => ([year, row.histSum[year]]))
    // console.debug(currentMonth, 'YEARS ------->', years, 'AAAAAAAAAAAAAAAAAAAAAAAAA a', a)
    if (currentMonth === 'December') {
      r[i].histData = a.slice(-10)
      return a.slice(-10)
    }
    else {
      r[i].histData = a.slice(-11).slice(0, 10)
      return a.slice(-11).slice(0, 10)
    }
  })

  return r
}

const sumData = (item, r, index, currentYear) => {
  const previousYear = currentYear - 1
  if (item.fiscalYear === currentYear) r[index].current += item.revenue_ytd
  if (item.fiscalYear === previousYear) r[index].previous += item.revenue_ytd

  if (r[index].histSum[item.fiscalYear]) {
    if (!isNaN(Number(item.revenue))) r[index].histSum[item.fiscalYear] += Number(item.revenue)
  }
  else {
    r[index].histSum[item.fiscalYear] = Number(item.revenue)
  }
}
