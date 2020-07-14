import React, { useContext } from 'react'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import {
  GROUP_BY,
  BREAKOUT_BY
} from '../../../../constants'

const TotalProvider = props => {
  const TotalFormatter = props => {
    const { state } = useContext(DataFilterContext)
    const getTotalLabel = () => {
      if (props.children.props.column.name === state[GROUP_BY] && state[BREAKOUT_BY]) {
        return ''
      }
      return ((props.type === 'totalSum') ? 'Total:' : 'Subtotal:')
    }

    return (
      <>
        {(props.type === 'totalSum' || props.type === 'sum')
          ? <div style={{ textAlign: 'right' }}>{getTotalLabel()}</div>
          : <div>{props.value}</div>
        }
      </>
    )
  }

  return (
    <DataTypeProvider
      formatterComponent={TotalFormatter}
      {...props}
    />
  )
}

export default TotalProvider
