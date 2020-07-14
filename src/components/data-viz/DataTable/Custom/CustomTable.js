import React from 'react'

import makeStyles from '@material-ui/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'
import { VirtualTable as Table } from '@devexpress/dx-react-grid-material-ui'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '0px !important'
  }
}))

const CustomTable = ({ getMessage, ...restProps }) => {
  const theme = useTheme()
  const styles = useStyles(theme)

  return (
    <Table.Table {...restProps} className={styles.root} />
  )
}

export default CustomTable
