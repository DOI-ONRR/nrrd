import React, { useContext, useState, useEffect } from 'react'

import {
  REVENUE,
  PRODUCTION,
  DISBURSEMENT,
  DATA_TYPE,
  GROUP_BY,
  BREAKOUT_BY,
  ADDITIONAL_COLUMNS,
  FISCAL_YEAR,
  CALENDAR_YEAR,
  NO_BREAKOUT_BY,
  DISPLAY_NAMES,
  PERIOD,
  PERIOD_FISCAL_YEAR,
  QUERY_KEY_DATA_TABLE,
  DOWNLOAD_DATA_TABLE,
  PRODUCT,
  GROUP_BY_STICKY,
  QUERY_COUNTS
} from '../../../constants'
import { DataFilterContext } from '../../../stores/data-filter-store'
import { DownloadContext } from '../../../stores/download-store'
import { toTitleCase, aggregateSum, destructuringSwap } from '../../../js/utils'

import withQueryManager from '../../withQueryManager'

import CustomTable from './Custom/CustomTable'
import CustomTableHead from './Custom/CustomTableHead'
import CustomTableCell from './Custom/CustomTableCell'
import CustomTableSummaryRowTotalRow from './Custom/CustomTableSummaryRowTotalRow'
import CustomTableFixedCell from './Custom/CustomTableFixedCell'
import CustomTableSummaryRowItem from './Custom/CustomTableSummaryRowItem'
import CustomTableSummaryRowGroupRow from './Custom/CustomTableSummaryRowGroupRow'
import CustomTableHeaderCell from './Custom/CustomTableHeaderCell'
import TotalProvider from './Custom/TotalProvider'
import CustomGroupCellContent from './Custom/CustomGroupCellContent'

import {
  makeStyles,
  Box,
  Grid
} from '@material-ui/core'

import {
  GroupingState,
  IntegratedGrouping,
  SortingState,
  IntegratedSorting,
  SummaryState,
  IntegratedSummary,
  TableColumnVisibility
} from '@devexpress/dx-react-grid'

import {
  Grid as TableGrid,
  VirtualTable as Table,
  TableHeaderRow,
  TableFixedColumns,
  TableGroupRow,
  TableSummaryRow,
  TableColumnResizing,
  TableColumnReordering
} from '@devexpress/dx-react-grid-material-ui'

const allYears = ['2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003']

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    margin: 0,
  },
  MuiTableCell: {
    body: {
      color: 'red'
    }
  }
}))

const DataTable = ({ dataType, height = '200px' }) => {
  const classes = useStyles()
  const { state } = useContext(DataFilterContext)
  if (!state) {
    throw new Error('Data Filter Context has an undefined state. Please verify you have the Data Filter Provider included in your page or component.')
  }

  const showSummaryRow = (state[DATA_TYPE] === PRODUCTION && (state[PRODUCT] && state[PRODUCT].split(',').length === 1))

  return (
    <Box className={classes.root}>
      <Grid container spacing={2}>
        {state[DATA_TYPE] &&
          <React.Fragment>
            {state[DATA_TYPE] === REVENUE &&
              <Grid item xs={12}>
                <EnhancedDataTable showSummaryRow={true}/>
              </Grid>
            }
            {state[DATA_TYPE] === PRODUCTION &&
              <Grid item xs={12}>
                <EnhancedDataTable showOnlySubtotalRow={!showSummaryRow} showSummaryRow={showSummaryRow}/>
              </Grid>
            }
            {state[DATA_TYPE] === DISBURSEMENT &&
              <Grid item xs={12}>
                <EnhancedDataTable showSummaryRow={true}/>
              </Grid>
            }
          </React.Fragment>
        }
      </Grid>
    </Box>
  )
}

export default DataTable

const EnhancedDataTable = withQueryManager(({ data, showSummaryRow, showOnlySubtotalRow }) => {
  return (
    <React.Fragment>
      {(data && data.results.length > 0) &&
        <DataTableBase
          showOnlySubtotalRow={showOnlySubtotalRow}
          showSummaryRow={showSummaryRow}
          data ={data}
        />
      }
    </React.Fragment>
  )
}, QUERY_KEY_DATA_TABLE)

