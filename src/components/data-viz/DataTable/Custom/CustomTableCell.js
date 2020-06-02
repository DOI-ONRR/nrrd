import React, { useContext} from 'react'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { formatToDollarInt, formatToCommaInt } from '../../../../js/utils'
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

const CustomTableCell = ({ getMessage, ...restProps }) => {
  const { state } = useContext(DataFilterContext)

  const theme = useTheme()
  const styles = useStyles(theme)

  let cellValue = restProps.value
  if (restProps.children && typeof (restProps.children.type) === 'function') {
    cellValue = restProps.children.type(restProps)
  }
  else if (restProps.column.year) {
    if (parseInt(cellValue) === 0) {
      cellValue = '-'
    }
    else {
      cellValue = (state[DATA_TYPE] !== PRODUCTION) ? formatToDollarInt(cellValue) : formatToCommaInt(cellValue)
    }
  }

  return (
    <Table.Cell {...restProps} classes={styles}>{cellValue}</Table.Cell>
  )
}

export default CustomTableCell
