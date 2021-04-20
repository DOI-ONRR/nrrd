import React, { useContext, useState, useEffect } from 'react'

import {
  ALL_YEARS,
  REVENUE,
  PRODUCTION,
  REVENUE_BY_COMPANY,
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
  QK_QUERY_TOOL,
  DOWNLOAD_DATA_TABLE,
  PRODUCT,
  GROUP_BY_STICKY,
  RECIPIENT,
  COMPANY_NAME,
  PERIOD_MONTHLY,
  MONTH_LONG,
  STATE_OFFSHORE_NAME
} from '../../../constants'
import { DataFilterContext } from '../../../stores/data-filter-store'
import { DownloadContext } from '../../../stores/download-store'
import { toTitleCase, aggregateSum, destructuringSwap } from '../../../js/utils'

import withQueryManager from '../../withQueryManager'
import { QueryToolTableProvider, QueryToolTableContext } from '../../../stores'

import Skeleton from '@material-ui/lab/Skeleton'
import Backdrop from '@material-ui/core/Backdrop'
import LinearProgress from '@material-ui/core/LinearProgress'
import CustomTable from './Custom/CustomTable'
import CustomTableHead from './Custom/CustomTableHead'
import CustomTableCell from './Custom/CustomTableCell'
import CustomTableSummaryRowTotalRow from './Custom/CustomTableSummaryRowTotalRow'
import CustomTableSummaryRowItem from './Custom/CustomTableSummaryRowItem'
import CustomTableSummaryRowGroupRow from './Custom/CustomTableSummaryRowGroupRow'
import CustomTableHeaderCell from './Custom/CustomTableHeaderCell'
import CustomTableHeaderSortLabel from './Custom/CustomTableHeaderSortLabel'
import TotalProvider from './Custom/TotalProvider'
import CustomGroupCellContent from './Custom/CustomGroupCellContent'

import {
  withStyles,
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
  TableGroupRow,
  TableSummaryRow,
  TableColumnResizing,
  TableColumnReordering
} from '@devexpress/dx-react-grid-material-ui'

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

