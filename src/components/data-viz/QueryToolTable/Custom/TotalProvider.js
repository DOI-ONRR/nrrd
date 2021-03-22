import React, { useContext } from 'react'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import {
  GROUP_BY,
  GROUP_BY_STICKY,
  BREAKOUT_BY,
  ADDITIONAL_COLUMNS
} from '../../../../constants'

const TotalProvider = props => {
  const TotalFormatter = props => {
    const { state } = useContext(DataFilterContext)
    const getTotalLabel = () => {
      if ((props.children.props.column.name === state[GROUP_BY] && state[BREAKOUT_BY]) ||
      (props.children.props.column.name === 'Trend') ||
      (state[ADDITIONAL_COLUMNS] && state[ADDITIONAL_COLUMNS].includes(props.children.props.column.name)) ||
      (props.children.props.column.name === state[GROUP_BY_STICKY] && state[BREAKOUT_BY])
      ) {
        return ''
      }
      return ((props.type === 'totalSumLabel') ? 'Total:' : 'Subtotal:')
    }

    return (
      <>
        {(props.type === 'totalSumLabel' || props.type === 'sumLabel')
          ? <div style={{ textAlign: 'right' }}>{getTotalLabel()}</div>
          : <div >{props.value}</div>
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
