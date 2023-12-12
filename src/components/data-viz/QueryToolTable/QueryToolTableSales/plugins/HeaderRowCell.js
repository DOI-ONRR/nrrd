import React from 'react'
import makeStyles from '@material-ui/styles/makeStyles'
import { Table } from '@devexpress/dx-react-grid-material-ui'

const HeaderRowCell = ({ ...rest }) => {
  const headStyles = makeStyles(() => ({
    cell: {
      whiteSpace: 'initial !important',
      textAlign: 'center'
    }
  }))
  return (
    <Table.Cell {...rest} classes={headStyles()}>
    </Table.Cell>
  )
}

export default HeaderRowCell
