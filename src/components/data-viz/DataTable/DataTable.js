import React, { useContext, useState, useEffect } from 'react'

import {
  REVENUE,
  PRODUCTION,
  DISBURSEMENTS,
  DATA_TYPE,
  GROUP_BY,
  BREAKOUT_BY,
  PERIOD,
  PERIOD_FISCAL_YEAR,
  PERIOD_CALENDAR_YEAR,
  FISCAL_YEAR,
  CALENDAR_YEAR,
  NO_BREAKOUT_BY
} from '../../../constants'
import { DataFilterContext } from '../../../stores/data-filter-store'
import { AppStatusContext } from '../../../stores/app-status-store'
import utils, { toTitleCase, aggregateSum } from '../../../js/utils'

import DTQM from '../../../js/data-table-query-manager'
import { useQuery } from '@apollo/react-hooks'

import CustomTableCell from './Custom/CustomTableCell'
import CustomTableSummaryRowTotalRow from './Custom/CustomTableSummaryRowTotalRow'
import CustomTableFixedCell from './Custom/CustomTableFixedCell'
import CustomTableSummaryRowItem from './Custom/CustomTableSummaryRowItem'
import CustomTableSummaryRowGroupRow from './Custom/CustomTableSummaryRowGroupRow'
import AllTypeProvider from './Custom/AllTypeProvider'

import DataTableGroupingToolbar from './DataTableGroupingToolbar'

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
  FilteringState,
  IntegratedFiltering,
  DataTypeProvider,
  TableColumnVisibility
} from '@devexpress/dx-react-grid'

