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
  }
}))

const RevenueTrends = () => {
  const classes = useStyles()
  const { loading, data } = useQuery(APOLLO_QUERY)

  if (
    data &&
    data.revenue_trends.length > 0
  ) {
    // Group data to match what was previously happening with gatsby static query
    console.debug('data.revenue_trends: ', data.revenue_trends)
    const groupedData = groupBy(data.revenue_trends, 'fiscalYear')
    const fiscalYearData = groupedData.map(item => {
      const newObj = {}
      newObj.fiscalYear = item[0].fiscalYear
      newObj.data = item

      return newObj
    })

    console.debug('fiscalYearData: ', fiscalYearData.slice())

    // Get the latest date then subtract 1 year to filter previous year data to compare current year data
    const currentYearDate = new Date(fiscalYearData[0].data[0].fiscalYear.toString())
    const previousYearMaxDate = new Date(fiscalYearData[0].data[0].fiscalYear.toString())
    const currentYearData = (JSON.parse(JSON.stringify(fiscalYearData)).splice(0, 1)).map(calculateRevenueTypeAmountsByYear)[0]
    // console.debug('currentYearData: ', currentYearData)
    calculateOtherRevenues(currentYearData)

    const currentYearTotal = (currentYearData.amountByRevenueType.Royalties +
              currentYearData.amountByRevenueType.Bonus +
              currentYearData.amountByRevenueType.Rents +
              currentYearData.amountByRevenueType['Other Revenues'])

    // If current fiscal year date is September then we have the full year and we should include it in the trend lines
    const beginTrendDataLimit = (currentYearDate.getMonth() === 8) ? 0 : 1
    const trendData = fiscalYearData.splice(beginTrendDataLimit, TREND_LIMIT)
    console.debug('trendData: ', trendData)
    const previousYearDataIndex = (beginTrendDataLimit === 0) ? 1 : 0
    let previousYearData = JSON.parse(JSON.stringify(trendData))[previousYearDataIndex]
    console.debug('previousYearData: ', previousYearData)
    console.debug('previousYearMaxDate: ', previousYearMaxDate)
    previousYearData.data = previousYearData.data.filter(item => monthlyDate(item.month) <= previousYearMaxDate)

    previousYearData = [previousYearData].map(calculateRevenueTypeAmountsByYear)[0]
    calculateOtherRevenues(previousYearData)
    const previousYearTotal = previousYearData.amountByRevenueType.Royalties +
                                previousYearData.amountByRevenueType.Bonus +
                                previousYearData.amountByRevenueType.Rents +
                                previousYearData.amountByRevenueType['Other Revenues']

    const currentFiscalYearText = `FY${ currentYearData.year.toString().slice(2) } so far`
    const currentTrendText = `FY${ trendData[trendData.length - 1].fiscalYear.toString().slice(2) } - FY${ trendData[0].fiscalYear.toString().slice(2) } trend`
    const previousFiscalYearText = `from FY${ previousYearData.year.toString().slice(2) }`

    // Sort trend data asc for spark lines
    trendData.sort((a, b) => (a.fiscalYear > b.fiscalYear) ? 1 : -1)
    const sparkLineData = trendData.map(calculateRevenueTypeAmountsByYear)
    console.debug('sparkLineData: ', sparkLineData)
    const royalties = sparkLineData.map(item => ([item.year, item.amountByRevenueType.Royalties]))
    const bonuses = sparkLineData.map(item => ([item.year, item.amountByRevenueType.Bonus]))
    const rents = sparkLineData.map(item => ([item.year, item.amountByRevenueType.Rents]))
    const otherRevenues = sparkLineData.map(item => {
      calculateOtherRevenues(item)
      return ([item.year, item.amountByRevenueType['Other Revenues']])
    })
    const totalRevenues = sparkLineData.map(item => (
      [
        item.year,
        (
          item.amountByRevenueType.Royalties +
          item.amountByRevenueType.Bonus +
          item.amountByRevenueType.Rents +
          item.amountByRevenueType['Other Revenues']
        )
      ])
    )

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
              <TableRow>
                <TableCell component="th" scope="row">
                  Royalties
                  <Sparkline
                    data={royalties} />
                </TableCell>
                <TableCell align="right">
                  <Box>
                    {utils.formatToSigFig_Dollar(currentYearData.amountByRevenueType.Royalties, 3)}
                  </Box>
                  <Box>
                    <PercentDifference
                      currentAmount={currentYearData.amountByRevenueType.Royalties}
                      previousAmount={previousYearData.amountByRevenueType.Royalties}
                    />{' ' + previousFiscalYearText}
                  </Box>

                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Bonuses
                  <Sparkline
                    data={bonuses} />
                </TableCell>
                <TableCell align="right">
                  <Box>
                    {utils.formatToSigFig_Dollar(currentYearData.amountByRevenueType.Bonus, 3)}
                  </Box>
                  <Box>
                    <PercentDifference
                      currentAmount={currentYearData.amountByRevenueType.Bonus}
                      previousAmount={previousYearData.amountByRevenueType.Bonus}
                    />{' ' + previousFiscalYearText}
                  </Box>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">
                  Rents
                  <Sparkline
                    data={rents} />
                </TableCell>
                <TableCell align="right">
                  <Box>
                    {utils.formatToSigFig_Dollar(currentYearData.amountByRevenueType.Rents, 3)}
                  </Box>
                  <Box>
                    <PercentDifference
                      currentAmount={currentYearData.amountByRevenueType.Rents}
                      previousAmount={previousYearData.amountByRevenueType.Rents}
                    />{' ' + previousFiscalYearText}
                  </Box>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">
                  Other Revenues
                  <Sparkline
                    data={otherRevenues} />
                </TableCell>
                <TableCell align="right">
                  <Box>
                    {utils.formatToSigFig_Dollar(currentYearData.amountByRevenueType['Other Revenues'], 3)}
                  </Box>
                  <Box>
                    <PercentDifference
                      currentAmount={currentYearData.amountByRevenueType['Other Revenues']}
                      previousAmount={previousYearData.amountByRevenueType['Other Revenues']}
                    />{' ' + previousFiscalYearText}
                  </Box>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell component="th" scope="row">
                  <Box fontWeight="bold">Total Revenues</Box>
                  <Sparkline data={totalRevenues} />
                </TableCell>
                <TableCell align="right">
                  <Box fontWeight="bold">
                    {utils.formatToSigFig_Dollar(currentYearTotal, 3)}
                  </Box>
                  <Box>
                    <PercentDifference
                      currentAmount={currentYearTotal}
                      previousAmount={previousYearTotal}
                    />{' ' + previousFiscalYearText}
                  </Box>
                </TableCell>
              </TableRow>
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
* Group by defined property and return object
* @param array of items to do groupings
* @property property field to group by, this will be the key
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