const QueryToolTable = withQueryManager(({ data, loading }) => {
  const classes = useStyles()
  const _tableHeight = 550
  const { state: dfc } = useContext(DataFilterContext)
  const [dataTableConfig, setDataTableConfig] = useState()
  const [tableData, setTableData] = useState()

  const getPivotColumn = () => {
    if (dfc[PERIOD] === PERIOD_FISCAL_YEAR) {
      return FISCAL_YEAR
    }
    return CALENDAR_YEAR
  }

  const years = Array.from(new Set(data?.results?.map(item => item[getPivotColumn()])))
  years.sort()

  const getPivotColumnValue = () => {
    if (dfc[DATA_TYPE] === REVENUE_BY_COMPANY) {
      return REVENUE
    }
    return dfc[DATA_TYPE]
  }
  // This will remove columns that have no data and the graphql __typename
  const transformDataToTableData = (data, counts) => {
    const omit = (keys, array) =>
      array.map(obj => Object.fromEntries(
        Object.entries(obj)
          .filter(([k]) => !keys.includes(k))
      ))
    const columnsToOmit = ['__typename'].concat(
      Object.keys(counts?.aggregate).filter(colName => counts.aggregate[colName] < 1),
      ((dfc[PERIOD] === PERIOD_FISCAL_YEAR) ? CALENDAR_YEAR : FISCAL_YEAR))

    return omit(columnsToOmit, data).map(obj => {
      if (dfc[PERIOD] !== PERIOD_MONTHLY) {
        obj.Trend = 'placeholder'
      }
      return obj
    })
  }

  const getSortColumn = () => (dfc[PERIOD] === PERIOD_MONTHLY)
    ? [{ columnName: MONTH_LONG, direction: 'asc' }]
    : [{ columnName: years[years.length - 1]?.toString(), direction: 'desc' }]

  const getHideColumns = () => years.filter(year =>
    (dfc[PERIOD] === PERIOD_FISCAL_YEAR)
      ? !dfc[FISCAL_YEAR]?.includes(year.toString())
      : !dfc[CALENDAR_YEAR]?.includes(year.toString())).map(year => year.toString())

  const getAdditionalColumns = () => (dfc[PERIOD] === PERIOD_MONTHLY)
    ? [MONTH_LONG]
    : ['Trend']

  useEffect(() => {
    if (data) {
      setTableData(transformDataToTableData(data.results, data.counts))
      setDataTableConfig({
        showSummaryRow: (dfc[DATA_TYPE] !== PRODUCTION || (dfc[PRODUCT] && dfc[PRODUCT].split(',').length === 1)),
        showOnlySubtotalRow: (dfc[DATA_TYPE] === PRODUCTION && (dfc[PRODUCT] && dfc[PRODUCT].split(',').length === 1)),
        pivotColumn: getPivotColumn(),
        pivotColumnValue: getPivotColumnValue(),
        omitGroupBreakoutByOptions: [MONTH_LONG],
        height: _tableHeight,
        hideColumns: getHideColumns(),
        sortColumn: getSortColumn(),
        tableHeight: _tableHeight,
        [ADDITIONAL_COLUMNS]: getAdditionalColumns(),
        includeAdditionalColumsInGroupBy: (dfc[PERIOD] === PERIOD_MONTHLY),
        ...dfc
      })
    }
    else {
      setTableData()
    }
  }, [dfc, data])

  useEffect(() => {
    if (loading && data) {
      setTableData()
    }
  }, [loading])

  if (!dfc) {
    throw new Error('Data Filter Context has an undefined state. Please verify you have the Data Filter Provider included in your page or component.')
  }

  const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 10,
      width: '-webkit-fill-available'
    },
    bar: {
      backgroundColor: theme.palette.blue[200],
    },
  }))(LinearProgress);

  return (
    <Box className={classes.root}>
      <Box zIndex="tooltip" position="absolute">
        <Backdrop open={loading} />
      </Box>
      
      <Grid container spacing={2}>
        {loading &&
          <Grid item xs={12}>
            <Box zIndex="snackbar" style={{width: '-webkit-fill-available'}}>
              <BorderLinearProgress />
            </Box>
            <Box zIndex="modal">
              <Skeleton variant="rect" width={'100%'} height={_tableHeight} animation={false}/>
            </Box>
          </Grid>
        }
        {(tableData && dataTableConfig) &&
          <Grid item xs={12}>
            <QueryToolTableProvider>
              <DataTableBase data={tableData} config={dataTableConfig} />
            </QueryToolTableProvider>
          </Grid>
        }
      </Grid>
    </Box>
  )
}, QK_QUERY_TOOL)

export default QueryToolTable

