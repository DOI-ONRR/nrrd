import React from 'react'
import tableConfig from '../config/tableConfig'
import makeStyles from '@material-ui/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'
import formatData from '../helpers/formatData'
import { Table } from '@devexpress/dx-react-grid-material-ui'

const cellStyles = makeStyles(theme => ({
  cell: {
    borderRight: `1px solid ${ theme.palette.divider }`,
    backgroundColor: 'white',
    paddingTop: '2px;',
    paddingBottom: '2px;'
  }
}))

const SalesTableCell = ({ ...restProps }) => {
  const theme = useTheme()
  const styles = cellStyles(theme)
  let value = restProps.value
  if (tableConfig.grouping.findIndex(item => item.columnName === restProps.column.name) !== -1) {
    value = ' '
  }
  else {
    value = formatData(restProps.column, restProps.value)
  }
  return (
    <Table.Cell {...restProps} classes={styles}>
      {value}
    </Table.Cell>
  )
}

export default SalesTableCell
