import React from 'react'

import makeStyles from '@material-ui/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'
import { TableFixedColumns } from '@devexpress/dx-react-grid-material-ui'

const useStyles = makeStyles(theme => ({
  fixedCell: {
    backgroundColor: 'inherit',
  }
}))

const CustomTableFixedCell = props => {
  const theme = useTheme()
  const styles = useStyles(theme)

  return (
    <TableFixedColumns.Cell {...props} classes={styles} />
  )
}

export default CustomTableFixedCell