const DataTableBase = React.memo(({ data, showSummaryRow, showOnlySubtotalRow }) => {
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const { addDownloadData } = useContext(DownloadContext)
  let columnNames = getColumnNames(data.results[0], state)
  const [grouping, setGrouping] = useState([])
  const [expandedGroups, setExpandedGroups] = useState([])
  const [groupingExtension, setGroupingExtension] = useState([])
  const [hiddenColumnNames, setHiddenColumnNames] = useState([])
  const [fixedColumns, setFixedColumns] = useState([])
  const [totalSummaryItems, setTotalSummaryItems] = useState([])
  const [groupSummaryItems, setGroupSummaryItems] = useState([])
  const [aggregatedSums, setAggregatedSums] = useState()
  const [defaultColumnWidths] = useState(columnNames ? columnNames.map((column, index) =>
    (column.name.startsWith('y')) ? ({ columnName: column.name, width: 200 }) : ({ columnName: column.name, width: 250 })) : [])
  const [tableColumnExtensions] = useState(allYears.map(year => ({ columnName: `y${ year }`, align: 'right', wordWrapEnabled: true })))

  // Return true if we don't have a count for the column
  // Later we can implement a different approach if needed
  const columnIsNotNull = columnName => {
    if (state[QUERY_COUNTS]) {
      return (state[QUERY_COUNTS][columnName] > 0)
    }
    return true
  }

  const _groupBySticky = state[GROUP_BY_STICKY]
  const _breakoutBy = state[BREAKOUT_BY]
  const _additionalColumns = state[ADDITIONAL_COLUMNS]
  const getGroupBy = () => {
    const getNewGroupByColumn = () => {
      const groupByColumnName = columnNames.find(item =>
        (!item.name.startsWith('y') &&
        item.name !== _groupBySticky &&
        item.name !== _breakoutBy &&
        columnIsNotNull(item.name) &&
        (!_additionalColumns || !_additionalColumns.includes(item.name))))

      if (groupByColumnName) {
        return (groupByColumnName.name ? groupByColumnName.name : groupByColumnName)
      }
    }

    if (state[_groupBySticky] && state[_groupBySticky].split(',').length === 1) {
      if (state[GROUP_BY] && columnIsNotNull(state[GROUP_BY])) {
        return state[GROUP_BY]
      }
      else {
        return getNewGroupByColumn()
      }
    }
    else if (!_groupBySticky && !state[GROUP_BY]) {
      return getNewGroupByColumn()
    }
    return _groupBySticky || state[GROUP_BY]
  }
  const _groupBy = getGroupBy()
  console.log(_groupBy)
  const getUniqueGroupBy = () => {
    if (_groupBy && _breakoutBy !== _groupBy && _groupBy !== _groupBySticky && columnIsNotNull(_groupBy)) {
      return _groupBy
    }
    const groupByColumnName = columnNames.find(item =>
      (!item.name.startsWith('y') &&
        item.name !== _groupBySticky &&
        item.name !== _breakoutBy &&
        columnIsNotNull(item.name) &&
        (!_additionalColumns || !_additionalColumns.includes(item.name))))

    if (groupByColumnName) {
      return (groupByColumnName.name ? groupByColumnName.name : groupByColumnName)
    }
  }
  const getUniqueBreakoutBy = () => {
    if (_breakoutBy && _breakoutBy !== _groupBy && _breakoutBy !== _groupBySticky && columnIsNotNull(_breakoutBy)) {
      return _breakoutBy
    }
    const breakoutByColumnName = columnNames.find(item =>
      (!item.name.startsWith('y') &&
        item.name !== _groupBySticky &&
        item.name !== _groupBy &&
        columnIsNotNull(item.name) &&
        (!_additionalColumns || !_additionalColumns.includes(item.name))))

    if (breakoutByColumnName) {
      return (breakoutByColumnName.name ? breakoutByColumnName.name : breakoutByColumnName)
    }
  }

  // Logic to update group by and breakout by columns
  useEffect(() => {
    if (state[GROUP_BY_STICKY] !== _groupBy) {
      if (_groupBy && !columnIsNotNull(_groupBy)) {
        updateDataFilter({ [GROUP_BY]: getUniqueGroupBy() })
      }
      else if (_groupBy && _breakoutBy === _groupBy && state[GROUP_BY] === _groupBy) {
        updateDataFilter({ [GROUP_BY]: _groupBy, [BREAKOUT_BY]: getUniqueBreakoutBy() })
      }
      else if (state[GROUP_BY] !== _groupBy) {
        updateDataFilter({ [GROUP_BY]: _groupBy })
      }
      else if (_breakoutBy && state[BREAKOUT_BY] !== _breakoutBy && _breakoutBy === _groupBy) {
        updateDataFilter({ [GROUP_BY]: getUniqueGroupBy(), [BREAKOUT_BY]: _breakoutBy })
      }
      else if (_breakoutBy && !columnIsNotNull(_breakoutBy)) {
        updateDataFilter({ [BREAKOUT_BY]: getUniqueBreakoutBy() })
      }
    }
    else if (state[GROUP_BY_STICKY] === _groupBy && state[GROUP_BY]) {
      updateDataFilter({ [GROUP_BY]: undefined })
    }
  }, [_groupBy, _breakoutBy, state])

  const getColumnOrder = () => {
    let swapIndex
    if (_groupBy) {
      swapIndex = columnNames.findIndex(item => (item.name === _groupBy))
      if (swapIndex > -1) {
        destructuringSwap(columnNames, 0, swapIndex)
      }
      if (_breakoutBy) {
        swapIndex = columnNames.findIndex(item => (item.name === _breakoutBy))
        if (swapIndex > -1) {
          destructuringSwap(columnNames, 1, swapIndex)
        }
      }
    }
    // Place additional columns after the group abd breakout columns if they exist
    if (_additionalColumns) {
      let indexOffset = _groupBy ? 1 : 0
      indexOffset = _breakoutBy ? indexOffset + 1 : indexOffset
      _additionalColumns.forEach((columnName, index) => {
        swapIndex = columnNames.findIndex(item => (item.name === columnName))
        if (swapIndex > -1) {
          destructuringSwap(columnNames, indexOffset, swapIndex)
        }
      })
    }

    return columnNames.map(item => item.name)
  }
  const [columnOrder, setColumnOrder] = useState(getColumnOrder())

  const getHiddenColumns = () => {
    let yearColumns = []
    const periodYear = (state[PERIOD] === PERIOD_FISCAL_YEAR) ? FISCAL_YEAR : CALENDAR_YEAR
    if (state[periodYear]) {
      let years = state[periodYear].split(',')
      years = years.map(item => `y${ item }`)
      yearColumns = columnNames.filter(item => (item.name.startsWith('y') && !years.includes(item.name)))
    }
    else {
      // By default only show 3 years
      yearColumns = columnNames.filter(item => item.name.startsWith('y'))
      yearColumns = yearColumns.slice(6)
    }

    const nonYearColumns = columnNames.filter(item =>
      (!item.name.startsWith('y') &&
      item.name !== _groupBy &&
      item.name !== _breakoutBy &&
      (!_additionalColumns || !_additionalColumns.includes(item.name)))
    )

    if (_additionalColumns) {
      _additionalColumns.forEach(column => {
        if (state[column] && state[column].split(',').length === 1) {
          nonYearColumns.push(columnNames.filter(item => item.name === column)[0])
        }
      })
    }
    return yearColumns.concat(nonYearColumns).map(item => item.name)
  }

  const getTotalSummaryItems = () => {
    const years = columnNames // .filter(item => item.name.startsWith('y'))
    return years && years.map(item => ({ columnName: item.name, type: 'totalSum', alignByColumn: false }))
  }

  const getGroupSummaryItems = () => {
    const years = columnNames // .filter(item => item.name.startsWith('y'))
    return years && years.map(item => ({ columnName: item.name, type: 'sum', showInGroupFooter: true, alignByColumn: true }))
  }

  useEffect(() => {
    columnNames = getColumnNames(data.results[0], state)
    const hiddenCols = getHiddenColumns()
    if (_groupBy && (_breakoutBy !== NO_BREAKOUT_BY && _breakoutBy)) {
      setGrouping([{ columnName: _groupBy }])
      setGroupingExtension([{ columnName: _groupBy, showWhenGrouped: true }])
      if (data && data.results.length > 0) {
        // Gets the unique values that will be expanded
        setExpandedGroups([...new Set(data.results.map(item => item[_groupBy]))])
      }
      setFixedColumns([TableGroupRow.Row, _groupBy, _breakoutBy])
    }
    else if (_groupBy) {
      setGrouping([])
      setGroupingExtension([])
      setExpandedGroups([])
      setFixedColumns([_groupBy])
    }
    else {
      setGrouping([])
      setGroupingExtension([])
      setExpandedGroups([])
      setFixedColumns([columnNames[0]])
    }
    setColumnOrder(getColumnOrder())

    setHiddenColumnNames(hiddenCols)
    setGroupSummaryItems(getGroupSummaryItems())
    setTotalSummaryItems(getTotalSummaryItems())

    if (data && data.results.length > 0) {
      const yearProps = columnNames.filter(item => item.name.startsWith('y'))
      let groupByProps = []
      if (_groupBy) {
        groupByProps = groupByProps.concat(_groupBy)
      }
      if (_breakoutBy) {
        groupByProps = groupByProps.concat(_breakoutBy)
      }
      if (_additionalColumns) {
        groupByProps = groupByProps.concat(_additionalColumns)
      }
      const sums = aggregateSum({
        data: data.results,
        groupByProps: groupByProps,
        sumByProps: yearProps.map(item => item.name)
      })
      if (sums.length > 0) {
        setAggregatedSums(sums)
        if (sums && sums.length > 0) {
          addDownloadData({
            key: DOWNLOAD_DATA_TABLE,
            data: {
              cols: columnNames.filter(col => !hiddenCols.includes(col.name)),
              rows: sums
            }
          })
        }
      }
    }
  }, [state, data])

  const addBreakoutByColumnHandler = () => {
    updateDataFilter({ [BREAKOUT_BY]: getUniqueBreakoutBy() })
  }
  const removeBreakoutByColumnHandler = () => {
    updateDataFilter({ [BREAKOUT_BY]: undefined })
  }

  // Returns a list of options available for the group by and breakout columns
  const getGroupByOptions = () => {
    const options = columnNames.filter(item => (
      item.name !== _groupBySticky &&
      !item.name.startsWith('y') &&
      columnIsNotNull(item.name) &&
      (!_additionalColumns || !_additionalColumns.includes(item.name))
    ))
    return options.map(item => ({ option: item.title, value: item.name }))
  }
  // Returns a list of options available for the group by and breakout columns
  const getBreakoutByOptions = () => {
    const options = columnNames.filter(item => (
      item.name !== _groupBySticky &&
      item.name !== _groupBy &&
      columnIsNotNull(item.name) &&
      !item.name.startsWith('y') &&
      (!_additionalColumns || !_additionalColumns.includes(item.name))
    ))
    return options.map(item => ({ option: item.title, value: item.name }))
  }

  return (
    <React.Fragment>
      {(aggregatedSums && aggregatedSums.length > 0) &&
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableGrid
              rows={aggregatedSums}
              columns={columnNames}>
              <TotalProvider
                for={columnNames.filter(item => !item.name.startsWith('y')).map(item => item.name)}
              />
              <SortingState />
              <GroupingState
                grouping={grouping}
                expandedGroups={expandedGroups}
                onExpandedGroupsChange={setExpandedGroups}
              />
              <SummaryState
                totalItems={totalSummaryItems}
                groupItems={groupSummaryItems}
              />
              <IntegratedSorting />
              <IntegratedGrouping />
              <IntegratedSummary calculator={summaryCalculator} />
              <Table
                columnExtensions={tableColumnExtensions}
                cellComponent={CustomTableCell}
                tableComponent={CustomTable}
                headComponent={CustomTableHead}
                height={550}
              />
              <TableColumnReordering
                order={columnOrder}
              />
              <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
              <TableHeaderRow
                contentComponent={props =>
                  <CustomTableHeaderCell
                    groupByOptions={getGroupByOptions()}
                    breakoutByOptions={getBreakoutByOptions()}
                    onAddColumn={!_breakoutBy && addBreakoutByColumnHandler}
                    onRemoveColumn={_breakoutBy && removeBreakoutByColumnHandler}
                    {...props} />}
                showSortingControls/>
              <TableColumnVisibility
                hiddenColumnNames={hiddenColumnNames}
              />
              <TableGroupRow
                contentComponent={CustomGroupCellContent}
                columnExtensions={groupingExtension} />
              {showOnlySubtotalRow &&
                <TableSummaryRow
                  groupRowComponent={CustomTableSummaryRowGroupRow}
                  totalRowComponent={() => <></>}
                  itemComponent={CustomTableSummaryRowItem}
                />
              }
              {(showSummaryRow && !showOnlySubtotalRow) &&
                <TableSummaryRow
                  groupRowComponent={CustomTableSummaryRowGroupRow}
                  totalRowComponent={CustomTableSummaryRowTotalRow}
                  itemComponent={CustomTableSummaryRowItem}
                />
              }

            </TableGrid>
          </Grid>
        </Grid>
      }
    </React.Fragment>
  )
})

const getColumnNames = (row, state) => {
  if (!row) {
    return []
  }
  const filteredColumns = Object.keys(row).filter(column => !column.includes('typename'))
  return filteredColumns.map((column, index) => {
    if (parseInt(column.substring(1)) > 1000) {
      return { name: column, title: column.substring(1), year: parseInt(column.substring(1)) }
    }
    const titleName = toTitleCase(column).replace('_', ' ')
    return {
      name: column,
      title: (DISPLAY_NAMES[column]) ? DISPLAY_NAMES[column].default : titleName,
      plural: (DISPLAY_NAMES[column]) ? DISPLAY_NAMES[column].plural : titleName,
      groupByName: (DISPLAY_NAMES[state.groupBy]) ? DISPLAY_NAMES[state.groupBy].plural : state.groupBy,
    }
  })
}

const summaryCalculator = (type, rows, getValue) => {
  return IntegratedSummary.defaultCalculator('sum', rows, getValue)
}
