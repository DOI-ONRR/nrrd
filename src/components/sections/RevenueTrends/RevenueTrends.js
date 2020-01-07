import React from 'react'
// import { useStaticQuery, graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import * as d3 from 'd3'
import utils from '../../../js/utils'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import Sparkline from '../../data-viz/Sparkline'

import TriangleUpIcon from '-!svg-react-loader!../../../img/svg/arrow-up.svg'
import TriangleDownIcon from '-!svg-react-loader!../../../img/svg/arrow-down.svg'
// import { useStaticQuery, graphql } from 'gatsby'

// import styles from './RevenueTrends.module.scss'

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
        revenueType:trend_type
        month:current_month
      }
    }
  `

const useStyles = makeStyles(theme => ({
  root: {},
  tableContainer: {},
  table: {},
  trendIcon: {
    position: 'relative',
    marginRight: 5,
    top: 5,
  },
}))

const RevenueTrends = () => {
  const classes = useStyles()
  const { loading, error, data } = useQuery(APOLLO_QUERY)

  if (loading) return null
  if (error) return `Error! ${ error }`

  if (
    data &&
    data.revenue_trends.length > 0
  ) {
    // Group data to match what was previously happening with gatsby static query
    const groupedData = groupBy(data.revenue_trends, 'fiscalYear')
    const fiscalYearData = groupedData.map(item => {
      const newObj = {}
      newObj.fiscalYear = item[0].fiscalYear
      newObj.data = item

      return newObj
    })

    // Get the latest date then subtract 1 year to filter previous year data to compare current year data
    const currentYearDate = new Date(fiscalYearData[0].data[0].fiscalYear.toString())
    const previousYearMaxDate = new Date(fiscalYearData[0].data[0].fiscalYear.toString())
    const currentYearData = (JSON.parse(JSON.stringify(fiscalYearData)).splice(0, 1)).map(calculateRevenueTypeAmountsByYear)[0]
    calculateOtherRevenues(currentYearData)

    // If current fiscal year date is September then we have the full year and we should include it in the trend lines
    const beginTrendDataLimit = (currentYearDate.getMonth() === 8) ? 0 : 1
    const trendData = fiscalYearData.splice(beginTrendDataLimit, TREND_LIMIT)
    const previousYearDataIndex = (beginTrendDataLimit === 0) ? 1 : 0
    let previousYearData = JSON.parse(JSON.stringify(trendData))[previousYearDataIndex]
    previousYearData.data = previousYearData.data.filter(item => monthlyDate(item.month) <= previousYearMaxDate)

    previousYearData = [previousYearData].map(calculateRevenueTypeAmountsByYear)[0]
    calculateOtherRevenues(previousYearData)

    const currentFiscalYearText = `FY${ currentYearData.year.toString().slice(2) } so far`
    const currentTrendText = `FY${ trendData[trendData.length - 1].fiscalYear.toString().slice(2) } - FY${ trendData[0].fiscalYear.toString().slice(2) } trend`
    const previousFiscalYearText = `from FY${ previousYearData.year.toString().slice(2) }`

    // Trends
    const trends = aggregateData(data.revenue_trends)
    console.log('trends: ', trends)
    // const minYear = trends[0].histData[0].year.substring(2)
    // const maxYear = trends[0].histData[trends[0].histData.length - 1].year.substring(2)

    return (
      <Box component="section" className={classes.root}>
        <Typography variant="h3" className="header-bar green">
          Revenue trends
        </Typography>
        <Typography variant="body1" paragraph={true}>
          Includes federal and Native American revenue through {currentYearDate.toLocaleString('en-us', { timeZone: 'UTC', month: 'long' })} {currentYearDate.getUTCFullYear()}
        </Typography>

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
                trends.map((trend, idx) => (
                  <TableRow key={`tableRow${ idx }`}>
                    <TableCell component="th" scope="row">
                      <Box fontWeight={trend.className === 'strong' ? 'bold' : 'regular'}>
                        {trend.fund}
                      </Box>
                      <Sparkline
                        key={`sparkline${ idx }`}
                        data={trend.histData} />
                    </TableCell>
                    <TableCell align="right">
                      <Box fontWeight={trend.className === 'strong' ? 'bold' : 'regular'}>
                        {utils.formatToSigFig_Dollar(trend.current, 3)}
                      </Box>
                      <Box>
                        <PercentDifference
                          currentAmount={trend.current}
                          previousAmount={trend.previous}
                        />{' ' + previousFiscalYearText}
                      </Box>

                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
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

const monthlyDate = obj => {
  let month = monthLookup(obj)
  if (month < 10) {
    month = '0' + month
  };
  const year = Math.floor(obj.toString().substring(1)) + 2000
  const date = new Date(year + '-' + month + '-02')
  return date
}

const monthLookup = month => {
  const monthNumber = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12
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
const groupBy = (arr, prop) => {
  const map = new Map(Array.from(arr, obj => [obj[prop], []]))
  arr.forEach(obj => map.get(obj[prop]).push(obj))
  return Array.from(map.values())
}

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

/**
* PercentDifference({currentAmount,previousAmount}) - calculates other revenus from other revenues, inspections fees and civil penalties.
*
*  @return TriangleUpIcon || TriangleDownIcon
**/

const PercentDifference = ({ currentAmount, previousAmount }) => {
  const classes = useStyles()
  const percentIncrease = ((currentAmount - previousAmount) / previousAmount) * 100

  return (
    <span>
      {percentIncrease > 0
        ? <TriangleUpIcon className={classes.trendIcon} viewBox="-20 -15 50 40"/>
        : <TriangleDownIcon className={classes.trendIcon} viewBox="-20 -10 50 40"/>
      }
      <span>
        {utils.round(percentIncrease, 0) + '%'}
      </span>
    </span>
  )
}

const aggregateData = data => {
  const r = [
    { fund: 'Royalties', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Bonuses', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Rents', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Other Revenues', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Total Revenues', current: 0, previous: 0, histSum: {}, histData: [], className: 'strong' }
  ]

  const currentYear = data[0].fiscalYear

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
    else {
      sumData(item, r, 3, currentYear) // sum into Other Revenues
    }
    sumData(item, r, 4, currentYear) // sum into Total
  }

  r.map((row, i) => {
    let a = []
    const years = Object.keys(row.histSum).sort()
    a = years.map((year, i) => ([year, row.histSum[year]]))
    r[i].histData = a.slice(-10)
    return a.slice(-10)
  })

  return r
}

const sumData = (item, r, idx, currentYear) => {
  const previousYear = currentYear - 1
  if (item.fiscalYear === currentYear) r[idx].current += item.revenue
  if (item.fiscalYear === previousYear) r[idx].previous += item.revenue

  if (r[idx].histSum[item.fiscalYear]) {
    if (!isNaN(Number(item.revenue))) r[idx].histSum[item.fiscalYear] += Number(item.revenue)
  }
  else {
    r[idx].histSum[item.fiscalYear] = Number(item.revenue)
  }
}
