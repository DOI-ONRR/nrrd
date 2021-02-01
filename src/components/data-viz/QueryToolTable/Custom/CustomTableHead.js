import React from 'react'

import makeStyles from '@material-ui/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'
import { VirtualTable as Table } from '@devexpress/dx-react-grid-material-ui'

const useStyles = makeStyles(theme => ({
  root: {}
}))

const CustomTableHead = ({ getMessage, ...restProps }) => {
  const theme = useTheme()
  const styles = useStyles(theme)
  return (
    <Table.TableHead {...restProps} className={styles.root} />
  )
}

export default CustomTableHead
