import React from 'react'

import makeStyles from '@material-ui/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'
import { Table } from '@devexpress/dx-react-grid-material-ui'

const useStyles = makeStyles(theme => ({
  cell: {
    borderRight: `1px solid ${ theme.palette.divider }`,
    backgroundColor: 'white',
    paddingTop: '2px;',
    paddingBottom: '2px;'
  }
}))

const CustomTableHeaderCell = ({ getMessage, ...restProps }) => {
  const theme = useTheme()
  const styles = useStyles(theme)
  console.log(restProps)
  return (
    <Table.StubHeaderCell {...restProps} classes={styles} />
  )
}

export default CustomTableHeaderCell
