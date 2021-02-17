import React, { forwardRef, useContext, useState, useImperativeHandle, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  Box,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme
} from '@material-ui/core'

import utils, { monthLookup } from '../../../js/utils'
import PercentDifference from '../../utils/PercentDifference'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const useStyles = makeStyles(theme => ({
  comparisonTable: {
    '& tr:last-child > td': {
      border: 'none'
    },
  },
  comparisonTableContent: {
    height: '196px',
    [theme.breakpoints.down('sm')]: {
      height: 'auto'
    }
  },
  tableCellRoot: {
    fontSize: '1.1rem',
    align: 'right',
    verticalAlign: 'bottom',
  },
  tableCellHead: {
    borderBottomColor: theme.palette.grey[300],
    borderBottomWidth: 1,
  }
}))

const ComparisonTable = forwardRef((props, ref) => {
  const {
    data,
    yGroupBy,
    yOrderBy,
    monthRange
  } = props

  const classes = useStyles()
  const theme = useTheme()
  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'))

  console.debug('ComparisonTable props: ', props)

  const { state: filterState } = useContext(DataFilterContext)
  const { period, monthly, year, dataType, commodity } = filterState
  const [selectedItem, setSelectedItem] = useState({
    month: data[data.length - 1].month_long ? data[data.length - 1].month_long : data[data.length - 1].monthLong,
    year: data[data.length - 1].year || year
  })

  const yearlyComparisonText = `Compares data for the selected ${ period.toLowerCase() } to the previous ${ period.toLowerCase() }.`
  const monthlyComparisonText = 'Compares data for the selected month to the same month in the previous year.'

  useEffect(() => {
    console.debug('ComparisonTable selectedItem: ', selectedItem)
  }, [selectedItem])

  useImperativeHandle(ref, () => ({
    setSelectedItem (d) {
      // console.log('getSelected from Child', d)
      // check for period_date yyyy-mm-dd
      if (d.length === 10) {
        const dStr = d.replace(/\b0/g, '')
        const date = new Date(dStr)
        const month = date.toLocaleString('default', { month: 'long' })
        const year = d.substring(0, 4)
        setSelectedItem({ ...selectedItem, year: year, month: month })
      }
      else {
        const currentSelectedYearData = data.filter(item => item.year === d)
        const currentSelectedYearDataMaxMonth = currentSelectedYearData[currentSelectedYearData.length - 1].monthLong
        const year = d
        setSelectedItem({ ...selectedItem, year: year, month: currentSelectedYearDataMaxMonth })
      }
    }
  }))

  const comparisonTitle = 'Comparison'
  const periodAbbr = period === DFC.PERIOD_CALENDAR_YEAR ? 'CY' : 'FY'

  // Get the latest date then subtract 1 year to filter previous year data to compare current year data
  const currentYear = parseInt(selectedItem.year)

  // Get previous year
  const previousYear = currentYear - 1

  // console.log('previousYear: ', previousYear)

  // Text output
  const month = (monthly === DFC.MONTHLY_CAPITALIZED && selectedItem.month) && selectedItem.month.substring(0, 3)
  const previousYearText = `${ periodAbbr } ${ previousYear }`
  const changeText = 'Change'

  // grouped data
  const groupedData = utils.groupBy(data, yGroupBy)

  // comparison data
  const comparisonData = Object.entries(groupedData).map((item, index) => {
    const newObj = {}
    newObj.key = item[0]

    if (monthly === DFC.MONTHLY_CAPITALIZED) {
      const previousSum = item[1].filter(item => parseInt(item.period_date.substring(0, 4)) === previousYear && item.month_long === selectedItem.month).reduce((prev, curr) => prev + curr.sum, 0)
      const currentSum = item[1].filter(item => parseInt(item.period_date.substring(0, 4)) === currentYear && item.month_long === selectedItem.month).reduce((prev, curr) => prev + curr.sum, 0)
      newObj.previous = { ...item[1].filter(item => parseInt(item.period_date.substring(0, 4)) === previousYear && item.month_long === selectedItem.month)[0], sum: previousSum }
      newObj.current = { ...item[1].filter(item => parseInt(item.period_date.substring(0, 4)) === currentYear && item.month_long === selectedItem.month)[0], sum: currentSum }
    }
    else {
      let previousSum = {}
      // check for comparison with current fiscal month range
      if (period === DFC.PERIOD_FISCAL_YEAR && selectedItem.month !== 'September') {
        if (dataType === DFC.REVENUE || (dataType === DFC.DISBURSEMENT && selectedItem.year > 2020)) {
          previousSum = item[1].filter(item => item.year === previousYear && monthRange.includes(item.monthLong)).reduce((prev, curr) => prev + curr.sum, 0)
        }
        else {
          previousSum = item[1].filter(item => item.year === previousYear && (item.monthLong === 'October' || item.monthLong === selectedItem.month)).reduce((prev, curr) => prev + curr.sum, 0)
        }
      }
      else if (period === DFC.PERIOD_CALENDAR_YEAR && selectedItem.month !== 'December') {
        previousSum = item[1].filter(item => item.year === previousYear && monthRange.includes(item.monthLong)).reduce((prev, curr) => prev + curr.sum, 0)
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

  comparisonData.sort((a, b) => yOrderBy.indexOf(a.previous[yGroupBy]) - yOrderBy.indexOf(b.previous[yGroupBy]))

  const cData = comparisonData.slice().sort((a, b) => yOrderBy.indexOf(a.key) - yOrderBy.indexOf(b.key))

  console.log('comparisonData: ', comparisonData)
  // console.log('cData: ', cData)

  // get previous/current year totals
  const previousYearTotals = comparisonData.map(item => item.previous.sum)
  const previousYearTotal = previousYearTotals.reduce((acc, item) => acc + item)
  const currentYearTotals = comparisonData.map(item => item.current.sum)
  const currentYearTotal = currentYearTotals.reduce((acc, item) => acc + item)

  // unit text, grab unit from string looking for parens
  const regExp = /\(([^)]+)\)/
  const unitText = commodity.match(regExp)[0]

  // Comparison Text
  let comparisonText

  if (period === DFC.PERIOD_FISCAL_YEAR) {
    if (selectedItem.month && selectedItem.month === 'October') {
      comparisonText = 'so far (Oct)'
    }
    else if (selectedItem.month && selectedItem.month !== 'October' && selectedItem.month !== 'September') {
      comparisonText = `so far (Oct - ${ selectedItem.month.substring(0, 3) })`
    }
    else {
      comparisonText = ''
    }
  }
  else {
    if (selectedItem.month && selectedItem.month === 'January') {
      comparisonText = 'so far (Jan)'
    }
    else if (selectedItem.month && selectedItem.month !== 'January' && selectedItem.month !== 'December') {
      comparisonText = `so far (Jan - ${ selectedItem.month.substring(0, 3) })`
    }
    else {
      comparisonText = ''
    }
  }

  const formatSum = sum => {
    if (dataType === DFC.PRODUCTION) {
      return utils.formatToCommaInt(sum)
    }
    else {
      return utils.formatToDollarInt(sum)
    }
  }

  return (
    <Box ref={ref}>
      <Box mb={2} borderBottom={2}>
        <Box component="h3" m={0} color="primary.dark" fontSize="1.2rem">
          {comparisonTitle}
        </Box>
      </Box>
      <Box className={classes.comparisonTableContent}>
        {monthly === DFC.MONTHLY_CAPITALIZED ? monthlyComparisonText : yearlyComparisonText }
      </Box>
      <TableContainer className={classes.comparisonTable}>
        <Table size="small" aria-label={`${ dataType } comparison table`}>
          <TableHead>
            <TableRow>
              {matchesSmDown &&
                <TableCell classes={{ root: classes.tableCellRoot, head: classes.tableCellHead }}>
                  <Box fontWeight="bold" style={{ textTransform: 'capitalize' }}>{yGroupBy}</Box>
                </TableCell>
              }
              <TableCell component="th" align="right" classes={{ root: classes.tableCellRoot, head: classes.tableCellHead }}>
                <Box fontWeight="bold">
                  {month ? `${ month } ${ previousYear } ${ (dataType === DFC.PRODUCTION) ? unitText : '' }` : `${ previousYearText } ${ comparisonText } ${ (dataType === DFC.PRODUCTION) ? unitText : '' }`}
                </Box>
              </TableCell>
              <TableCell component="th" align="right" classes={{ root: classes.tableCellRoot, head: classes.tableCellHead }}>
                <Box fontWeight="bold">{changeText}</Box>
                {/* <Box fontSize="14px">{changeAdditionalText}</Box> */}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { cData && cData.map((item, index) => (
              <TableRow key={`tr__${ index }`}>
                {matchesSmDown &&
                  <TableCell classes={{ root: classes.tableCellRoot }}>
                    <Box fontSize="16px">{item.key || ''}</Box>
                  </TableCell>
                }
                <TableCell align="right" classes={{ root: classes.tableCellRoot }}>
                  <Box>
                    {(item.previous && item.previous.sum !== 0) ? formatSum(item.previous.sum) : '-' }
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
              {matchesSmDown &&
                <TableCell classes={{ root: classes.tableCellRoot }}></TableCell>
              }
              <TableCell align="right" classes={{ root: classes.tableCellRoot }}>
                <Box fontWeight="bold">
                  {previousYearTotal !== 0 ? formatSum(previousYearTotal) : '-'}
                </Box>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.tableCellRoot }}>
                <Box fontWeight="bold">
                  {((currentYearTotal && previousYearTotal) && (currentYearTotal !== 0 && previousYearTotal !== 0))
                    ? <PercentDifference
                      currentAmount={currentYearTotal}
                      previousAmount={previousYearTotal}
                    />
                    : '-'
                  }
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

ComparisonTable.propTypes = {
  data: PropTypes.array.isRequired,
  yGroupBy: PropTypes.string,
  yOrderBy: PropTypes.array.isRequired
}
