import React from 'react'
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
import CircularProgress from '@material-ui/core/CircularProgress'

import Sparkline from '../../data-viz/Sparkline'

import TriangleUpIcon from '-!svg-react-loader!../../../img/svg/arrow-up.svg'
import TriangleDownIcon from '-!svg-react-loader!../../../img/svg/arrow-down.svg'

const TREND_LIMIT = 10

/**
* DisbursmentTrends - react functional component that generates revenue trends graph
*
* uses hook useStaticQuery and graphl to get revenu data then
* summarizes data for graphical representation
*/

const APOLLO_QUERY = gql`
  query DisbursementTrendsQuery {
    allYearlyDisbursements : disbursement(order_by: {period: {fiscal_year: desc}}) {
      period {
        fiscalYear:fiscal_year
      }
      commodity {
        fund_type
      }
      location {
        county
        state
      }
      _Total_:disbursement
    }
    currentMonthlyDisbursements : disbursement(order_by: {period: {fiscal_year: desc}}) {
      period {
        fiscalYear:fiscal_year
        month
        month_long
      }
      commodity {
        fund_type
      }
      disbursement
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

const DisbursementTrends = () => {
  const classes = useStyles()
  const { loading, error, data } = useQuery(APOLLO_QUERY)

  if (loading) return null
  if (error) return `Error! ${ error }`

  if (
    data &&
    data.allYearlyDisbursements.length > 0 &&
    data.currentMonthlyDisbursements.length > 0
  ) {
    console.debug('APOLLO_QUERY Data: ', data)
    const dataYearly = data.allYearlyDisbursements
    const currentMonthly = data.currentMonthlyDisbursements.map(obj => ({ ...obj, month: obj.period.month_long, fiscalMonth: fiscalMonthLookup(obj.period.month_long), date: monthlyDate(obj) }))
    // console.debug('currentMonthly: ', currentMonthly)

    const maxMonth = getMaxMonth(currentMonthly).toLocaleString(undefined, { month: 'long' })
    const calendarYear = getMaxMonth(currentMonthly).getFullYear()
    const currentYear = getCurrentYear(currentMonthly)
    const currentTrends = aggregateMonthlyData(currentMonthly, currentYear)
    // //    let currentYear=data[0].Fiscal_Year
    const previousYear = getPreviousYear(currentMonthly)
    const trends = aggregateData(dataYearly)
    console.debug('trends: ', trends)
    const minYear = trends[0].histData[0][0].substring(2)
    console.debug('minYear: ', minYear)
    const maxYear = trends[0].histData[trends[0].histData.length - 1][0].substring(2)
    // console.debug('currentYear: ', currentYear)
    const currentFiscalYearText = 'FY' + currentYear.toString().substring(2) + ' so far'
    const longCurrentText = maxMonth + ' ' + calendarYear
    const previousFiscalYearText = 'from FY' + previousYear

    return (
      <Box component="section" className={classes.root}>
        <Typography variant="h3" className="header-bar green">
            Disbursement trends
        </Typography>
        <Typography variant="body1" paragraph={true}>
          Includes disbursements through {longCurrentText}
        </Typography>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} size="small" aria-label="Revenue Trends Table">
            <TableHead>
              <TableRow>
                <TableCell><Box fontWeight="bold">FY{minYear} - FY{maxYear} trend</Box></TableCell>
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
      console.error('no data yo!')
    )
  }
}

export default DisbursementTrends

const getCurrentYear = data => {
  const r = data.reduce((max, p) => p.period.fiscalYear > max ? p.period.fiscalYear : max, data[0].period.fiscalYear)

  return r
}

const getPreviousYear = data => {
  const r = data.reduce((min, p) => p.period.fiscalYear < min ? p.period.fiscalYear : min, data[0].period.fiscalYear)

  return r
}

const getMaxMonth = data => {
  const r = data.reduce((max, p) => p.date > max ? p.date : max, data[0].date)
  return r
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

const aggregateMonthlyData = (data, currentYear) => {
  const r = [
    { fund: 'U.S. Treasury', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'States & counties', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Reclamation fund', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Native Americans', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Other Funds', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Total', current: 0, previous: 0, histSum: {}, histData: [], className: 'strong' }
  ]

  const maxFiscalMonth = data.filter((item, i) => (item.period.fiscalYear == 2020)).reduce((max, p) => p.FiscalMonth > max ? p.FiscalMonth : max, 0)

  //    let currentYear=2019;

  for (let ii = 0; ii < data.length; ii++) {
    const item = data[ii]
    if (item.FiscalMonth <= maxFiscalMonth) {
	    if (item.commodity.fund_type == 'U.S. Treasury') {
        sumMonthlyData(item, r, 0, currentYear) // sum into us treasury
	    }
      else if (item.commodity.fund_type.match(/State/)) {
        sumMonthlyData(item, r, 1, currentYear) // sum into state
	    }
      else if (item.commodity.fund_type.match(/Reclamation/)) {
        sumMonthlyData(item, r, 2, currentYear) // sum into Reclamation
	    }
      else if (item.commodity.fund_type.match(/Native American/) || item.commodity.fund_type == 'U.S. TreasuryAI') {
        sumMonthlyData(item, r, 3, currentYear) // sum into Native
	    }
      else {
        sumMonthlyData(item, r, 4, currentYear) // sum into other
	    }
	    sumMonthlyData(item, r, 5, currentYear) // sum into Total
    }
  }

  return r
}

const sumMonthlyData = (item, r, index, currentYear) => {
  const previousYear = currentYear - 1
  if (item.FiscalYear == currentYear) {
    r[index].current += item.Disbursement
  }
  if (item.FiscalYear == previousYear) {
    r[index].previous += item.Disbursement
  }
}

const monthlyDate = obj => {
  let month = monthLookup(obj.period.month_long)
  if (month < 10) {
    month = '0' + month
  };
  const displayYear = obj.period.fiscalYear
  const year = Math.floor(displayYear.toString().substring(1)) + 2000
  const date = new Date(year + '-' + month + '-02')
  return date
}

const aggregateData = data => {
  const r = [
    { fund: 'U.S. Treasury', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'States & counties', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Reclamation fund', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Native Americans', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Other Funds', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Total', current: 0, previous: 0, histSum: {}, histData: [], className: 'strong' }
  ]
  console.debug('aggregateData data: ', data)
  const currentYear = data[0].period.fiscalYear

  for (let ii = 0; ii < data.length; ii++) {
    const item = data[ii]
    if (item.commodity.fund_type.match(/U.S. Treasury/)) {
	    sumData(item, r, 0, currentYear) // sum into us treasury
    }
    else if (item.commodity.fund_type.match(/State/)) {
	    sumData(item, r, 1, currentYear) // sum into state
    }
    else if (item.commodity.fund_type.match(/Reclamation/)) {
	    sumData(item, r, 2, currentYear) // sum into Reclamation
    }
    else if (item.commodity.fund_type.match(/American Indian/)) {
	    sumData(item, r, 3, currentYear) // sum into Native
    }
    else {
	    sumData(item, r, 4, currentYear) // sum into other
    }
    sumData(item, r, 5, currentYear) // sum into Total
  }

  r.map((row, i) => {
    let a = []
    const years = Object.keys(row.histSum).sort()
    // a = years.map((year, i) => ({ year: year, amount: row.histSum[year] }))
    a = years.map((year, i) => ([year, row.histSum[year]]))
    r[i].histData = a.slice(-10)
    return a.slice(-10)
  })

  return r
}

const sumData = (item, r, index, currentYear) => {
  const previousYear = currentYear - 1
  if (item.period.fiscalYear == currentYear) r[index].current += item._Total_
  if (item.period.fiscalYear == previousYear) r[index].previous += item._Total_
  if (r[index].histSum[item.period.fiscalYear]) {
    if (!isNaN(Number(item._Total_))) r[index].histSum[item.period.fiscalYear] += Number(item._Total_)
  }
  else {
    r[index].histSum[item.period.fiscalYear] = Number(item._Total_)
  }
}

/**
* calculateOtherRevenues(data) - calculates other revenus from other revenues, inspections fees and civil penalties.
*
*  @param {object} data item
*
*  @example
*  calculateOtherRevenues(yearData);
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
  const fiscalYear = yearData.FiscalYear
  const sums = yearData.data.reduce((total, item) => {
    total[item.node.RevenueType] =
      (total[item.node.RevenueType] !== undefined)
        ? total[item.node.RevenueType] + item.node.Revenue
        : item.node.Revenue
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
