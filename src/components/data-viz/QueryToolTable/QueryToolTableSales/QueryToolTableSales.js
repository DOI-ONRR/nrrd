import React, { useContext, useEffect, useState } from 'react'

import {
  GroupingState,
  SummaryState,
  IntegratedSummary,
  IntegratedGrouping,
  DataTypeProvider
} from '@devexpress/dx-react-grid'
import {
  Grid as TableGrid,
  Table,
  TableGroupRow,
  TableHeaderRow,
  TableSummaryRow
} from '@devexpress/dx-react-grid-material-ui'

import Skeleton from '@material-ui/lab/Skeleton'
import LinearProgress from '@material-ui/core/LinearProgress'
import makeStyles from '@material-ui/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'

import SalesGroupRow from '../Custom/CustomTableSummaryRowGroupRow'
import SalesTotalRow from '../Custom/CustomTableSummaryRowTotalRow'

import {
  withStyles,
  Box,
  Grid
} from '@material-ui/core'

import {
  QK_QUERY_TOOL
} from '../../../../constants'

import { DataFilterContext } from '../../../../stores'
import withQueryManager from '../../../withQueryManager'

const cellStyles = makeStyles(theme => ({
  cell: {
    borderRight: `1px solid ${ theme.palette.divider }`,
    backgroundColor: 'white',
    paddingTop: '2px;',
    paddingBottom: '2px;'
  }
}))

const CurrencyFormatter = ({ value }) => (
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', currencySign: 'accounting' })
)

const CurrencyTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={CurrencyFormatter}
    {...props}
  />
)

const NumberFormatter = ({ value }) => (
  value.toLocaleString('en-US')
)

const NumberTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={NumberFormatter}
    {...props}
  />
)

const PercentageFormatter = ({ value }) => (
  `${ (value * 100).toFixed(2) }%`
)

const PercentageTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={PercentageFormatter}
    {...props}
  />
)

