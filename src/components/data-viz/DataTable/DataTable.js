import React, { forwardRef, useContext, useState } from 'react'

import { REVENUE, PRODUCTION, DISBURSEMENTS, DATA_FILTER_CONSTANTS as DFC } from '../../../constants'
import { DataFilterContext } from '../../../stores/data-filter-store'
import { toTitleCase } from '../../../js/utils'

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
            <ProductionDataTable />
          </Grid>
        }
        {type === DISBURSEMENTS &&
          <Grid item xs={12}>
            <DisbursementDataTable />
          </Grid>
        }
      </Grid>
    </Box>
  )
}

export default DataTable

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
const getColumnNames = row => {
  if (!row) {
    return []
  }
  const filteredColumns = Object.keys(row).filter(column => !column.includes('typename'))
  return filteredColumns.map(column => {
    if (parseInt(column.substring(1)) > 1000) {
      return { name: column, title: column.substring(1) }
    }
    return { name: column, title: toTitleCase(column).replace('_', ' ') }
  })
}
const CustomTableSummaryRow_GroupRow = ({ ...restProps }) => {
  return (
    <Table.Row {...restProps} />
  )
}

const CustomTableSummaryRow_Item = ({ getMessage, ...restProps }) => {
  restProps.value = (isNaN(restProps.value)) ? 0 : restProps.value
  console.log(restProps, restProps.value)
  return (
    <div {...restProps} >
      {restProps.children.type
        ? restProps.children.type(restProps)
        : restProps.value + ''
      }
    </div>
  )
}

const CustomTableSummaryRow_TotalCell = ({ ...restProps }) => {
  // console.log(restProps, restProps.value)
  return (
    <Table.Cell {...restProps} />
  )
}
const CustomTableSummaryRow_TotalRow = ({ ...restProps }) => {
  return (
    <Table.Row {...restProps} />
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

const RevenueDataTable = ({ state }) => {
  const [grouping, setGrouping] = useState([{ columnName: 'revenue_type' }])
  const [filters, setFilters] = useState()
  const [tableColumnExtensions] = useState([
    { columnName: 'y2019', align: 'right' },
  ])
  const [defaultColumnWidths] = useState([
    { columnName: 'commodity', width: 180 },
    { columnName: 'revenue_type', width: 180 },
    { columnName: 'land_class', width: 180 },
    { columnName: 'land_category', width: 180 },
    { columnName: 'state', width: 180 },
    { columnName: 'county', width: 180 },
    { columnName: 'offshore_region', width: 180 },
    { columnName: 'y2019', width: 210 },
    { columnName: 'y2018', width: 210 },
    { columnName: 'y2017', width: 210 },
    { columnName: 'y2016', width: 210 },
    { columnName: 'y2015', width: 210 },
    { columnName: 'y2014', width: 210 },
    { columnName: 'y2013', width: 210 },
    { columnName: 'y2012', width: 210 },
    { columnName: 'y2011', width: 210 },
  ])
  const [hiddenColumnNames, setHiddenColumnNames] = useState([
    'land_class',
    'land_category',
    'state',
    'county',
    'offshore_region',
  ])
  const [totalSummaryItems] = useState([
    { columnName: 'y2019', type: 'sum', alignByColumn: false },
    { columnName: 'y2018', type: 'sum', alignByColumn: false },
    { columnName: 'y2017', type: 'sum', alignByColumn: false },
    { columnName: 'y2016', type: 'sum', alignByColumn: false },
    { columnName: 'y2015', type: 'sum', alignByColumn: false },
    { columnName: 'y2014', type: 'sum', alignByColumn: false },
    { columnName: 'y2013', type: 'sum', alignByColumn: false },
    { columnName: 'y2012', type: 'sum', alignByColumn: false },
    { columnName: 'y2011', type: 'sum', alignByColumn: false }])
  const [groupSummaryItems] = useState([
    { columnName: 'y2019', type: 'sum', showInGroupFooter: true, alignByColumn: true }])

  const [currencyColumns] = useState(['y2019'])

  const [leftColumns] = useState(['revenue_type', 'commodity'])

  const { loading, error, data } = useQuery(GET_REVENUE, DFC.ALL_DATA_FILTER_VARS(state))
  if (loading) return 'Loading...'
  if (error) return `Error loading revenue data table ${ error.message }`

  console.log('RevenueDataTable render', data)

  return (
    <TableGrid
      rows={data.revenue}
      columns={getColumnNames(data.revenue[0])}>
      <CurrencyTypeProvider
        for={currencyColumns}
      />
      <SortingState
        defaultSorting={[{ columnName: 'y2019', direction: 'asc' }]}
      />
      <GroupingState
        grouping={grouping}
        defaultExpandedGroups={['Bonus', 'Rents', 'Other Revenues']}
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
        hiddenColumnNames={hiddenColumnNames}
        onHiddenColumnNamesChange={setHiddenColumnNames}
      />
      <TableGroupRow />
      <TableSummaryRow />
      <TableFixedColumns leftColumns={leftColumns} />
    </TableGrid>
  )
}

const GET_PRODUCTION = gql`
  {
    production(distinct_on: period_id, limit: 10) {
      volume
    }
  }`
const ProductionDataTable = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTION)

  if (loading) return 'Loading...'
  if (error) return `Error! ${ error.message }`

  return (
    <div>Production Data Table</div>
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
