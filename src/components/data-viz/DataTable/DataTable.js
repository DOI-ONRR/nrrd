import React, { forwardRef, useContext, useState, useEffect } from 'react'

import { REVENUE, PRODUCTION, DISBURSEMENTS, DATA_FILTER_CONSTANTS as DFC } from '../../../constants'
import { DataFilterContext } from '../../../stores/data-filter-store'
import { AppStatusContext } from '../../../stores/app-status-store'
import utils, { toTitleCase } from '../../../js/utils'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

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

const allYears = ['2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003']

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    margin: 0,
  },
}))

const DataTable = ({ dataType, height = '100%' }) => {
  const classes = useStyles()
  const { state } = useContext(DataFilterContext)
  if (!state) {
    throw new Error('Data Filter Context has an undefined state. Please verify you have the Data Filter Provider included in your page or component.')
  }

  const type = dataType || state[DFC.DATA_TYPE]

  console.log('type', type)

  return (
    <Box className={classes.root} height={height}>
      <Grid container spacing={2} style={{ height: '100%' }}>
        {type === REVENUE &&
          <Grid item xs={12}>
            <RevenueDataTable state={state} />
          </Grid>
        }
        {type === PRODUCTION &&
          <Grid item xs={12}>
            <ProductionDataTable state={state} />
          </Grid>
        }
        {type === DISBURSEMENTS &&
          <Grid item xs={12}>
            <DisbursementDataTable state={state} />
          </Grid>
        }
      </Grid>
    </Box>
  )
}

export default DataTable

const getAllYearsColumns = () => {
  let allYearsColumnNames = ''
  allYears.forEach(year => {
    allYearsColumnNames = allYearsColumnNames.concat(`y${ year } `)
  })
  return allYearsColumnNames
}

const GET_REVENUE = gql`
query GetRevenueDataTable(${ DFC.variableListDefined })
  {
    revenue:query_tool_data(
      where: {
        land_class: {_eq: $landClass},
        land_category: {_eq: $landCategory},
        offshore_region: {_in: $offshoreRegions},
        state: {_in: $usStates},
        county: {_in: $counties},
        commodity: {_in: $commodities},
        revenue_type: {_eq: $revenueType}
      }) {
      land_class  
      land_category
      offshore_region
      state
      county
      revenue_type
      commodity
      ${ getAllYearsColumns() }
    }
  }`

const GET_PRODUCTION = gql`
  query GetProductionDataTable(${ DFC.variableListDefined })
    {
      production:query_tool_production_data(
        where: {
          land_class: {_eq: $landClass},
          land_category: {_eq: $landCategory},
          offshore_region: {_in: $offshoreRegions},
          state: {_in: $usStates},
          county: {_in: $counties},
          commodity: {_in: $commodities}
        }) {
        land_class
        land_category
        offshore_region
        state
        county
        commodity
        y2019
        y2018
        y2017
        y2016
        y2015
        y2014
        y2013
        y2012
        y2011
      }
    }`
const CurrencyFormatter = ({ value }) => `$${ value }`

const CurrencyTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={CurrencyFormatter}
    {...props}
  />
)
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
      return { name: column, title: column.substring(1) }
    }
    const titleName = toTitleCase(column).replace('_', ' ')
    return { name: column, title: titleName, plural: PLURAL_COLUMNS_MAP[titleName] }
  })
}
const CustomTableSummaryRowGroupRow = ({ ...restProps }) => {
  return (
    <Table.Row {...restProps} />
  )
}

const CustomTableSummaryRowItem = ({ getMessage, ...restProps }) => {
  restProps.value = (isNaN(restProps.value)) ? 0 : utils.formatToDollarInt(restProps.value, 2).slice(1)

  return (
    <div {...restProps} >
      {restProps.children.type
        ? restProps.children.type(restProps)
        : restProps.value + ''
      }
    </div>
  )
}

const CustomTableSummaryRowTotalCell = ({ ...restProps }) => {
  // console.log(restProps, restProps.value)
  return (
    <Table.Cell {...restProps} />
  )
}
const CustomTableSummaryRowTotalRow = ({ ...restProps }) => {
  return (
    <Table.Row {...restProps} />
  )
}

