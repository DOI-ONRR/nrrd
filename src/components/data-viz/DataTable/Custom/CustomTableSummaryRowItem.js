import React, { useContext } from 'react'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { formatToDollarInt, formatToCommaInt } from '../../../../js/utils'
import {
  PRODUCTION,
  DATA_TYPE
} from '../../../../constants'

const CustomTableSummaryRowItem = ({ getMessage, ...restProps }) => {
  const { state } = useContext(DataFilterContext)

  let cellValue = restProps.value

  if (typeof (restProps.children.type) === 'function') {
    cellValue = restProps.children.type(restProps)
  }
  else {
    cellValue = (state[DATA_TYPE] !== PRODUCTION) ? formatToDollarInt(cellValue) : formatToCommaInt(cellValue)
  }

  return (
    <div {...restProps}>{cellValue}</div>
  )
}

export default CustomTableSummaryRowItem
