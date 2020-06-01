import React from 'react'

import makeStyles from '@material-ui/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { blue } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.info.light,
    '& td': {
      paddingTop: '2px',
      paddingBottom: '2px',
    }
  },
}))

const CustomTableSummaryRowGroupRow = props => {
  const theme = useTheme()
  const styles = useStyles(theme)

  return (
    <Table.Row {...props} classes={styles} />
  )
}

export default CustomTableSummaryRowGroupRow
