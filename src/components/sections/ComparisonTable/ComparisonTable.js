import React, { forwardRef, useContext, useState, useImperativeHandle, useEffect } from 'react'

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'

import utils, { monthLookup } from '../../../js/utils'
import PercentDifference from '../../utils/PercentDifference'
import Link from '../../../components/Link/'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const ComparisonTable = forwardRef((props, ref) => {
  const {
    data,
    yGroupBy
  } = props

  console.log('ComparisonTable props: ', props)

  const { state: filterState } = useContext(DataFilterContext)
  const { period, monthly, year } = filterState
  const [selectedItem, setSelectedItem] = useState({
    month: data[data.length - 1].month_long || '',
    year: data[data.length - 1].year || year
  })

  useEffect(() => {
    console.log('ComparisonTable selectedItem: ', selectedItem)
  }, [])

  useImperativeHandle(ref, () => ({
    setSelectedItem (d) {
      console.log('getSelected from Child', d)
      if (d.year) setSelectedItem({ ...selectedItem, year: d.year })

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
    ? `${ month } ${ previousYear } - ${ month } ${ currentYear }`
    : `${ previousYearText } - ${ periodAbbr }${ currentYear.toString().substring(2) }`

  // let currentYearText = `${ periodAbbr }${ currentYear.toString().substring(2) }`
  // if (currentMonth !== '09') {
  //   currentYearText = `${ currentYearText } ${ (period === DFC.PERIOD_FISCAL_YEAR) ? ' so far' : '' }`
  // }

  // Comparison data
  const groupedData = utils.groupBy(data, yGroupBy)

  console.log('groupedData: ', groupedData)

  const comparisonData = Object.entries(groupedData).map((item, index) => {
    const newObj = {}

    if (monthly === DFC.MONTHLY_CAPITALIZED) {
      const previousSum = item[1].filter(item => item.year === previousYear && item.month_long === selectedItem.month).reduce((prev, curr) => prev + curr.sum, 0)
      const currentSum = item[1].filter(item => item.year === currentYear && item.month_long === selectedItem.month).reduce((prev, curr) => prev + curr.sum, 0)
      newObj.previous = { ...item[1].filter(item => item.year === previousYear && item.month_long === selectedItem.month)[0], sum: previousSum }
      newObj.current = { ...item[1].filter(item => item.year === currentYear && item.month_long === selectedItem.month)[0], sum: currentSum }
    }
    else {
      const previousSum = item[1].filter(item => item.year === previousYear).reduce((prev, curr) => prev + curr.sum, 0)
      const currentSum = item[1].filter(item => item.year === currentYear).reduce((prev, curr) => prev + curr.sum, 0)
      newObj.previous = { ...item[1].filter(item => item.year === previousYear)[0], sum: previousSum }
      newObj.current = { ...item[1].filter(item => item.year === currentYear)[0], sum: currentSum }
    }

    return newObj
  })

  console.log('RevenueComparison data: ', comparisonData)

  return (
    <Box ref={ref} style={{ position: 'relative', top: -16 }}>
      <Box color="secondary.main" mb={2} borderBottom={2} pb={1}>
        <Box component="h3" m={0} color="primary.dark">
          {comparisonTitle}
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="Revenue Trends Table">
          <TableHead>
            <TableRow>
              <TableCell style={{ verticalAlign: 'bottom', width: '30%' }}>
                <Box fontWeight="bold" style={{ textTransform: 'capitalize' }}>{yGroupBy}</Box>
              </TableCell>
              <TableCell align="right" style={{ verticalAlign: 'bottom', width: '30%' }}>
                <Box fontWeight="bold">
                  {month ? `${ month } ${ previousYear }` : previousYearText }
                </Box>
                {(!month) && <Box fontSize="14px">{'(Oct - Sep)' }</Box>}
              </TableCell>
              <TableCell align="right" style={{ verticalAlign: 'bottom', width: '40%' }}>
                <Box fontWeight="bold">{changeText}</Box>
                <Box fontSize="14px">{changeAdditionalText}</Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { comparisonData.map((item, index) => (
              <TableRow>
                <TableCell style={{ verticalAlign: 'bottom' }}>
                  <Box fontSize="16px">{item.current ? item.current[yGroupBy] : ''}</Box>
                </TableCell>
                <TableCell component="th" scope="row" align="right" style={{ verticalAlign: 'bottom' }}>
                  <Box>
                    {item.previous ? utils.formatToDollarInt(item.previous.sum) : '--'}
                  </Box>
                </TableCell>
                <TableCell align="right" style={{ verticalAlign: 'bottom' }}>
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
      {/* <Box fontStyle="italic" fontSize="h6.fontSize" display="flex" justifyContent="space-between" mt={1}>
        <Link href='/downloads/revenue-by-month/'>Source file</Link>
        <Link href='/downloads/revenue-by-month/'>Source file</Link>
      </Box> */}
    </Box>

  )
})

export default ComparisonTable
