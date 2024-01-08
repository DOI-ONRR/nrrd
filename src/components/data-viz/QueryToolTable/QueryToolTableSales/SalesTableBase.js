import React, { useEffect, useState, useContext, Fragment } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { Box } from '@material-ui/core'
import makeStyles from '@material-ui/styles/makeStyles'
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
import { DownloadContext } from '../../../../stores/download-store'
import { BREAKOUT_BY, FEDERAL_SALES, DOWNLOAD_DATA_TABLE } from '../../../../constants'

import {
  GroupingState,
  SummaryState,
  IntegratedSummary,
  IntegratedGrouping,
  SortingState,
  IntegratedSorting,
  TableColumnResizing
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
  const { addDownloadData } = useContext(DownloadContext)
  const [expandedGroups, setExpandedGroups] = useState([])
  const [columns, setColumns] = useState(tableConfig.columns)
  const [showNote, setShowNote] = useState(true)

  const addBreakoutByColumnHandler = () => {
    updateDataFilter({ [BREAKOUT_BY]: 'landType' })
  }
  const removeBreakoutByColumnHandler = () => {
    updateDataFilter({ [BREAKOUT_BY]: undefined })
  }

  const noteStyles = makeStyles(() => ({
    root: {
      marginLeft: '0.5em',
      marginTop: '-0.5em'
    }
  }))

  const noteClasses = noteStyles()

  useEffect(() => {
    if (salesTableData) {
      setExpandedGroups(getCommodities(salesTableData))
      addDownloadData({
        key: DOWNLOAD_DATA_TABLE,
        data: {
          cols: columns,
          rows: salesTableData
        }
      })
    }
    else {
      setExpandedGroups([])
    }
  }, [salesTableData])

  useEffect(() => {
    const breakoutBy = dataFilterCtx.dataTypesCache[FEDERAL_SALES].breakoutBy
    if (breakoutBy) {
      const index = tableConfig.breakoutOptions.findIndex(option => option.value === breakoutBy)
      if (Object.hasOwnProperty.call(columns[2], 'breakout')) {
        setColumns(columns.toSpliced(2, 1, { name: breakoutBy, title: tableConfig.breakoutOptions[index].option, breakout: true }))
      }
      else {
        setColumns(columns.toSpliced(2, 0, { name: breakoutBy, title: tableConfig.breakoutOptions[index].option, breakout: true }))
      }
    }
    else {
      let breakoutColumnFound = false
      for (const col of columns) {
        breakoutColumnFound = Object.hasOwnProperty.call(col, 'breakout')
        if (breakoutColumnFound) {
          break
        }
      }
      if (breakoutColumnFound) {
        setColumns(columns.toSpliced(2, 1))
      }
    }
  }, [dataFilterCtx.dataTypesCache[FEDERAL_SALES].breakoutBy])

  useEffect(() => {
    if (dataFilterCtx.commodity) {
      const commodities = dataFilterCtx.commodity.split(',')
      setShowNote(commodities.includes('Gas (MMBtu)') && commodities.length > 1)
    }
  }, [dataFilterCtx.commodity])

  return (
    <Fragment>
      {expandedGroups?.length > 0
        ? <Fragment>
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
              defaultExpandedGroups={expandedGroups}
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
            <TableColumnResizing defaultColumnWidths={tableConfig.defaultColumnWidths}
              resizingMode='nextColumn' />
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
          {showNote
            ? <Box className={noteClasses.root}>*Sales Volume total not available when multiple commodities are selected</Box>
            : null
          }
        </Fragment>
        : <Box zIndex="modal">
          <Skeleton variant="rect" width={'100%'} height={500} animation={false}/>
        </Box>
      }
    </Fragment>
  )
}

export default SalesTableBase
