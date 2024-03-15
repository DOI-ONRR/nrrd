import React from 'react'
import makeStyles from '@material-ui/styles/makeStyles'
import { Table } from '@devexpress/dx-react-grid-material-ui'

const HeaderRowCell = ({ children, ...rest }) => {
  const headStyles = makeStyles(() => ({
    cell: {
      whiteSpace: 'initial !important',
      textAlign: 'center'
    },
    shorter: {
      lineHeight: 1.4
    }
  }))
  const useShorter = children[0].props.params.column.name === 'royaltyValuePriorToAllowance' ||
    children[0].props.params.column.name === 'royaltyValueLessAllowance'

  return (
    <Table.Cell {...rest} classes={headStyles()} className={(useShorter ? headStyles().shorter : null)}>
      {children}
    </Table.Cell>
  )
}

export default HeaderRowCell