const DataTableBase = ({ data, config }) => {
  // Outside component change updates
  const { updateDataFilter } = useContext(DataFilterContext)
  const { addDownloadData } = useContext(DownloadContext)

  // Helper functions
  const summaryCalculator = (type, rows, getValue) => {
    return IntegratedSummary.defaultCalculator('sum', rows, getValue)
  }

  const monthlySort = (a, b) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return months.indexOf(a) - months.indexOf(b)
  }

  const getGroupBy = () => {
    const getNewGroupByColumn = () => {
      const groupByColumnName = columnNames.find(item =>
        (!item.name.startsWith('y') &&
        item.name !== _groupBySticky &&
        item.name !== _breakoutBy &&
        (!_additionalColumns || !_additionalColumns.includes(item.name))))

      if (groupByColumnName) {
        return (groupByColumnName.name ? groupByColumnName.name : groupByColumnName)
      }
    }

    if (!_groupBySticky) {
      if (config[GROUP_BY]) {
        return config[GROUP_BY]
      }
      else {
        return getNewGroupByColumn()
      }
    }

    return _groupBySticky || config[GROUP_BY]
  }
  const getUniqueGroupBy = () => {
    if (_groupBy && _breakoutBy !== _groupBy && _groupBy !== _groupBySticky) {
      return _groupBy
    }
    const groupByColumnName = columnNames.find(item =>
      (!item.name.startsWith('y') &&
        item.name !== _groupBySticky &&
        item.name !== _breakoutBy &&
        (!_additionalColumns || !_additionalColumns.includes(item.name)) &&
        (!pivotColumnNames || !pivotColumnNames.includes(item.name))
      ))

    if (groupByColumnName) {
      return (groupByColumnName.name ? groupByColumnName.name : groupByColumnName)
    }
  }
  const getUniqueBreakoutBy = () => {
    if (_breakoutBy && _breakoutBy !== _groupBy && _breakoutBy !== _groupBySticky) {
      return _breakoutBy
    }

    return getBreakoutByOptions()[0]?.value
  }

  // These types are used in the custom code to get the proper formatting
  const getTotalSummaryItems = () => columnNames?.map(col =>
    (pivotColumnNames?.includes(col.name))
      ? ({ columnName: col.name, type: 'totalSum', alignByColumn: false })
      : ({ columnName: col.name, type: 'totalSumLabel', alignByColumn: false }))

  // These types are used in the custom code to get the proper formatting
  const getGroupSummaryItems = () => columnNames?.map(col =>
    (pivotColumnNames?.includes(col.name))
      ? ({ columnName: col.name, type: 'sum', alignByColumn: false })
      : ({ columnName: col.name, type: 'sumLabel', alignByColumn: false }))

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
    // Place additional columns after the group and breakout columns if they exist
    if (_additionalColumns) {
      let indexOffset = _groupBy ? 1 : 0
      indexOffset = _breakoutBy ? indexOffset + 1 : indexOffset
      _additionalColumns.forEach((columnName, index) => {
        swapIndex = columnNames.findIndex(item => (item.name === columnName))
        if (swapIndex > -1) {
          destructuringSwap(columnNames, indexOffset, swapIndex)
          indexOffset++
        }
      })
    }
    // Place pivot columns after everything
    if (pivotColumnNames) {
      const indexOffset = columnNames.filter(col => !pivotColumnNames.includes(col.name)).length
      pivotColumnNames.forEach((columnName, index) => {
        swapIndex = columnNames.findIndex(item => (item.name === columnName))
        if (swapIndex > -1) {
          destructuringSwap(columnNames, indexOffset + index, swapIndex)
        }
      })
    }
    return columnNames.map(item => item.name)
  }
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
      item.name !== config.pivotColumn &&
      item.name !== config.pivotColumnValue &&
      !config?.omitGroupBreakoutByOptions?.includes(item.name) &&
      !_additionalColumns?.includes(item.name) &&
      !pivotColumnNames?.includes(item.name)
    ))
    return options.map(item => ({ option: item.title, value: item.name }))
  }
  // Returns a list of options available for the group by and breakout columns
  const getBreakoutByOptions = () => {
    const options = columnNames.filter(item => (
      item.name !== _groupBySticky &&
      item.name !== _groupBy &&
      item.name !== config.pivotColumn &&
      item.name !== config.pivotColumnValue &&
      !config?.omitGroupBreakoutByOptions?.includes(item.name) &&
      !_additionalColumns?.includes(item.name) &&
      !pivotColumnNames?.includes(item.name)
    ))
    return options.map(item => ({ option: item.title, value: item.name }))
  }

  // Data Table state props
  const [columnNames, setColumnNames] = useState([])
  const [pivotData, setPivotData] = useState([])
  const [pivotColumnNames, setPivotColumnNames] = useState()
  const [integratedSortingColumnExtensions] = useState([
    { columnName: 'monthLong', compare: monthlySort },
  ])
  const [hiddenColumnNames, setHiddenColumnNames] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [fixedColumns, setFixedColumns] = useState([])
  const [sorting, setSorting] = useState(config.sortColumn) // { columnName: 'city', direction: 'asc' }
  const [totalSummaryItems, setTotalSummaryItems] = useState([])
  const [tableData, setTableData] = useState()
  const [defaultColumnWidths, setDefaultColumnWidths] = useState([])
  const [columnOrder, setColumnOrder] = useState()
  const [tableColumnExtensions, setTableColumnExtensions] = useState()

  // Grouping breakout by props
  const [grouping, setGrouping] = useState([])
  const [expandedGroups, setExpandedGroups] = useState([])
  const [groupingExtension, setGroupingExtension] = useState([])
  const [groupSummaryItems, setGroupSummaryItems] = useState([])
  const [groupBySticky, setGroupBySticky] = useState([])
  // Instance variables
  const _groupBySticky = columnNames.find(col => col.name === config[GROUP_BY_STICKY]) && config[GROUP_BY_STICKY]
  const _breakoutBy = columnNames.find(col => col.name === config[BREAKOUT_BY]) && config[BREAKOUT_BY]
  const _additionalColumns = config[ADDITIONAL_COLUMNS]
  const _groupBy = getGroupBy()

  // STEP 1: When data is updated, pivot the data set if needed and set current table data to undefined until we finish processing the workflow
  useEffect(() => {
    if (data && config.pivotColumn && config.pivotColumnValue) {
      const pivotCols = Array.from(new Set(data?.map(item => item[config.pivotColumn])))
      setPivotColumnNames(pivotCols.map(col => col.toString()).sort())
      setPivotData(data.map(item => {
        const pivotProps = {}
        pivotCols.forEach(col => {
          pivotProps[col] = (item[config.pivotColumn] === col) ? item[config.pivotColumnValue] : 0
        })
        return Object.assign(item, pivotProps)
      }))
    }
    else {
      setPivotData(data || [])
      setPivotColumnNames()
      setDefaultColumnWidths([])
    }
  }, [config, data])

  // STEP 2: When the data has been pivoted set the column information
  useEffect(() => {
    if (pivotData.length > 0) {
      const colNames = Object.keys(pivotData[0]).map((column, index) => {
        const titleName = toTitleCase(column).replace('_', ' ')
        return {
          name: column,
          title: DISPLAY_NAMES[column]?.default || titleName,
          plural: DISPLAY_NAMES[column]?.plural || titleName,
          groupByName: DISPLAY_NAMES[config.groupBy]?.plural || config.groupBy,
        }
      })

      setColumnNames(colNames)
      setDefaultColumnWidths(colNames.map((column, index) => {
        let width = (parseInt(column.name) > 100) ? 200 : 250
        console.log(column.name, column, STATE_OFFSHORE_NAME)
        if (column.name === STATE_OFFSHORE_NAME) {
          width = 325
        }
        if (column.name === RECIPIENT) {
          width = 350
        }
        if (column.name === COMPANY_NAME) {
          width = 525
        }
        if (column.name.includes('Trend')) {
          width = 95
        }
        if (column.name === MONTH_LONG) {
          width = 125
        }
        return ({ columnName: column.name, width: width })
      }))
      setHiddenColumnNames(colNames.filter(item =>
        (config.hideColumns?.includes(item.name) ||
          (
            item.name !== _groupBy &&
            item.name !== _groupBySticky &&
            item.name !== _breakoutBy &&
            (!_additionalColumns || !_additionalColumns.includes(item.name)) &&
            (!pivotColumnNames || !pivotColumnNames.includes(item.name))
          )
        )
      ).map(item => item.name))
    }
  }, [pivotData])

  // STEP 3: Set group by sticky if there are any
  useEffect(() => {
    setGroupBySticky(columnNames.find(col => col.name === config[GROUP_BY_STICKY]) && config[GROUP_BY_STICKY])
  }, [columnNames])

  // STEP 3: Logic to update table display after columns are updated
  useEffect(() => {
    if (_groupBy && (_breakoutBy !== NO_BREAKOUT_BY && _breakoutBy)) {
      setGrouping([{ columnName: _groupBy }])
      setGroupingExtension([{ columnName: _groupBy, showWhenGrouped: true }])
      if (data && data.length > 0) {
        // Gets the unique values that will be expanded
        setExpandedGroups([...new Set(data.map(item => item[_groupBy]))])
      }
      setFixedColumns([TableGroupRow.Row, _groupBy, _breakoutBy])
    }
    else if(_additionalColumns && config.includeAdditionalColumsInGroupBy) {
      setGrouping([{ columnName: _groupBy }])
      setGroupingExtension([{ columnName: _groupBy, showWhenGrouped: true }])
      if (data && data.length > 0) {
        // Gets the unique values that will be expanded
        setExpandedGroups([...new Set(data.map(item => item[_groupBy]))])
      }
      setFixedColumns([TableGroupRow.Row, _groupBy, _additionalColumns[0]])
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
    setGroupSummaryItems(getGroupSummaryItems())
    setTotalSummaryItems(getTotalSummaryItems())
    // If no pivot there is not need to do sum aggregation
    if (pivotData?.length > 0 && !config.pivotColumn) {
      setTableData(pivotData)
    }
    else if (pivotData?.length > 0 && config.pivotColumn && !tableData) {
      // Pivoted columns are assumed to be numbers so align those columns to the right
      setTableColumnExtensions(pivotColumnNames?.map(year => ({ columnName: `${ year }`, align: 'right', wordWrapEnabled: true })))
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
        data: pivotData,
        groupByProps: groupByProps,
        sumByProps: pivotColumnNames
      })
      if (sums.length > 0) {
        setTableData(sums)
      }
    }
  }, [columnNames])

  // STEP 4: Add the table data to the download function
  useEffect(() => {
    if (tableData) {
      addDownloadData({
        key: DOWNLOAD_DATA_TABLE,
        data: {
          cols: columnNames.filter(col => !hiddenColumnNames.includes(col.name)),
          rows: tableData
        }
      })
    }
  }, [tableData])

  // Logic to update group by and breakout by columns
  useEffect(() => {
    setTableData()
    if (config[GROUP_BY_STICKY] !== _groupBy) {
      if (_groupBy && _breakoutBy === _groupBy && config[GROUP_BY] === _groupBy) {
        updateDataFilter({ [GROUP_BY]: _groupBy, [BREAKOUT_BY]: getUniqueBreakoutBy() })
      }
      else if (config[GROUP_BY] !== _groupBy) {
        updateDataFilter({ [GROUP_BY]: _groupBy })
      }
      else if (_breakoutBy && config[BREAKOUT_BY] !== _breakoutBy && _breakoutBy === _groupBy) {
        updateDataFilter({ [GROUP_BY]: getUniqueGroupBy(), [BREAKOUT_BY]: _breakoutBy })
      }
    }
    else if (config[GROUP_BY_STICKY] === _groupBy && config[GROUP_BY]) {
      updateDataFilter({ [GROUP_BY]: undefined })
    }
  }, [_groupBy, _breakoutBy, config])

  console.log(grouping)
  return (
    <React.Fragment>
      {(defaultColumnWidths?.length > 0 && tableData?.length > 0)
        ? <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableGrid
              rows={tableData}
              columns={columnNames}>
              <TotalProvider
                for={columnNames.filter(item => !item.name.startsWith('y')).map(item => item.name)}
              />
              <SortingState
                sorting={sorting}
                onSortingChange={setSorting}
              />
              <GroupingState
                grouping={grouping}
                expandedGroups={expandedGroups}
                onExpandedGroupsChange={setExpandedGroups}
              />
              <SummaryState
                totalItems={totalSummaryItems}
                groupItems={groupSummaryItems}
              />
              <IntegratedSorting columnExtensions={integratedSortingColumnExtensions} />
              <IntegratedGrouping />
              <IntegratedSummary calculator={summaryCalculator} />
              <Table
                columnExtensions={tableColumnExtensions}
                cellComponent={CustomTableCell}
                tableComponent={CustomTable}
                headComponent={CustomTableHead}
                height={config.height || 550}
              />
              <TableColumnReordering
                order={columnOrder}
              />
              <TableColumnResizing columnWidths={defaultColumnWidths} onColumnWidthsChange={setDefaultColumnWidths} />
              <TableHeaderRow
                contentComponent={props =>
                  <CustomTableHeaderCell
                    groupByOptions={getGroupByOptions()}
                    breakoutByOptions={getBreakoutByOptions()}
                    onAddColumn={!_breakoutBy && addBreakoutByColumnHandler}
                    onRemoveColumn={_breakoutBy && removeBreakoutByColumnHandler}
                    {...props} />}
                showSortingControls
                sortLabelComponent={CustomTableHeaderSortLabel}/>
              <TableColumnVisibility
                hiddenColumnNames={hiddenColumnNames}
              />
              <TableGroupRow
                contentComponent={CustomGroupCellContent}
                columnExtensions={groupingExtension} />
              {config.showOnlySubtotalRow &&
                <TableSummaryRow
                  groupRowComponent={CustomTableSummaryRowGroupRow}
                  totalRowComponent={() => <></>}
                  itemComponent={CustomTableSummaryRowItem}
                />
              }
              {(config.showSummaryRow && !config.showOnlySubtotalRow) &&
                <TableSummaryRow
                  groupRowComponent={CustomTableSummaryRowGroupRow}
                  totalRowComponent={CustomTableSummaryRowTotalRow}
                  itemComponent={CustomTableSummaryRowItem}
                />
              }
            </TableGrid>
          </Grid>
        </Grid>
        : <Box zIndex="modal">
          <Skeleton variant="rect" width={'100%'} height={config.tableHeight} animation={false}/>
        </Box>
      }
    </React.Fragment>
  )
}