const AllFormatter = ({ value, children, ...rest }) => {
  return (
    <span>
      {children
        ? 'All ' + children.props.column.plural
        : value
      }
    </span>
  )
}

const AllTypeProvider = props => {
  return (
    <DataTypeProvider
      formatterComponent={AllFormatter}
      {...props}
    />
  )
}

const summaryCalculator = (type, rows, getValue) => {
  return IntegratedSummary.defaultCalculator(type, rows, getValue)
}
const getRowId = row => {
  if (!row.id) {
    row.id = Math.random()
  }
  return row.id
}
const Root = props => <TableGrid.Root {...props} style={{ height: '100%' }} />

const getHiddenYears = state => {
  const selectedYears = state.fiscalYears && state.fiscalYears.split(',')
  let hideYears = []
  if (selectedYears) {
    const yearsNotSelected = allYears.filter(year => selectedYears.findIndex(selectedYear => selectedYear === year) < 0)
    hideYears = yearsNotSelected.map(year => `y${ year }`)
  }

  return hideYears
}

const RevenueDataTable = ({ state }) => {
  const { updateLoadingStatus, showErrorMessage } = useContext(AppStatusContext)
  const [grouping, setGrouping] = useState([{ columnName: 'revenue_type' }])
  const [filters, setFilters] = useState()
  const [tableColumnExtensions] = useState(allYears.map(year => ({ columnName: `y${ year }`, align: 'right' })))

  const allColumns = [
    'commodity',
    'revenue_type',
    'land_class'
  ]

  const [defaultColumnWidths] = useState([
    { columnName: 'commodity', width: 180 },
    { columnName: 'revenue_type', width: 180 },
    { columnName: 'land_class', width: 180 },
    { columnName: 'land_category', width: 180 },
    { columnName: 'state', width: 180 },
    { columnName: 'county', width: 180 },
    { columnName: 'offshore_region', width: 180 },
  ].concat(allYears.map(year => ({ columnName: `y${ year }`, width: 210 }))))

  const [hiddenColumnNames, setHiddenColumnNames] = useState([
    'land_class',
    'land_category',
    'state',
    'county',
    'offshore_region',
  ])

  const [totalSummaryItems] = useState(allYears.map(year => ({ columnName: `y${ year }`, type: 'sum', alignByColumn: false })))

  const [groupSummaryItems] = useState(allYears.map(year => ({ columnName: `y${ year }`, type: 'sum', showInGroupFooter: true, alignByColumn: true })))

  const [currencyColumns] = useState(allYears.map(year => `y${ year }`))

  const [leftColumns] = useState(['revenue_type', 'commodity'])

  const { loading, error, data } = useQuery(GET_REVENUE, DFC.ALL_DATA_FILTER_VARS(state))

  useEffect(() => {
    if (error) {
      showErrorMessage(`Error!: ${ error.message }`)
    }
  }, [error])

  useEffect(() => {
    updateLoadingStatus({ status: loading, message: 'Loading Revenue data from server...' })
  }, [loading])

  return (
    <React.Fragment>
      {data &&
        <TableGrid
          rows={data.revenue}
          columns={getColumnNames(data.revenue[0])}>
          <CurrencyTypeProvider
            for={currencyColumns}
          />
          <AllTypeProvider
            for={allColumns}
          />
          <SortingState
            defaultSorting={[{ columnName: `y${ allYears[0] }`, direction: 'asc' }]}
          />
          <GroupingState
            grouping={grouping}
          />
          <SummaryState
            totalItems={totalSummaryItems}
            groupItems={groupSummaryItems}
          />
          <FilteringState
            filters={filters}
            onFiltersChange={setFilters}
          />
          <IntegratedSorting />
          <IntegratedGrouping />
          <IntegratedSummary calculator={summaryCalculator} />
          <IntegratedFiltering />
          <Table columnExtensions={tableColumnExtensions} />
          <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
          <TableHeaderRow showSortingControls/>
          <TableColumnVisibility
            hiddenColumnNames={hiddenColumnNames.concat(getHiddenYears(state))}
            onHiddenColumnNamesChange={setHiddenColumnNames}
          />
          <TableGroupRow />
          <TableSummaryRow
            groupRowComponent={CustomTableSummaryRowGroupRow}
            totalRowComponent={CustomTableSummaryRowTotalRow}
            itemComponent={CustomTableSummaryRowItem}
          />
          <TableFixedColumns leftColumns={leftColumns} />
        </TableGrid>
      }
    </React.Fragment>
  )
}

