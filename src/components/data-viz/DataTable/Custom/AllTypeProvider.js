import React from 'react'
import { DataTypeProvider } from '@devexpress/dx-react-grid'

const AllFormatter = props => {
  const children = props.children
  const value = props.value

  return (
    <span>
      {(children && !children.props.row)
        ? 'All ' + children.props.column.plural
        : value
      }
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