const QueryToolTableSales = withQueryManager(({ data, loading }) => {
  const { state: dataFilterContext } = useContext(DataFilterContext)
  const _tableHeight = 550
  const [tableData, setTableData] = useState()
  const columns = [
    { name: 'commodity', title: 'Commodity' },
    { name: 'calendarYear', title: 'Sales Year' },
    { name: 'salesValue', title: 'Sales Value' },
    { name: 'salesVolume', title: 'Sales Volume' },
    { name: 'royaltyValuePriorToAllowance', title: 'Royalty Value Prior to Allowance' },
    { name: 'transportationAllowance', title: 'Transportation Allowance' },
    { name: 'processingAllowance', title: 'Processing Allowance' },
    { name: 'royaltyValueLessAllowance', title: 'Royalty Value Less Allowance' }
  ]
  const currencyColumns = [
    'salesValue',
    'royaltyValuePriorToAllowance',
    'transportationAllowance',
    'processingAllowance',
    'royaltyValueLessAllowance'
  ]
  const percentageColumns = [
    'effectiveRoyaltyRate'
  ]
  const numberColumns = [
    'salesVolume'
  ]
  const grouping = [{ columnName: 'commodity' }]
  const groupSummaryItems = [
    { columnName: 'salesValue', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'salesVolume', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'royaltyValuePriorToAllowance', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'transportationAllowance', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'processingAllowance', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'royaltyValueLessAllowance', type: 'sum', alignByColumn: true, showInGroupFooter: true }
  ]
  const totalSummaryItems = [
    { columnName: 'salesValue', type: 'sum', alignByColumn: true },
    { columnName: 'salesVolume', type: 'sum', alignByColumn: true, showInGroupFooter: true },
    { columnName: 'royaltyValuePriorToAllowance', type: 'sum', alignByColumn: true },
    { columnName: 'transportationAllowance', type: 'sum', alignByColumn: true },
    { columnName: 'processingAllowance', type: 'sum', alignByColumn: true, showInGroupFooter: false },
    { columnName: 'royaltyValueLessAllowance', type: 'sum', alignByColumn: true, showInGroupFooter: false }
  ]

  const theme = useTheme()
  const styles = cellStyles(theme)

  const formatData = (column, value) => {
    if (currencyColumns.findIndex(col => col === column.name) !== -1) {
      return CurrencyFormatter({ value: value })
    }
    else if (numberColumns.findIndex(col => col === column.name) !== -1) {
      return NumberFormatter({ value: value })
    }
    return value
  }

  const SalesDataCell = ({ value, style, ...restProps }) => (
    <div
      {...restProps}>
      {formatData(restProps.children.props.column, value)}
    </div>
  )

  const SalesTableCell = ({ ...restProps }) => {
    console.log(restProps)
    return (
      <Table.Cell {...restProps} classes={styles}>{formatData(restProps.column, restProps.value)}</Table.Cell>
    )
  }

  const summarize = srcArr => {
    return srcArr.reduce((accumulator, currentValue) => {
      const index = accumulator.findIndex(acc => acc.commodity === currentValue.commodity && acc.calendarYear === currentValue.calendarYear)
      if (index !== -1) {
        accumulator[index].salesValue += currentValue.salesValue
        accumulator[index].salesVolume += currentValue.salesVolume
        accumulator[index].royaltyValuePriorToAllowance += currentValue.royaltyValuePriorToAllowance
        accumulator[index].transportationAllowance += currentValue.transportationAllowance
        accumulator[index].processingAllowance += currentValue.processingAllowance
        accumulator[index].royaltyValueLessAllowance += currentValue.royaltyValueLessAllowance
      }
      else {
        accumulator.push({
          commodity: currentValue.commodity,
          calendarYear: currentValue.calendarYear,
          salesValue: currentValue.salesValue,
          salesVolume: currentValue.salesVolume,
          royaltyValuePriorToAllowance: currentValue.royaltyValuePriorToAllowance,
          transportationAllowance: currentValue.transportationAllowance,
          processingAllowance: currentValue.processingAllowance,
          royaltyValueLessAllowance: currentValue.royaltyValueLessAllowance
        })
      }
      return accumulator
    }, [])
  }

  useEffect(() => {
    if (data) {
      setTableData(summarize(data.results))
    }
    else {
      setTableData()
    }
  }, [dataFilterContext, data])

  useEffect(() => {
    if (loading && data) {
      setTableData()
    }
  }, [loading])

  const BorderLinearProgress = withStyles(theme => ({
    root: {
      height: 10,
      width: '-webkit-fill-available'
    },
    bar: {
      backgroundColor: theme.palette.blue[200],
    },
  }))(LinearProgress)

  return (
    <Box>
      {loading &&
        <Grid item xs={12}>
          <Box zIndex="snackbar" style={{ width: '-webkit-fill-available' }}>
            <BorderLinearProgress />
          </Box>
          <Box zIndex="modal">
            <Skeleton variant="rect" width={'100%'} height={_tableHeight} animation={false}/>
          </Box>
        </Grid>
      }
      {tableData &&
        <TableGrid
          rows={tableData}
          columns={columns}>

          <CurrencyTypeProvider
            for={currencyColumns}
          />

          <NumberTypeProvider
            for={numberColumns}
          />

          <PercentageTypeProvider
            for={percentageColumns}
          />

          <GroupingState
            grouping={grouping}
          />
          <SummaryState
            groupItems={groupSummaryItems}
            totalItems={totalSummaryItems}
          />
          <IntegratedGrouping />
          <IntegratedSummary />

          <Table
            cellComponent={SalesTableCell}
          />
          <TableHeaderRow />
          <TableGroupRow
            showColumnsWhenGrouped
          />
          <TableSummaryRow
            itemComponent={SalesDataCell}
            groupRowComponent={SalesGroupRow}
            totalRowComponent={SalesTotalRow}
          />

        </TableGrid>
      }
    </Box>
  )
}, QK_QUERY_TOOL)

export default QueryToolTableSales
