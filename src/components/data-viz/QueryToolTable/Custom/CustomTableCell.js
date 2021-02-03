import React, { useContext } from 'react'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { formatToDollarFloat, formatToCommaInt } from '../../../../js/utils'
import {
  PRODUCTION,
  DATA_TYPE
} from '../../../../constants'

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
/**
 * This is used for the Query Tool Table to format values properly
 * This does have a dependency on the DataFilterContext
 */
const CustomTableCell = ({ getMessage, ...restProps }) => {
  const { state } = useContext(DataFilterContext)

  const theme = useTheme()
  const styles = useStyles(theme)

  let cellValue = restProps.value

  // Used to identify year columns and format the values accordingly
  if (parseInt(restProps.column.name) > 1000) {
    if (parseInt(cellValue) === 0) {
      cellValue = '-'
    }
    else {
      cellValue = (state[DATA_TYPE] !== PRODUCTION) ? formatToDollarFloat(cellValue) : formatToCommaInt(cellValue)
    }
  }
  else if (restProps.children && typeof (restProps.children.type) === 'function') {
    cellValue = restProps.children.type(restProps)
  }

  return (
    <Table.Cell {...restProps} classes={styles}>{cellValue}</Table.Cell>
  )
}

export default CustomTableCell
