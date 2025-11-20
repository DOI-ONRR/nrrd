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

import utils, { formatDate } from '../../../js/utils'
import PercentDifference from '../../utils/PercentDifference'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'
import ChartTitle from '../../data-viz/ChartTitle'
import GlossaryTerm from '../../GlossaryTerm/GlossaryTerm'
import Rect from '../../../components/data-viz/svg/Rect'
import * as d3 from 'd3'

const useStyles = makeStyles(theme => ({
  comparisonTable: {
    '& tr:last-child > td': {
      border: 'none'
    },
  },
  comparisonTableContent: {
    marginBottom: '1em'
  },
  tableCellRoot: {
    fontSize: '1rem',
    align: 'right',
    verticalAlign: 'bottom',
    lineHeight: 1.5,
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
  const matchesSmDown = true;//useMediaQuery(theme.breakpoints.down('sm'))

  // //console.debug('ComparisonTable props: ', props)

  const { state: filterState } = useContext(DataFilterContext)
  const { period, monthly, year, dataType, product } = filterState
  // //console.debug(' -=--------------------> data -=--->', data)
  const [selectedItem, setSelectedItem] = useState({
    month: data[data.length - 1].month_long,
    year: data[data.length - 1].year || year
  })

  // eslint-disable-next-line max-len
  const yearlyComparisonText = `Compares data for the selected ${ period.toLowerCase() } to the previous ${ period.toLowerCase() }. For the current ${ period.toLowerCase() }, we compare the months for which we have data with the same months in the previous ${ period.toLowerCase() }. To select a year, click or hover over a bar in the graph. Your selection changes the content displayed in the table.`
  const monthlyComparisonText = 'Compares data for the selected month to the same month in the previous year. To select a month, click or hover over a bar in the graph. Your selection changes the content displayed in the table.'

  useEffect(() => {
    // //console.debug('ComparisonTable selectedItem: ', selectedItem)
  }, [selectedItem])

  useImperativeHandle(ref, () => ({
    setSelectedItem (d) {
      // console.log('getSelected from Child', d)
      if (d.length === 10) {
        const dateArr = formatDate(d)
        const date = new Date(dateArr[0], dateArr[1], dateArr[2])
        const year = dateArr[0]
        const month = date.toLocaleDateString('en-US', { month: 'long' })

        setSelectedItem({ ...selectedItem, year, month })
      }
      else {
        const currentSelectedYearData = data.filter(item => item.year === d)
        const currentSelectedYearDataMaxMonth = currentSelectedYearData[currentSelectedYearData.length - 1].month_long ||
           currentSelectedYearData[currentSelectedYearData.length - 1].monthLong
        const year = d
        setSelectedItem({ ...selectedItem, year, month: currentSelectedYearDataMaxMonth })
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
  const currentYearText = `${ periodAbbr } ${ currentYear }`
  const changeText = 'Change'

  // grouped data
  const groupedData = utils.groupBy(data, yGroupBy)
  // //console.debug('data :', data)
  //   //console.debug('Comparison groupeData :', groupedData)
  // comparison data
  const comparisonData = Object.entries(groupedData).map((item, index) => {
    const newObj = {}
    newObj.key = item[0]

    if (monthly === DFC.MONTHLY_CAPITALIZED) {
      const previousSum = item[1].filter(itm =>
        parseInt(itm.period_date.substring(0, 4)) === previousYear && itm.month_long === selectedItem.month).reduce((prev, curr) => prev + curr.sum, 0)
      const currentSum = item[1].filter(itm =>
        parseInt(itm.period_date.substring(0, 4)) === currentYear && itm.month_long === selectedItem.month).reduce((prev, curr) => prev + curr.sum, 0)
      newObj.previous = {
        ...item[1].filter(itm =>
          parseInt(itm.period_date.substring(0, 4)) === previousYear && itm.month_long === selectedItem.month)[0],
        sum: previousSum
      }
      newObj.current = {
        ...item[1].filter(itm =>
          parseInt(itm.period_date.substring(0, 4)) === currentYear && itm.month_long === selectedItem.month)[0],
        sum: currentSum
      }
    }
    else {
      let previousSum = {}
      // //console.debug(" ------- previousYEAR ------ ", previousYear, "---- previousSUM ---", previousSum, " --- item ---",  item )
      // check for comparison with current fiscal month range
      // console.debug("comparison selected Item ",  selectedItem)
      if (period === DFC.PERIOD_FISCAL_YEAR && selectedItem.month !== 'September' && selectedItem.month !== undefined) {
        previousSum = item[1].filter(itm => itm.year === previousYear && monthRange.includes(itm.monthLong)).reduce((prev, curr) => prev + curr.sum, 0)
      }

      else if (period === DFC.PERIOD_CALENDAR_YEAR && selectedItem.month !== 'December') {
			  previousSum = item[1].filter(itm => itm.year === previousYear && monthRange.includes(itm.monthLong)).reduce((prev, curr) => prev + curr.sum, 0)
      }
      else {
        previousSum = item[1].filter(itm => itm.year === previousYear).reduce((prev, curr) => prev + curr.sum, 0)
      }
      const currentSum = item[1].filter(itm => itm.year === currentYear).reduce((prev, curr) => prev + curr.sum, 0)

      newObj.previous = { ...item[1].filter(itm => itm.year === previousYear)[0], sum: previousSum }
      newObj.current = { ...item[1].filter(itm => itm.year === currentYear)[0], sum: currentSum }
    }

    return newObj
  })

  comparisonData.sort((a, b) => yOrderBy.indexOf(a.previous[yGroupBy]) - yOrderBy.indexOf(b.previous[yGroupBy]))

  const cData = comparisonData.slice().sort((a, b) => yOrderBy.indexOf(a.key) - yOrderBy.indexOf(b.key))

  // get previous/current year totals
  const previousYearTotals = comparisonData.map(item => item.previous.sum)
  const previousYearTotal = previousYearTotals.reduce((acc, item) => acc + item)
  const currentYearTotals = comparisonData.map(item => item.current.sum)
  const currentYearTotal = currentYearTotals.reduce((acc, item) => acc + item)

  // unit text, grab unit from string looking for parens
  let unitText
  if (dataType === DFC.PRODUCTION) {
    const regExp = /\(([^)]+)\)/
    unitText = product.match(regExp)[0]
  }

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

  const primaryColor = '#37253c'
  const secondaryColor = '#c4d99b'

  // color Scale
  const color = (flipColorRange = false, scaleLinear = false) => {
    let color

    if (scaleLinear) {
      color = d3.scaleLinear()
        .domain([0, yOrderBy.length > 0 ? yOrderBy.length - 1 : 0 || 4])
        .range(flipColorRange ? [secondaryColor, primaryColor] : [primaryColor, secondaryColor])
    }
    else {
      const colorDomain = flipColorRange
        ? [yOrderBy.length > 0 ? yOrderBy.length - 1 : 0 || 4, 0]
        : [0, yOrderBy.length > 0 ? yOrderBy.length - 1 : 0 || 4]
      color = d3.scaleSequential(d3.interpolateViridis)
        .domain(colorDomain)
    }
    return color
  }

  const colorScale = color(true)

  return (
    <Box ref={ref}>
      {comparisonTitle && <ChartTitle compact={false}>{comparisonTitle}</ChartTitle>}
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
                  {month
                    ? `${ month } ${ currentYear } ${ (dataType === DFC.PRODUCTION) ? unitText : '' }`
                    : `${ currentYearText } ${ comparisonText } ${ (dataType === DFC.PRODUCTION) ? unitText : '' }`}
                </Box>
              </TableCell>
              <TableCell component="th" align="right" classes={{ root: classes.tableCellRoot, head: classes.tableCellHead }}>
                <Box fontWeight="bold">
                  {month
                    ? `${ month } ${ previousYear } ${ (dataType === DFC.PRODUCTION) ? unitText : '' }`
                    : `${ previousYearText } ${ comparisonText } ${ (dataType === DFC.PRODUCTION) ? unitText : '' }`}
                </Box>
              </TableCell>
              <TableCell component="th" align="right" classes={{ root: classes.tableCellRoot, head: classes.tableCellHead }}>
                <Box fontWeight="bold">{changeText}</Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { cData && cData.map((item, index) => (
              <TableRow key={`tr__${ index }`}>
                <TableCell classes={{ root: classes.tableCellRoot }}>
                  <Rect
                    width={20}
                    height={20}
                    title={item.key}
                    styles={{ fill: colorScale(index), marginTop: 0, marginRight: '1rem' }}
                  />
                  <GlossaryTerm
                    termKey={item.key}
                    isInTable={true}
                    style={{ whiteSpace: 'inherit' }}>
                    { item.key }
                  </GlossaryTerm>
                </TableCell>
                <TableCell align="right" classes={{ root: classes.tableCellRoot }}>
                  <Box>
                    {(item.current && item.current.sum !== 0) ? formatSum(item.current.sum) : '-' }
                  </Box>
                </TableCell>
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
                  {currentYearTotal !== 0 ? formatSum(currentYearTotal) : '-'}
                </Box>
              </TableCell>
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

ComparisonTable.displayName = 'ComparisonTable'

export default ComparisonTable

ComparisonTable.propTypes = {
  data: PropTypes.array.isRequired,
  yGroupBy: PropTypes.string,
  yOrderBy: PropTypes.array.isRequired
}
