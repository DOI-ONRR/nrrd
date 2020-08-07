import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import * as d3 from 'd3'
import utils from '../../../js/utils'
import PercentDifference from '../../utils/PercentDifference'

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
import Link from '../../../components/Link'

const TREND_LIMIT = 10
const MAX_MONTH = 10

/**
* DisbursmentTrends - react functional component that generates revenue trends graph
*
* uses hook useStaticQuery and graphl to get revenu data then
* summarizes data for graphical representation
*/

const APOLLO_QUERY = gql`
  query DisbursementTrendsQuery {
      disbursement_trends(order_by: {fiscal_year: desc, current_month: desc}) {
        fiscalYear:fiscal_year
        disbursement:total
        disbursement_ytd:total_ytd
        disbursementType:trend_type
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
  inlineSourceLinks: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
  }
}))

const DisbursementTrends = props => {
  const classes = useStyles()
  const { state: filterState } = useContext(DataFilterContext)
  let year

  const { loading, error, data } = useQuery(APOLLO_QUERY)

  if (loading) return null
  if (error) return `Error! ${ error }`
  if (
    data &&
    data.disbursement_trends.length > 0
  ) {
    // Group data by year
    const groupedData = utils.groupBy(data.disbursement_trends, 'fiscalYear')

    const fiscalYearData = Object.entries(groupedData).map(item => {
      const newObj = {}
      newObj.fiscalYear = item[0]
      newObj.data = item[1]

      return newObj
    })

    // Get the latest date then subtract 1 year to filter previous year data to compare current year data
    const currentMonth = monthLookup(fiscalYearData[0].data[0].month)
    const currentYear = fiscalYearData[fiscalYearData.length - 1].fiscalYear
    const currentYearDate = new Date(`${ currentYear }-${ currentMonth }-01`)

    console.debug("currentYearDate", currentYearDate);
        console.debug("fiscalYearData", fiscalYearData);
    // Get previous year
    const previousYear = currentYear - 1

    // Trends
    const trends = aggregateData(data.disbursement_trends)

    // maxMonth Min/Max Year
    const maxMonth = currentYearDate.toLocaleString('en-us', { timeZone: 'UTC', month: 'long' })
    const minYear = trends[0].histData[0][0].substring(2)
    const maxYear = trends[0].histData[trends[0].histData.length - 1][0].substring(2)

    // Text output
    const currentFiscalYearText = `FY${ currentYear.toString().substring(2) } so far`
    const longCurrentYearText = `${ maxMonth } ${ currentYear }`
    const previousFiscalYearText = `from FY${ previousYear.toString().substring(2) }`
    const currentTrendText = `FY${ minYear } - FY${ maxYear }`

    year = filterState[DFC.year] || trends[0].histData[trends[0].histData.length - 1][0]

    return (
      <Box component="section" className={classes.root}>
        <Box color="secondary.main" mb={2} borderBottom={2} pb={1}>
          <Box component="h3" m={0} color="primary.dark">{props.title}</Box>
        </Box>
        <Box component="p" color="text.primary">
         Includes disbursements through {longCurrentYearText}
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
          <Link href='/downloads/disbursements/'>Source file</Link>
          <Link href='/downloads/disbursements-by-month/'>Source file</Link>
        </Box>
      </Box>
    )
  }

  else {
    return (
      console.error('no data yo!')
    )
  }
}

/*
    return (
      <Box component="section" className={classes.root}>
        <Box color="secondary.main" mb={2} borderBottom={2} pb={1}>
          <Box component="h3" m={0} color="primary.dark">Disbursement trends</Box>
        </Box>
        <Box component="p" color="text.primary">
        Includes disbursements through {longCurrentYearText}
        </Box>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} size="small" aria-label="Disbursement Trends Table">
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
*/

export default DisbursementTrends

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
/*
const getCurrentYear = data => {
  const r = data.reduce((max, p) => p.period.fiscalYear > max ? p.period.fiscalYear : max, data[0].period.fiscalYear)

  return r
}

const getPreviousYear = data => {
  // why not?
  const r = data[0].period.fiscalYear - 1
  return r
  // currently in production gatsby is reading the monthly_disbursements.xlsx file which only contians 2 years

  // the following reduce method doesnt work for arrays with more the two year values
  // const r = data.reduce((min, p) => p.period.fiscalYear < min ? p.period.fiscalYear : min, data[0].period.fiscalYear)
  // return r
}

const getMaxMonth = data => {
  const r = data.reduce((max, p) => p.month === max ? p.date : max, MAX_MONTH)
  return r
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

  const maxFiscalMonth = data.filter((item, i) => (item.period.fiscalYear == 2019)).reduce((max, p) => p.fiscalMonth > max ? p.fiscalMonth : max, 0)

  for (let ii = 0; ii < data.length; ii++) {
    const item = data[ii]
    const fiscalMonth = item.fiscalMonth ? item.fiscalMonth : item.period.month
    if (fiscalMonth <= maxFiscalMonth) {
	    if (item.disbursementType == 'U.S. Treasury') {
        sumMonthlyData(item, r, 0, currentYear) // sum into us treasury
	    }
      else if (item.disbursementType.match(/State/)) {
        sumMonthlyData(item, r, 1, currentYear) // sum into state
	    }
      else if (item.disbursementType.match(/Reclamation/)) {
        sumMonthlyData(item, r, 2, currentYear) // sum into Reclamation
	    }
      else if (item.disbursementType.match(/Native American/) ) {
        sumMonthlyData(item, r, 3, currentYear) // sum into Native
	    }
      else if (item.disbursementType.match(/Native American/) ) {
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
  if (item.period.fiscalYear == currentYear) {
    r[index].current += item.disbursement
  }
  if (item.period.fiscalYear == previousYear) {
    r[index].previous += item.disbursement
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
*/
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

const aggregateData = data => {
  const r = [
    { fund: 'U.S. Treasury', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'States & counties', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Reclamation Fund', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Native Americans', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Other funds', current: 0, previous: 0, histSum: {}, histData: [] },
    { fund: 'Total', current: 0, previous: 0, histSum: {}, histData: [], className: 'strong' }
  ]
  const currentYear = data[0].fiscalYear
  const currentMonth = data[0].month
  for (let ii = 0; ii < data.length; ii++) {
    const item = data[ii]
    if (item.disbursementType.match(/U.S. Treasury/)) {
	    sumData(item, r, 0, currentYear) // sum into us treasury
    }
    else if (item.disbursementType.match(/State/)) {
	    sumData(item, r, 1, currentYear) // sum into state
    }
    else if (item.disbursementType.match(/Reclamation/)) {
	    sumData(item, r, 2, currentYear) // sum into Reclamation
    }
    else if (item.disbursementType.match(/Native American/)) {
	    sumData(item, r, 3, currentYear) // sum into Native
    }
    else if (item.disbursementType.match(/Other Funds/)) {
	    sumData(item, r, 4, currentYear) // sum into other
    }
    else if (item.disbursementType.match(/Total/)) {
      sumData(item, r, 5, currentYear) // sum into Total
    }
  }
  /*  r.map((row, i) => {
    let a = []
    const years = Object.keys(row.histSum).sort()
    a = years.map((year, i) => ([year, row.histSum[year]]))
    r[i].histData = a.slice(-10)
    return a.slice(-10)
  })

*/
  console.debug('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR', r)
  r.map((row, i) => {
    let a = []
    const years = Object.keys(row.histSum).sort()
    console.debug('-----', row)
    a = years.map((year, i) => ([year, row.histSum[year]]))
    console.debug(currentMonth, 'YEARS ------->', years, 'AAAAAAAAAAAAAAAAAAAAAAAAA a', a)
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
  console.debug('IIIIIIIIIIIIIIIIIIIIIIIIIIIIItem', item)
  const previousYear = currentYear - 1
  if (item.fiscalYear === currentYear) r[index].current += item.disbursement_ytd
  if (item.fiscalYear === previousYear) r[index].previous += item.disbursement_ytd
  if (r[index].histSum[item.fiscalYear]) {
    if (!isNaN(Number(item.disbursement))) r[index].histSum[item.fiscalYear] += Number(item.disbursement)
  }
  else {
    r[index].histSum[item.fiscalYear] = Number(item.disbursement)
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
