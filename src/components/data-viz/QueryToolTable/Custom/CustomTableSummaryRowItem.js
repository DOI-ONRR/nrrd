import React, { useContext } from 'react'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { formatToDollarFloat, formatToCommaInt } from '../../../../js/utils'
import {
  PRODUCTION,
  DATA_TYPE
} from '../../../../constants'

const CustomTableSummaryRowItem = ({ getMessage, ...restProps }) => {
  const { state } = useContext(DataFilterContext)

  let cellValue = restProps.value
  if (typeof (restProps.children.type) === 'function' && (restProps.type !== 'totalSum' && restProps.type !== 'sum')) {
    cellValue = restProps.children.type(restProps)
  }
  else {
    cellValue = (state[DATA_TYPE] !== PRODUCTION) ? formatToDollarFloat(cellValue) : formatToCommaInt(cellValue)
  }

  return (
    <div {...restProps}>{cellValue}</div>
  )
}

export default CustomTableSummaryRowItem
