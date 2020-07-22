import React, { useContext } from 'react'

import Grid from '@material-ui/core/Grid'
import {
  GroupBySelectInput,
  GroupByStickySelectInput,
  BreakoutBySelectInput
} from '../../../inputs'
import BaseButtonInput from '../../../inputs/BaseButtonInput'
import {
  BREAKOUT_BY,
  GROUP_BY,
  GROUP_BY_STICKY,
  DISPLAY_NAMES
} from '../../../../constants'

import { DataFilterContext } from '../../../../stores/data-filter-store'

const CustomTableHeaderCell = ({ getMessage, onAddColumn, onRemoveColumn, groupByOptions, breakoutByOptions, ...restProps }) => {
  const { state } = useContext(DataFilterContext)

  const GroupByStickyColumnHeader = () => {
    return (
      <Grid container alignItems="flex-start">
        <Grid item xs={(onAddColumn) ? 7 : 12}>
          <GroupByStickySelectInput data={[{ option: DISPLAY_NAMES[state[GROUP_BY_STICKY]].default, value: state[GROUP_BY_STICKY] }]} />
        </Grid>
        {onAddColumn &&
          <Grid item xs={5}>
            <BaseButtonInput onClick={onAddColumn} label={'+ Add column'} styleType={'link'} style={{ top: '-8px' }}/>
          </Grid>
        }
      </Grid>
    )
  }

  const GroupByColumnHeader = () => {
    return (
      <Grid container alignItems="flex-start">
        <Grid item xs={(onAddColumn) ? 7 : 12}>
          <GroupBySelectInput data={groupByOptions} />
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
          <BreakoutBySelectInput data={breakoutByOptions} />
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
      {state[GROUP_BY_STICKY] === restProps.column.name &&
        <GroupByStickyColumnHeader />
      }
      {state[GROUP_BY] === restProps.column.name &&
        <GroupByColumnHeader />
      }
      {state[BREAKOUT_BY] === restProps.column.name &&
        <BreakoutByColumnHeader />
      }
      {(state[GROUP_BY] !== restProps.column.name && state[BREAKOUT_BY] !== restProps.column.name && state[GROUP_BY_STICKY] !== restProps.column.name) &&
        <>{restProps.children}</>
      }
    </>
  )
}

export default CustomTableHeaderCell
