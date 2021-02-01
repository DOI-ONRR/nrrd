import React from 'react'

import makeStyles from '@material-ui/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'
import { Table } from '@devexpress/dx-react-grid-material-ui'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.info.main,
  },
}))

const CustomTableSummaryRowTotalRow = props => {
  const theme = useTheme()
  const styles = useStyles(theme)

  return (
    <Table.Row {...props} classes={styles}>
      {props.children}
    </Table.Row>
  )
}

export default CustomTableSummaryRowTotalRow
