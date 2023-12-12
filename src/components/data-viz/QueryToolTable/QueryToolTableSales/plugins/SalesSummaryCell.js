import React from 'react'
import formatData from '../helpers/formatData'

const SalesSummaryCell = ({ value, style, ...restProps }) => {
  return (
    <div
      {...restProps}>
      {formatData(restProps.children.props.column, value)}
    </div>
  )
}

export default SalesSummaryCell
