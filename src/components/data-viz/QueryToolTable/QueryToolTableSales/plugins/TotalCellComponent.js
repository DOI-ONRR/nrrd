import React, { Fragment, useContext } from 'react'
import makeStyles from '@material-ui/styles/makeStyles'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { DataFilterContext } from '../../../../../stores'
import { FEDERAL_SALES } from '../../../../../constants'

const TotalCellComponent = ({ column, children, ...props }) => {
  const { state } = useContext(DataFilterContext)
  const isBreakoutUsed = !!state.dataTypesCache[FEDERAL_SALES].breakoutBy
  if ((!isBreakoutUsed && column.name === 'calendarYear') ||
    (isBreakoutUsed && column.name === state.dataTypesCache[FEDERAL_SALES].breakoutBy)) {
    const subTotalStyles = makeStyles(() => ({
      cell: {
        textAlign: 'right',
        fontWeight: 'bold'
      }
    }))
    return (
      <Table.Cell classes={subTotalStyles()}>Total:</Table.Cell>
    )
  }
  const alignCenter = makeStyles(() => ({
    cell: {
      textAlign: 'center !important'
    }
  }))

  let showNaForGas = true
  if (state.commodity) {
    const commodities = state.commodity.split(',')
    showNaForGas = commodities.includes('Gas (mmbtu)') && commodities.length > 1
  }

  return (
    <Fragment>
      {column.name === 'salesVolume' && showNaForGas
        ? <Table.Cell classes={alignCenter()}>N/A*</Table.Cell>
        : <Table.Cell {...props}>{children}</Table.Cell>
      }
    </Fragment>
  )
}

export default TotalCellComponent
