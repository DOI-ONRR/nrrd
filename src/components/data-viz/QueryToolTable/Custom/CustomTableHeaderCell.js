import React, { useContext } from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
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

import CustomTableHeaderSortLabel from './CustomTableHeaderSortLabel'

import { DataFilterContext } from '../../../../stores/data-filter-store'

const CustomTableHeaderCell = ({ getMessage, onAddColumn, onRemoveColumn, groupByOptions, breakoutByOptions, ...restProps }) => {
  const { state } = useContext(DataFilterContext)

  const GroupByStickyColumnHeader = () => {
    return (
      <Grid container alignItems="flex-start">
        <Grid item xs={(onAddColumn) ? 9 : 12}>
          <Box mt={2} textAlign={'end'}>
            {restProps.column.title}
          </Box>
        </Grid>
        {onAddColumn &&
          <Grid item xs={3}>
            <BaseButtonInput onClick={onAddColumn} styleType={'link'} style={{ top: '-8px' }}>
              + Add column
            </BaseButtonInput>
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
            <BaseButtonInput onClick={onAddColumn} styleType={'link'} style={{ top: '-8px' }}>
              + Add column
            </BaseButtonInput>
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
            <BaseButtonInput onClick={onRemoveColumn} styleType={'link'} style={{ top: '-8px' }}>
              x Remove
            </BaseButtonInput>
          </Grid>
        }
      </Grid>
    )
  }

  return (
    <>
      {state[GROUP_BY_STICKY] === restProps.column.name &&
        <CustomTableHeaderSortLabel {...restProps.children.props}><GroupByStickyColumnHeader /></CustomTableHeaderSortLabel>
      }
      {state[GROUP_BY] === restProps.column.name &&
        <CustomTableHeaderSortLabel {...restProps.children.props}><GroupByColumnHeader /></CustomTableHeaderSortLabel>
      }
      {state[BREAKOUT_BY] === restProps.column.name &&
        <CustomTableHeaderSortLabel {...restProps.children.props}><BreakoutByColumnHeader /></CustomTableHeaderSortLabel>
      }
      {(state[GROUP_BY] !== restProps.column.name && state[BREAKOUT_BY] !== restProps.column.name && state[GROUP_BY_STICKY] !== restProps.column.name) &&
        <>{restProps.children}</>
      }
    </>
  )
}

export default CustomTableHeaderCell