import {
  Grid as TableGrid,
  VirtualTable as Table,
  TableHeaderRow,
  TableFixedColumns,
  TableGroupRow,
  GroupingPanel,
  DragDropProvider,
  Toolbar,
  TableSummaryRow,
  TableColumnResizing
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

const DataTable = ({ dataType, height = '100%' }) => {
  const classes = useStyles()
  const { state } = useContext(DataFilterContext)
  if (!state) {
    throw new Error('Data Filter Context has an undefined state. Please verify you have the Data Filter Provider included in your page or component.')
  }

  return (
    <Box className={classes.root} height={height}>
      <Grid container spacing={2} style={{ height: '100%' }}>
        {state[DATA_TYPE] &&
          <React.Fragment>
            {state[DATA_TYPE] === REVENUE &&
                <Grid item xs={12}>
                  <RevenueDataTableImpl />
                </Grid>
            }
            {state[DATA_TYPE] === PRODUCTION &&
                <Grid item xs={12}>
                  <ProductionDataTableImpl />
                </Grid>
            }
            {state[DATA_TYPE] === DISBURSEMENTS &&
                <Grid item xs={12}>

                </Grid>
            }
          </React.Fragment>
        }
      </Grid>
    </Box>
  )
}

export default DataTable

const RevenueDataTableImpl = () => {
  const { state } = useContext(DataFilterContext)

  const loadingMessage = `Loading ${ state.dataType } data from server...`

  const { loading, error, data } = useQuery(DTQM.getQuery(state), DTQM.getVariables(state))

  const { updateLoadingStatus, showErrorMessage } = useContext(AppStatusContext)

  useEffect(() => {
    if (error) {
      showErrorMessage(`Error!: ${ error.message }`)
    }
  }, [error])

  useEffect(() => {
    updateLoadingStatus({ status: loading, message: loadingMessage })
  }, [loading])

  return (
    <React.Fragment>
      {(data && data.results.length > 0) &&
        <DataTableImpl {...data} />
      }
    </React.Fragment>
  )
}
const ProductionDataTableImpl = () => {
  const { state } = useContext(DataFilterContext)

  const loadingMessage = `Loading ${ state.dataType } data from server...`

  const { loading, error, data } = useQuery(DTQM.getQuery(state), DTQM.getVariables(state))

  const { updateLoadingStatus, showErrorMessage } = useContext(AppStatusContext)

  useEffect(() => {
    if (error) {
      showErrorMessage(`Error!: ${ error.message }`)
    }
  }, [error])

  useEffect(() => {
    updateLoadingStatus({ status: loading, message: loadingMessage })
  }, [loading])

  return (
    <React.Fragment>
      {(data && data.results.length > 0) &&
        <DataTableImpl {...data} />
      }
    </React.Fragment>
  )
}

const DownloadDataTableButton = () => {
  const downloadStuff = () => {
    downloadExcel()
  }
  return (
    <Button
      variant="contained"
      color="primary"
      aria-label="open data filters"
      onClick={downloadStuff}
      onKeyDown={downloadStuff}
      startIcon={<TableChart />}
    >
    Download table to excel
    </Button>
  )
}

const DataTableImpl = data => {
  const { state } = useContext(DataFilterContext)
  const columnNames = getColumnNames(data.results[0])
  const [grouping, setGrouping] = useState([])
  const [hiddenColumnNames, setHiddenColumnNames] = useState([])
  const [fixedColumns, setFixedColumns] = useState([])
  const [totalSummaryItems, setTotalSummaryItems] = useState([])
  const [groupSummaryItems, setGroupSummaryItems] = useState([])
  const [aggregatedSums, setAggregatedSums] = useState()
  const [defaultColumnWidths] = useState(columnNames ? columnNames.map(column => ({ columnName: column.name, width: 200 })) : [])
  const [tableColumnExtensions] = useState(allYears.map(year => ({ columnName: `y${ year }`, align: 'right', wordWrapEnabled: true })))
  const getHiddenColumns = () => {
    let yearColumns = []
    if (state[CALENDAR_YEAR] || state[FISCAL_YEAR]) {
      let years = (state[CALENDAR_YEAR]) ? state[CALENDAR_YEAR].split(',') : state[FISCAL_YEAR].split(',')
      years = years.map(item => `y${ item }`)
      yearColumns = columnNames.filter(item => (item.name.startsWith('y') && !years.includes(item.name)))
    }

    const nonYearColumns = columnNames.filter(item => (!item.name.startsWith('y') && item.name !== state[GROUP_BY] && item.name !== state[BREAKOUT_BY]))

    return yearColumns.concat(nonYearColumns).map(item => item.name)
  }

  const getCurrencyColumns = () => {
    const years = columnNames.filter(item => item.name.startsWith('y'))
    return years && years.map(item => item.name)
  }

  const getTotalSummaryItems = () => {
    const years = columnNames //.filter(item => item.name.startsWith('y'))
    return years && years.map(item => ({ columnName: item.name, type: 'sum', alignByColumn: false }))
  }

  const getGroupSummaryItems = () => {
    const years = columnNames //.filter(item => item.name.startsWith('y'))
    return years && years.map(item => ({ columnName: item.name, type: 'sum', showInGroupFooter: true, alignByColumn: true }))
  }

  const getDefaultColumnWidths = () => {
    const widths = 90
	  columnNames.forEach(column => {
	    widths.push({ columnName: column, width: 200 })
	  })
  }

  useEffect(() => {
    if (state[GROUP_BY]) {
      setGrouping([{ columnName: state[GROUP_BY] }])
      setFixedColumns([TableGroupRow.Row, state[GROUP_BY], state[BREAKOUT_BY]])
      setHiddenColumnNames(getHiddenColumns())
    }
    else {
      setGrouping([])
      setFixedColumns([])
      setHiddenColumnNames([])
    }

    setTotalSummaryItems(getTotalSummaryItems())
    setGroupSummaryItems(getGroupSummaryItems())
    if (data && data.results.length > 0) {
      const yearProps = columnNames.filter(item => item.name.startsWith('y'))
      setAggregatedSums(aggregateSum({
        data: data.results,
        groupBy: state[GROUP_BY],
        breakoutBy: (state[BREAKOUT_BY] === NO_BREAKOUT_BY) ? undefined : state[BREAKOUT_BY],
        sumByProps: yearProps.map(item => item.name)
      }))
    }
  }, [state, data])

  return (
    <React.Fragment>
      {(aggregatedSums && aggregatedSums.length > 0) &&
        <Grid container>
          <Grid item xs={12}>
            <TableGrid
              rows={aggregatedSums}
              columns={columnNames}>
              <AllTypeProvider
                for={columnNames.filter(item => !item.name.startsWith('y')).map(item => item.name)}
              />
              <SortingState />
              <GroupingState
                grouping={grouping}
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
              />
              <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
              <TableHeaderRow showSortingControls/>
              <TableColumnVisibility
                hiddenColumnNames={hiddenColumnNames}
              />
              <TableGroupRow />
              <TableSummaryRow
                groupRowComponent={CustomTableSummaryRowGroupRow}
                totalRowComponent={CustomTableSummaryRowTotalRow}
                itemComponent={CustomTableSummaryRowItem}
              />
              <TableFixedColumns leftColumns={fixedColumns} cellComponent={CustomTableFixedCell} />
            </TableGrid>
          </Grid>
        </Grid>
      }
    </React.Fragment>
  )
}

const PLURAL_COLUMNS_MAP = {
  'Revenue type': 'revenue types',
  Commodity: 'commodities',
  'Land Category': 'land categories',
  Location: 'locations',
  COUNTY: 'counties',
  REGION: 'regions',
  SOURCE: 'sources',
  RECIPIENT: 'recipients',
}

const getColumnNames = row => {
  if (!row) {
    return []
  }
  const filteredColumns = Object.keys(row).filter(column => !column.includes('typename'))
  return filteredColumns.map(column => {
    if (parseInt(column.substring(1)) > 1000) {
      return { name: column, title: column.substring(1), year: parseInt(column.substring(1)) }
    }
    const titleName = toTitleCase(column).replace('_', ' ')
    return { name: column, title: titleName, plural: PLURAL_COLUMNS_MAP[titleName] }
  })
}

const CustomTableSummaryRowTotalCell = ({ ...restProps }) => {
  // console.log(restProps, restProps.value)
  return (
    <Table.Cell {...restProps} />
  )
}

const summaryCalculator = (type, rows, getValue) => {
  return IntegratedSummary.defaultCalculator(type, rows, getValue)
}
