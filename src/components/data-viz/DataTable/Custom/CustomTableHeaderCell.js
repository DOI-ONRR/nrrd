import React, { useContext } from 'react'

import makeStyles from '@material-ui/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import { Table } from '@devexpress/dx-react-grid-material-ui'
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

const useStyles = makeStyles(theme => ({
  cell: {
    borderRight: `1px solid ${ theme.palette.divider }`,
    backgroundColor: 'white',
    paddingTop: '2px;',
    paddingBottom: '2px;'
  }
}))

const CustomTableHeaderCell = ({ getMessage, onAddColumn, onRemoveColumn, ...restProps }) => {
  const theme = useTheme()
  const styles = useStyles(theme)
  const { state } = useContext(DataFilterContext)

  const GroupByColumnHeader = () => {
    return (
      <Grid container alignItems="flex-start">
        <Grid item xs={(onAddColumn) ? 7 : 12}>
          <GroupBySelectInput />
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
          <BreakoutBySelectInput />
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