const ProductionDataTable = ({ state }) => {
  const { updateLoadingStatus, showErrorMessage } = useContext(AppStatusContext)
  const [grouping, setGrouping] = useState([])
  const [filters, setFilters] = useState()
  const [tableColumnExtensions] = useState(allYears.map(year => ({ columnName: `y${ year }`, align: 'right' })))

  const allColumns = [
    'commodity',
    'land_class'
  ]

  const [defaultColumnWidths] = useState([
    { columnName: 'commodity', width: 180 },
    { columnName: 'land_class', width: 180 },
    { columnName: 'land_category', width: 180 },
    { columnName: 'state', width: 180 },
    { columnName: 'county', width: 180 },
    { columnName: 'offshore_region', width: 180 },
  ].concat(allYears.map(year => ({ columnName: `y${ year }`, width: 210 }))))

  const [hiddenColumnNames, setHiddenColumnNames] = useState([
    'commodity',
    'land_category',
    'state',
    'county',
    'offshore_region',
  ])

  const [totalSummaryItems] = useState(allYears.map(year => ({ columnName: `y${ year }`, type: 'sum', alignByColumn: false })))

  const [groupSummaryItems] = useState(allYears.map(year => ({ columnName: `y${ year }`, type: 'sum', showInGroupFooter: true, alignByColumn: true })))

  const [currencyColumns] = useState(allYears.map(year => `y${ year }`))

  const [leftColumns] = useState(['land_class'])

  const { loading, error, data } = useQuery(GET_PRODUCTION, DFC.ALL_DATA_FILTER_VARS(state))

  useEffect(() => {
    if (error) {
      showErrorMessage(`Error!: ${ error.message }`)
    }
  }, [error])

  useEffect(() => {
    updateLoadingStatus({ status: loading, message: 'Loading Production data from server...' })
  }, [loading])

  return (
    <React.Fragment>
      {data &&
        <TableGrid
          rows={data.production}
          columns={getColumnNames(data.production[0])}>
          <CurrencyTypeProvider
            for={currencyColumns}
          />
          <AllTypeProvider
            for={allColumns}
          />
          <SortingState
            defaultSorting={[{ columnName: `y${ allYears[0] }`, direction: 'asc' }]}
          />
          <GroupingState
            grouping={grouping}
          />
          <SummaryState
            totalItems={totalSummaryItems}
            groupItems={groupSummaryItems}
          />
          <FilteringState
            filters={filters}
            onFiltersChange={setFilters}
          />
          <IntegratedSorting />
          <IntegratedGrouping />
          <IntegratedSummary calculator={summaryCalculator} />
          <IntegratedFiltering />
          <Table columnExtensions={tableColumnExtensions} />
          <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
          <TableHeaderRow showSortingControls/>
          <TableColumnVisibility
            hiddenColumnNames={hiddenColumnNames.concat(getHiddenYears(state))}
            onHiddenColumnNamesChange={setHiddenColumnNames}
          />
          <TableGroupRow />
          <TableSummaryRow
            groupRowComponent={CustomTableSummaryRowGroupRow}
            totalRowComponent={CustomTableSummaryRowTotalRow}
            itemComponent={CustomTableSummaryRowItem}
          />
          <TableFixedColumns leftColumns={leftColumns} />
        </TableGrid>
      }
    </React.Fragment>
  )
}

const GET_DISBURSEMENTS = gql`
  {
    disbursement(distinct_on: period_id, limit: 10) {
      disbursement
    }
  }`
const DisbursementDataTable = () => {
  const { loading, error, data } = useQuery(GET_DISBURSEMENTS)

  if (loading) return 'Loading...'
  if (error) return `Error! ${ error.message }`

  return (
    <div>Disbursement Data Table</div>
  )
}
