import React from 'react'
import { DataTypeProvider } from '@devexpress/dx-react-grid'

const AllFormatter = props => {
  const children = props.children
  let value = props.value

  // We set the property type of the total summary rows to totalSum so we know we need to use the group by name in the cell
  // This is done in the DataTable code
  if (props.type === 'totalSum' || props.type === 'sum') {
    value = (props.type === 'totalSum') ? `All ${ children.props.column.groupByName }` : `All ${ children.props.column.plural }`
  }

  return (
    <span>
      {value}
    </span>
  )
}

const AllTypeProvider = props => {
  return (
    <DataTypeProvider
      formatterComponent={AllFormatter}
      {...props}
    />
  )
}

export default AllTypeProvider
