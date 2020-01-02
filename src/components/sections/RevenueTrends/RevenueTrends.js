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
        total
        trend_type
        current_month
      }
    }
  `

const useStyles = makeStyles(theme => ({
  root: {},
  tableContainer: {},
  table: {},
}))

const RevenueTrends = () => {
  const classes = useStyles()
  const { loading, data } = useQuery(APOLLO_QUERY)

  if (data) {
    const fiscalYearData = JSON.parse(JSON.stringify(data.revenue_trends)).sort((a, b) => (a.fiscal_year < b.fiscal_year) ? 1 : -1)
    console.log('fiscalYearData: ', fiscalYearData)

    const currentMonthly = fiscalYearData.map(obj => ({ ...obj, month: monthLookup(obj.current_month), fiscalMonth: fiscalMonthLookup(obj.current_month), date: monthlyDate(obj) }))

    // Get the latest date then subtract 1 year to filter previous year data to compare current year data
    const currentYearDate = new Date(`${ fiscalYearData[0].fiscalYear }-${ fiscalYearData[0].current_month }-01`)
    const previousYearMaxDate = new Date(`${ fiscalYearData[0].fiscal_year }-${ fiscalYearData[0].current_month }-01`)

    previousYearMaxDate.setFullYear(previousYearMaxDate.getUTCFullYear() - 1)

    const currentYearData = (JSON.parse(JSON.stringify(fiscalYearData)).splice(0, 1)).map(calculateRevenueTypeAmountsByYear)[0]
    calculateOtherRevenues(currentYearData)
    // console.log('currentYearData: ', currentYearData)

    const currentYearTotal = (currentYearData.amountByRevenueType.Royalties +
               currentYearData.amountByRevenueType.Bonus +
               currentYearData.amountByRevenueType.Rents +
               currentYearData.amountByRevenueType['Other Revenues'])

    // If current fiscal year date is September then we have the full year and we should include it in the trend lines
    const beginTrendDataLimit = (currentYearDate.getMonth() === 8) ? 0 : 1
    const trendData = fiscalYearData.splice(beginTrendDataLimit, TREND_LIMIT)
    const minYear = trendData[0].fiscalYear.toString().substring(2)
    const maxYear = trendData[trendData.length - 1].fiscalYear.toString().substring(2)

    console.log('trendData: ', trendData)

    const maxMonth = getMaxMonth(currentMonthly).toLocaleString(undefined, { month: 'long' })
    const calendarYear = getMaxMonth(currentMonthly).getFullYear()
    const currentYear = getCurrentYear(currentMonthly)
    const previousYear = getPreviousYear(currentMonthly)

    // const previousYearDataIndex = (beginTrendDataLimit === 0) ? 1 : 0
    // const previousYearData = JSON.parse(JSON.stringify(trendData))[previousYearDataIndex]
    // console.log('previousYearData: ', previousYearData)
    // previousYearData = previousYearData.filter(item => new Date(item.node.RevenueDate) <= previousYearMaxDate)

    // previousYearData = [previousYearData].map(calculateRevenueTypeAmountsByYear)[0]
    // calculateOtherRevenues(previousYearData)
    // const previousYearTotal = previousYearData.amountByRevenueType.Royalties +
    //                              previousYearData.amountByRevenueType.Bonus +
    //                              previousYearData.amountByRevenueType.Rents +
    //                              previousYearData.amountByRevenueType['Other Revenues']

    const currentfiscalYearText = `FY${ currentYear.toString().substring(2) } so far`
    const longCurrentText = `${ maxMonth } ${ calendarYear }`
    const previousfiscalYearText = `from FY ${ previousYear }`

    // Sort trend data asc for spark lines
    trendData.sort((a, b) => (a.fiscalYear > b.fiscalYear) ? 1 : -1)
    const sparkLineData = trendData.map(calculateRevenueTypeAmountsByYear)

    const royalties = sparkLineData.map(yearData => ({ year: yearData.year, amount: yearData.amountByRevenueType.Royalties }))
    const bonuses = sparkLineData.map(yearData => ({ year: yearData.year, amount: yearData.amountByRevenueType.Bonus }))
    const rents = sparkLineData.map(yearData => ({ year: yearData.year, amount: yearData.amountByRevenueType.Rents }))
    const otherRevenues = sparkLineData.map(yearData => {
      calculateOtherRevenues(yearData)
      return ({ year: yearData.year, amount: yearData.amountByRevenueType['Other Revenues'] })
    })
    const totalRevenues = sparkLineData.map(yearData => (
      {
        year: yearData.year,
        amount: (
          yearData.amountByRevenueType.Royalties +
               yearData.amountByRevenueType.Bonus +
               yearData.amountByRevenueType.Rents +
               yearData.amountByRevenueType['Other Revenues']
        )
      })
    )

    return (
      <Box component="section" className={classes.root}>
        <Typography variant="h3" className="h3Bar">
          Revenue trends
        </Typography>
        <Typography variant="body1" paragraph={true}>
          Includes federal and Native American revenue through {currentYearDate.toLocaleString('en-us', { timeZone: 'UTC', month: 'long' })} {currentYearDate.getUTCFullYear()}
        </Typography>

        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} aria-label="Revenue Trends Table">
            <TableHead>
              <TableRow>
                <TableCell>FY{minYear} - FY{maxYear} trend</TableCell>
                <TableCell align="right">{currentfiscalYearText}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Royalties
                </TableCell>
                <TableCell align="right">
                  {utils.formatToSigFig_Dollar(currentYearData.amountByRevenueType.Royalties, 3)}
                </TableCell>
              </TableRow>
              {
                trendData.map((trend, index) => (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {trend.trend_type}
                      {/* <Sparkline key={`spark${ index }`} data={trend.histData} /> */}
                    </TableCell>
                    <TableCell align="right">
                      {/* <PercentDifference
                        currentAmount={currentYear.amountByRevenueType.Royalties}
                        previousAmount={previousYear.amountByRevenueType.Royalties}
                      />{' ' + previousfiscalYearText} */}
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        {/* <table className={classes.revenueTable}>
        <thead>
          <tr>
            <th>{'FY' + trendData[0].fiscalYear.slice(2) + ' - ' +
              'FY' + trendData[trendData.length - 1].fiscalYear.slice(2)} trend</th>
            <th className={classes.alignRight}>{currentfiscalYearText}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Royalties</td>
            <td className={classes.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.amountByRevenueType.Royalties, 3)}</td>
          </tr>
          <tr>
            <td><Sparkline data={royalties} /></td>
            <td className={classes.alignRight}>
              <PercentDifference
                currentAmount={currentYearData.amountByRevenueType.Royalties}
                previousAmount={previousYearData.amountByRevenueType.Royalties}
              />{' ' + previousfiscalYearText}
            </td>
          </tr>
          <tr>
            <td>Bonuses</td>
            <td className={classes.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.amountByRevenueType.Bonus, 3)}</td>
          </tr>
          <tr>
            <td><Sparkline data={bonuses} /></td>
            <td className={classes.alignRight}>
              <PercentDifference
                currentAmount={currentYearData.amountByRevenueType.Bonus}
                previousAmount={previousYearData.amountByRevenueType.Bonus}
              />{' ' + previousfiscalYearText}
            </td>
          </tr>
          <tr>
            <td>Rents</td>
            <td className={classes.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.amountByRevenueType.Rents, 3)}</td>
          </tr>
          <tr>
            <td><Sparkline data={rents} /></td>
            <td className={classes.alignRight}>
              <PercentDifference
                currentAmount={currentYearData.amountByRevenueType.Rents}
                previousAmount={previousYearData.amountByRevenueType.Rents}
              />{' ' + previousfiscalYearText}
            </td>
          </tr>
          <tr>
            <td>Other revenues</td>
            <td className={classes.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.amountByRevenueType['Other Revenues'], 3)}</td>
          </tr>
          <tr>
            <td><Sparkline data={otherRevenues} /></td>
            <td className={classes.alignRight}>
              <PercentDifference
                currentAmount={currentYearData.amountByRevenueType['Other Revenues']}
                previousAmount={previousYearData.amountByRevenueType['Other Revenues']}
              />{' ' + previousfiscalYearText}
            </td>
          </tr>
          <tr>
            <td><strong>Total revenues</strong></td>
            <td className={classes.alignRight}><strong>{utils.formatToSigFig_Dollar(currentYearTotal, 3)}</strong></td>
          </tr>
          <tr>
            <td><Sparkline data={totalRevenues} /></td>
            <td className={classes.alignRight}>
              <PercentDifference
                currentAmount={currentYearTotal}
                previousAmount={previousYearTotal}
              />{' ' + previousfiscalYearText}</td>
          </tr>
        </tbody>
      </table> */}
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

/**
* getCurrentYear(data) - returns current year
* @param {object} data item
**/
const getCurrentYear = data => {
  const r = data.reduce((max, p) => p.fiscalYear > max ? p.fiscalYear : max, data[0].fiscalYear)
  return r
}

/**
* getPreviousYear(data) - returns previous year
* @param {object} data item
**/
const getPreviousYear = data => {
  const r = data.reduce((min, p) => p.fiscalYear < min ? p.fiscalYear : min, data[0].fiscalYear)

  return r
}

const getMaxMonth = data => {
  const r = data.reduce((max, p) => p.date > max ? p.date : max, data[0].date)

  return r
}

const monthlyDate = obj => {
  let month = monthLookup(obj.current_month)
  if (month < 10) {
    month = '0' + month
  };
  const year = Math.floor(obj.fiscalYear.toString().substring(1)) + 2000
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
const fiscalMonthLookup = month => {
  const monthNumber = {
    January: 4,
    February: 5,
    March: 6,
    April: 7,
    May: 8,
    June: 9,
    July: 10,
    August: 11,
    September: 12,
    October: 1,
    November: 2,
    December: 3
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
* calculateRevenueTypeAmountsByYear(data,index) - calculates other revenus from other revenues, inspections fees and civil penalties.
*
*
**/

const calculateRevenueTypeAmountsByYear = (yearData, index) => {
  const fiscalYear = yearData.fiscal_year
  const arrData = Object.keys(yearData).map(k => {
    return { [k]: yearData[k] }
  })

  const sums = arrData.reduce((total, item) => {
    total[item.trend_type] =
      (total[item.trend_type] !== undefined)
        ? total[item.trend_type] + item.total
        : item.total

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
  const percentIncrease = ((currentAmount - previousAmount) / previousAmount) * 100
  return (
    <span>
      {percentIncrease > 0
        ? <TriangleUpIcon viewBox="-20 -15 50 40"/>
        : <TriangleDownIcon viewBox="-20 -10 50 40"/>
      }
      <span>
        {utils.round(percentIncrease, 0) + '%'}
      </span>
    </span>
  )
}
