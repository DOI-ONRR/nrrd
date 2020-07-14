import React, { useContext } from 'react'

import Grid from '@material-ui/core/Grid'
import {
  GroupBySelectInput,
  BreakoutBySelectInput
} from '../../../inputs'
import BaseButtonInput from '../../../inputs/BaseButtonInput'
import {
  GROUP_BY,
  BREAKOUT_BY
} from '../../../../constants'

import { DataFilterContext } from '../../../../stores/data-filter-store'

const CustomTableHeaderCell = ({ getMessage, onAddColumn, onRemoveColumn, options, ...restProps }) => {
  const { state } = useContext(DataFilterContext)

  const GroupByColumnHeader = () => {
    return (
      <Grid container alignItems="flex-start">
        <Grid item xs={(onAddColumn) ? 7 : 12}>
          <GroupBySelectInput data={options} />
        </Grid>
        {onAddColumn &&
          <Grid item xs={5}>
            <BaseButtonInput onClick={onAddColumn} label={'+ Add column'} styleType={'link'} style={{ top: '-8px' }}/>
          </Grid>
        }
      </Grid>
    )
  }
  const BreakoutByColumnHeader = () => {
    return (
      <Grid container alignItems="flex-start">
        <Grid item xs={(onRemoveColumn) ? 7 : 12}>
          <BreakoutBySelectInput data={options} />
        </Grid>
        {onRemoveColumn &&
          <Grid item xs={5}>
            <BaseButtonInput onClick={onRemoveColumn} label={'x Remove'} styleType={'link'} style={{ top: '-8px' }}/>
          </Grid>
        }
      </Grid>
    )
  }

  return (
    <>
      {state[GROUP_BY] === restProps.column.name &&
        <GroupByColumnHeader />
      }
      {state[BREAKOUT_BY] === restProps.column.name &&
        <BreakoutByColumnHeader />
      }
      {(state[GROUP_BY] !== restProps.column.name && state[BREAKOUT_BY] !== restProps.column.name) &&
        <>{restProps.children}</>
      }
    </>
  )
}

export default CustomTableHeaderCell
