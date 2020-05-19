import React, { useContext } from 'react'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { formatToDollarInt, formatToCommaInt } from '../../../../js/utils'
import {
  PRODUCTION,
  DATA_TYPE
} from '../../../../constants'

import makeStyles from '@material-ui/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.info.light,
  },
}))

const CustomTableSummaryRowItem = ({ getMessage, ...restProps }) => {
  const { state } = useContext(DataFilterContext)

  const theme = useTheme()
  const styles = useStyles(theme)
  let cellValue = restProps.value

  if (typeof (restProps.children.type) === 'function') {
    cellValue = restProps.children.type(restProps)
  }
  else {
    cellValue = (state[DATA_TYPE] !== PRODUCTION) ? formatToDollarInt(cellValue) : formatToCommaInt(cellValue)
  }

  return (
    <div {...restProps} classes={styles.root}>{cellValue}</div>
  )
}

export default CustomTableSummaryRowItem
