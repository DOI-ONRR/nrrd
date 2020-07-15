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
  PRODUCT
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
                <EnhancedDataTable showSummaryRow={showSummaryRow}/>
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

const EnhancedDataTable = withQueryManager(({ data, showSummaryRow }) => {
  return (
    <React.Fragment>
      {(data && data.results.length > 0) &&
        <DataTableBase showSummaryRow={showSummaryRow} data ={data} />
      }
    </React.Fragment>
  )
}, QUERY_KEY_DATA_TABLE)

const DataTableBase = ({ data, showSummaryRow }) => {
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

  const getColumnOrder = () => {
    if (state[GROUP_BY]) {
      destructuringSwap(columnNames, 0, columnNames.findIndex(item => (item.name === state[GROUP_BY])))
      if (state[BREAKOUT_BY]) {
        destructuringSwap(columnNames, 1, columnNames.findIndex(item => (item.name === state[BREAKOUT_BY])))
      }
    }
    // Place additional columns after the group abd breakout columns if they exist
    if (state[ADDITIONAL_COLUMNS]) {
      let indexOffset = state[GROUP_BY] ? 1 : 0
      indexOffset = state[BREAKOUT_BY] ? indexOffset + 1 : indexOffset
      state[ADDITIONAL_COLUMNS].forEach((columnName, index) => {
        destructuringSwap(columnNames, indexOffset, columnNames.findIndex(item => (item.name === columnName)))
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
      item.name !== state[GROUP_BY] &&
      item.name !== state[BREAKOUT_BY] &&
      (state[ADDITIONAL_COLUMNS] && !state[ADDITIONAL_COLUMNS].includes(item.name)))
    )
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
    if (state[GROUP_BY] && (state[BREAKOUT_BY] !== NO_BREAKOUT_BY && state[BREAKOUT_BY])) {
      setGrouping([{ columnName: state[GROUP_BY] }])
      setGroupingExtension([{ columnName: state[GROUP_BY], showWhenGrouped: true }])
      if (data && data.results.length > 0) {
        // Gets the unique values that will be expanded
        setExpandedGroups([...new Set(data.results.map(item => item[state[GROUP_BY]]))])
      }
      setFixedColumns([TableGroupRow.Row, state[GROUP_BY], state[BREAKOUT_BY]])
    }
    else if (state[GROUP_BY]) {
      setGrouping([])
      setGroupingExtension([])
      setExpandedGroups([])
      setFixedColumns([state[GROUP_BY]])
    }
    else {
      setGrouping([])
      setGroupingExtension([])
      setExpandedGroups([])
      setFixedColumns([columnNames[0]])
    }
    setColumnOrder(getColumnOrder())
    setHiddenColumnNames(getHiddenColumns())
    setGroupSummaryItems(getGroupSummaryItems())
    setTotalSummaryItems(getTotalSummaryItems())

    if (data && data.results.length > 0) {
      const yearProps = columnNames.filter(item => item.name.startsWith('y'))
      let groupByProps = []
      if (state[GROUP_BY]) {
        groupByProps = groupByProps.concat(state[GROUP_BY])
      }
      if (state[BREAKOUT_BY]) {
        groupByProps = groupByProps.concat(state[BREAKOUT_BY])
      }
      if (state[ADDITIONAL_COLUMNS]) {
        groupByProps = groupByProps.concat(state[ADDITIONAL_COLUMNS])
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
              cols: columnNames.filter(col => !hiddenColumnNames.includes(col.name)),
              rows: sums
            }
          })
        }
      }
    }
  }, [state, data])

  const addBreakoutByColumnHandler = () => {
    const breakoutByColumnName = state[BREAKOUT_BY] ||
      columnNames.find(item =>
        (!item.name.startsWith('y') &&
        item.name !== state[GROUP_BY] &&
        (state[ADDITIONAL_COLUMNS] && !state[ADDITIONAL_COLUMNS].includes(item.name))))

    if (breakoutByColumnName) {
      updateDataFilter({ [BREAKOUT_BY]: (breakoutByColumnName.name ? breakoutByColumnName.name : breakoutByColumnName) })
    }
  }
  const removeBreakoutByColumnHandler = () => {
    updateDataFilter({ [BREAKOUT_BY]: undefined })
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
                    options={columnNames.filter(item =>
                      (!item.name.startsWith('y') && (state[ADDITIONAL_COLUMNS] && !state[ADDITIONAL_COLUMNS].includes(item.name)))
                    ).map(item => ({ option: item.title, value: item.name }))}
                    onAddColumn={!state[BREAKOUT_BY] && addBreakoutByColumnHandler}
                    onRemoveColumn={state[BREAKOUT_BY] && removeBreakoutByColumnHandler}
                    {...props} />}
                showSortingControls/>
              <TableColumnVisibility
                hiddenColumnNames={hiddenColumnNames}
              />
              <TableGroupRow
                contentComponent={CustomGroupCellContent}
                columnExtensions={groupingExtension} />
              {showSummaryRow &&
                <TableSummaryRow
                  groupRowComponent={CustomTableSummaryRowGroupRow}
                  totalRowComponent={CustomTableSummaryRowTotalRow}
                  itemComponent={CustomTableSummaryRowItem}
                />
              }
              <TableFixedColumns leftColumns={fixedColumns} cellComponent={CustomTableFixedCell} />
            </TableGrid>
          </Grid>
        </Grid>
      }
    </React.Fragment>
  )
}

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
