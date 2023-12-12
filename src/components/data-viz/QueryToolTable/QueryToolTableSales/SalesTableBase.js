import React, { useEffect, useState, useContext } from 'react'
import SalesGroupRow from '../Custom/CustomTableSummaryRowGroupRow'
import SalesTotalRow from '../Custom/CustomTableSummaryRowTotalRow'
import SalesHeaderSortLabel from './plugins/SalesHeaderSortLabel'
import SalesTableCell from './plugins/SalesTableCell'
import HeaderRowCell from './plugins/HeaderRowCell'
import SummaryHeaderCell from './plugins/SummaryHeaderCell'
import SalesSummaryCell from './plugins/SalesSummaryCell'
import GroupCellComponent from './plugins/GroupCellComponent'
import TotalCellComponent from './plugins/TotalCellComponent'
import SalesGroupByColumnHeader from './plugins/SalesGroupByColumnHeader'
import { CurrencyTypeProvider, NumberTypeProvider } from './plugins/SalesDataTypeProviders'
import { getCommodities } from './helpers/transformData'
import { DataFilterContext } from '../../../../stores'
import { BREAKOUT_BY, FEDERAL_SALES } from '../../../../constants'

import {
  GroupingState,
  SummaryState,
  IntegratedSummary,
  IntegratedGrouping,
  SortingState,
  IntegratedSorting
} from '@devexpress/dx-react-grid'

import {
  Grid,
  Table,
  TableGroupRow,
  TableHeaderRow,
  TableSummaryRow
} from '@devexpress/dx-react-grid-material-ui'

import tableConfig from './config/tableConfig'

const SalesTableBase = ({ salesTableData }) => {
  const { updateDataFilter, state: dataFilterCtx } = useContext(DataFilterContext)
  const [expandedGroups, setExpandedGroups] = useState([])
  const [columns, setColumns] = useState(tableConfig.columns)

  const addBreakoutByColumnHandler = () => {
    updateDataFilter({ [BREAKOUT_BY]: 'landType' })
  }
  const removeBreakoutByColumnHandler = () => {
    updateDataFilter({ [BREAKOUT_BY]: undefined })
  }

  useEffect(() => {
    if (salesTableData) {
      setExpandedGroups(getCommodities(salesTableData))
    }
    else {
      setExpandedGroups([])
    }
  }, [salesTableData])

  useEffect(() => {
    if (dataFilterCtx.dataTypesCache[FEDERAL_SALES].breakoutBy) {
      const index = tableConfig.breakoutOptions.findIndex(option => option.value === dataFilterCtx.dataTypesCache[FEDERAL_SALES].breakoutBy)
      setColumns(columns.toSpliced(2, 0, { name: dataFilterCtx.dataTypesCache[FEDERAL_SALES].breakoutBy, title: tableConfig.breakoutOptions[index].option, breakout: true }))
    }
    else {
      setColumns(columns.toSpliced(2, 1))
    }
  }, [dataFilterCtx])

  return (
    <Grid
      rows={salesTableData}
      columns={columns}>

      <CurrencyTypeProvider
        for={tableConfig.currencyColumns}
      />

      <NumberTypeProvider
        for={tableConfig.numberColumns}
      />

      <SortingState
        defaultSorting={tableConfig.defaultSorting}
      />

      <GroupingState
        grouping={tableConfig.grouping}
        expandedGroups={expandedGroups}
      />
      <SummaryState
        groupItems={tableConfig.groupSummaryItems}
        totalItems={tableConfig.totalSummaryItems}
      />
      <IntegratedSorting />
      <IntegratedGrouping />
      <IntegratedSummary />

      <Table
        cellComponent={SalesTableCell}
        columnExtensions={tableConfig.columnExtensions}
      />
      <TableHeaderRow
        contentComponent={ props =>
          <SalesGroupByColumnHeader
            groupByOptions={[]}
            breakoutByOptions={tableConfig.breakoutOptions}
            onAddColumn={addBreakoutByColumnHandler}
            onRemoveColumn={removeBreakoutByColumnHandler}
            {...props} />
        }
        cellComponent={HeaderRowCell}
        sortLabelComponent={SalesHeaderSortLabel}
        showSortingControls
      />
      <TableGroupRow
        showColumnsWhenGrouped
        contentComponent={SummaryHeaderCell}
      />
      <TableSummaryRow
        itemComponent={SalesSummaryCell}
        groupCellComponent={GroupCellComponent}
        groupRowComponent={SalesGroupRow}
        totalRowComponent={SalesTotalRow}
        totalCellComponent={TotalCellComponent}
      />

    </Grid>
  )
}

export default SalesTableBase
