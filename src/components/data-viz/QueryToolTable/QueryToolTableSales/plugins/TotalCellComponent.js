import React from 'react'
import makeStyles from '@material-ui/styles/makeStyles'
import { Table } from '@devexpress/dx-react-grid-material-ui'

const TotalCellComponent = ({ column, ...props }) => {
  if (column.name === 'calendarYear') {
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
  return (
    <Table.Cell {...props}></Table.Cell>
  )
}

export default TotalCellComponent
