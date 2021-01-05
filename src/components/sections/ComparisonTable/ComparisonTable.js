import React, { forwardRef, useContext, useState, useImperativeHandle, useEffect } from 'react'

import {
  Box,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'

import utils, { monthLookup } from '../../../js/utils'
import PercentDifference from '../../utils/PercentDifference'
// import Link from '../../../components/Link/'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const useStyles = makeStyles(theme => ({
  comparisonTable: {
    '& tr:last-child > td': {
      border: 'none'
    }
  },
  tableCellRoot: {
    fontSize: '1.1rem',
    align: 'right',
    verticalAlign: 'bottom'
  },
  tableCellHead: {
    borderBottomColor: theme.palette.grey[300],
    borderBottomWidth: 1,
  }
}))

const ComparisonTable = forwardRef((props, ref) => {
  const {
    data,
    yGroupBy
  } = props

  const classes = useStyles()

  console.log('ComparisonTable props: ', props)

  const { state: filterState } = useContext(DataFilterContext)
  const { period, monthly, year, dataType } = filterState
  const [selectedItem, setSelectedItem] = useState({
    month: data[data.length - 1].month_long ? data[data.length - 1].month_long : data[data.length - 1].monthLong,
    year: data[data.length - 1].year || year
  })

  const yearlyComparisonText = `Compares data for the selected ${ period.toLowerCase() } to the previous ${ period.toLowerCase() }.`
  const monthlyComparisonText = 'Compares data for the selected month to the same month in the previous year.'

  useEffect(() => {
    console.log('ComparisonTable selectedItem: ', selectedItem)
  }, [selectedItem])

  useImperativeHandle(ref, () => ({
    setSelectedItem (d) {
      console.log('getSelected from Child', d)
      if (d.year) {
        const currentSelectedYearData = data.filter(item => item.year === d.year)
        // console.log('currentSelectedYearData: ', currentSelectedYearData)
        const currentSelectedYearDataMaxMonth = currentSelectedYearData[currentSelectedYearData.length - 1].monthLong
        setSelectedItem({ ...selectedItem, year: d.year, month: currentSelectedYearDataMaxMonth })
      }

      if (d.month_long) {
        const monthNum = parseInt(monthLookup(d.month_long), 10)
        const indexToFind = (period === 'Most recent 12 months') ? monthNum : d.currentIndex + 1
        // get year key from xGroups
        if (d.xGroups) {
          Object.entries(d.xGroups).map((item, index) => {
            if (item[1].includes(indexToFind)) {
              // console.log('current selected year and month: ', d.month_long, item[0])
              setSelectedItem({ ...selectedItem, year: item[0], month: d.month_long })
            }
          })
        }
      }
    }
  }))

  const comparisonTitle = monthly === 'Monthly' ? 'Month over month comparison' : 'Year over year comparison'
  const periodAbbr = period === DFC.PERIOD_CALENDAR_YEAR ? 'CY' : 'FY'

  // Get the latest date then subtract 1 year to filter previous year data to compare current year data
  const d = new Date()
  const currentMonth = monthLookup(d.getMonth())
  const currentYear = parseInt(selectedItem.year)
  // const currentYearDate = new Date(`${ currentYear }-${ currentMonth }-01`)

  // Get previous year
  const previousYear = currentYear - 1

  // Text output
  const month = (monthly === DFC.MONTHLY_CAPITALIZED && selectedItem.month) && selectedItem.month.substring(0, 3)
  const previousYearText = `${ periodAbbr }${ previousYear.toString().substring(2) }`
  const changeText = 'Change'
  const changeAdditionalText = month
    ? `${ month } ${ previousYear } to ${ month } ${ currentYear }`
    : `${ previousYearText } to ${ periodAbbr }${ currentYear.toString().substring(2) }`

  // let currentYearText = `${ periodAbbr }${ currentYear.toString().substring(2) }`
  // if (currentMonth !== '09') {
  //   currentYearText = `${ currentYearText } ${ (period === DFC.PERIOD_FISCAL_YEAR) ? ' so far' : '' }`
  // }

  // Comparison data
  const groupedData = utils.groupBy(data, yGroupBy)

  // console.log('groupedData: ', groupedData)

  const comparisonData = Object.entries(groupedData).map((item, index) => {
    const newObj = {}

    if (monthly === DFC.MONTHLY_CAPITALIZED) {
      const previousSum = item[1].filter(item => item.year === previousYear && item.month_long === selectedItem.month).reduce((prev, curr) => prev + curr.sum, 0)
      const currentSum = item[1].filter(item => item.year === currentYear && item.month_long === selectedItem.month).reduce((prev, curr) => prev + curr.sum, 0)
      newObj.previous = { ...item[1].filter(item => item.year === previousYear && item.month_long === selectedItem.month)[0], sum: previousSum }
      newObj.current = { ...item[1].filter(item => item.year === currentYear && item.month_long === selectedItem.month)[0], sum: currentSum }
    }
    else {
      let previousSum = {}
      // check for comparison with current fiscal month range
      if (selectedItem.month !== 'September') {
        previousSum = item[1].filter(item => item.year === previousYear && (item.monthLong === 'October' || item.monthLong === selectedItem.month)).reduce((prev, curr) => prev + curr.sum, 0)
      }
      else {
        previousSum = item[1].filter(item => item.year === previousYear).reduce((prev, curr) => prev + curr.sum, 0)
      }
      const currentSum = item[1].filter(item => item.year === currentYear).reduce((prev, curr) => prev + curr.sum, 0)
      newObj.previous = { ...item[1].filter(item => item.year === previousYear)[0], sum: previousSum }
      newObj.current = { ...item[1].filter(item => item.year === currentYear)[0], sum: currentSum }
    }

    return newObj
  })

  // get previous/current year totals
  const previousYearTotals = comparisonData.map(item => item.previous.sum)
  const previousYearTotal = previousYearTotals.reduce((acc, item) => acc + item)
  const currentYearTotals = comparisonData.map(item => item.current.sum)
  const currentYearTotal = currentYearTotals.reduce((acc, item) => acc + item)

  // Comparison Text
  let comparisonText

  if (selectedItem.month && selectedItem.month === 'October') {
    comparisonText = '(Oct)'
  }
  else if (selectedItem.month && selectedItem.month !== 'October' && selectedItem.month !== 'September') {
    comparisonText = `(Oct - ${ selectedItem.month.substring(0, 3) })`
  }
  else {
    comparisonText = ''
  }

  return (
    <Box ref={ref}>
      <Box mb={2} borderBottom={1}>
        <Box component="h3" m={0} color="primary.dark">
          {comparisonTitle}
        </Box>
      </Box>
      <Box height="166px">
        {monthly === DFC.MONTHLY_CAPITALIZED ? monthlyComparisonText : yearlyComparisonText }
      </Box>
      <TableContainer className={classes.comparisonTable}>
        <Table size="small" aria-label={`${ dataType } comparison tabel`}>
          <TableHead>
            <TableRow>
              {/* <TableCell classes={{ root: classes.tableCellRoot }}>
                <Box fontWeight="bold" style={{ textTransform: 'capitalize' }}>{yGroupBy}</Box>
              </TableCell> */}
              <TableCell component="th" classes={{ root: classes.tableCellRoot, head: classes.tableCellHead }}>
                <Box fontWeight="bold">
                  {month ? `${ month } ${ previousYear }` : previousYearText }
                </Box>
                {(!month) && <Box fontSize="14px">{comparisonText}</Box>}
              </TableCell>
              <TableCell component="th" align="right" classes={{ root: classes.tableCellRoot, head: classes.tableCellHead }}>
                <Box fontWeight="bold">{changeText}</Box>
                <Box fontSize="14px">{changeAdditionalText}</Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { comparisonData.map((item, index) => (
              <TableRow>
                {/* <TableCell classes={{ root: classes.tableCellRoot }}>
                  <Box fontSize="16px">{item.current ? item.current[yGroupBy] : ''}</Box>
                </TableCell> */}
                <TableCell classes={{ root: classes.tableCellRoot }}>
                  <Box>
                    {(item.previous && item.previous.sum !== 0) ? utils.formatToDollarInt(item.previous.sum) : '-'}
                  </Box>
                </TableCell>
                <TableCell align="right" classes={{ root: classes.tableCellRoot }}>
                  <Box>
                    {((item.previous && item.current) && (item.previous.sum !== 0 && item.current.sum !== 0))
                      ? <PercentDifference
                        currentAmount={item.current.sum}
                        previousAmount={item.previous.sum}
                      />
                      : '-'
                    }
                  </Box>
                </TableCell>
              </TableRow>
            ))
            }
            <TableRow>
              <TableCell>
                <Box fontWeight="bold">
                  {utils.formatToDollarInt(previousYearTotal)}
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box fontWeight="bold">
                  <PercentDifference
                    currentAmount={currentYearTotal}
                    previousAmount={previousYearTotal}
                  />
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
		      </Table>
		    </TableContainer>
    </Box>

  )
})

export default ComparisonTable
