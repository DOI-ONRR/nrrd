import React, { useContext } from 'react'
import makeStyles from '@material-ui/styles/makeStyles'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { DataFilterContext } from '../../../../../stores'
import { FEDERAL_SALES } from '../../../../../constants'

const GroupCellComponent = ({ column, ...props }) => {
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
      <Table.Cell classes={subTotalStyles()}>Subtotal:</Table.Cell>
    )
  }
  return (
    <Table.Cell {...props}></Table.Cell>
  )
}

export default GroupCellComponent
