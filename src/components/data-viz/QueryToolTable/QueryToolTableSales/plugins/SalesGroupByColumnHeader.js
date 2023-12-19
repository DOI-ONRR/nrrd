import React, { useContext } from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import { BreakoutBySelectInput } from '../../../../inputs'
import BaseButtonInput from '../../../../inputs/BaseButtonInput'
import SalesHeaderSortLabel from './SalesHeaderSortLabel'
import { DataFilterContext } from '../../../../../stores'
import { BREAKOUT_BY } from '../../../../../constants'
import makeStyles from '@material-ui/styles/makeStyles'

const SalesGroupByColumnHeader = ({ onAddColumn, onRemoveColumn, groupByOptions, breakoutByOptions, ...props }) => {
  const { state } = useContext(DataFilterContext)
  const GroupByStickyColumnHeader = () => {
    return (
      <Grid container alignItems="flex-start">
        <Grid item xs={(onAddColumn && !state[BREAKOUT_BY]) ? 9 : 12}>
          <Box mt={(onAddColumn && !state[BREAKOUT_BY]) ? 2 : 0} textAlign={'end'}>
            {props.column.title}
          </Box>
        </Grid>
        {onAddColumn && !state[BREAKOUT_BY] &&
          <Grid item xs={3}>
            <BaseButtonInput onClick={onAddColumn} styleType={'link'} style={{ top: '-8px' }}>
              + Add column
            </BaseButtonInput>
          </Grid>
        }
      </Grid>
    )
  }

  const BreakoutByColumnHeader = () => {
    const useStyles = makeStyles(() => ({
      removeButtonContainer: {
        textAlign: 'left',
        height: '0.85em'
      },
      removeButton: {
        top: '-1em',
        marginLeft: '0.5em'
      }
    }))
    const classes = useStyles()
    return (
      <Grid container alignItems="flex-start" spacing={0}>
        <Grid item xs={12}>
          <BreakoutBySelectInput data={breakoutByOptions} />
        </Grid>
        {onRemoveColumn &&
          <Grid item xs={12} alignContent='left' className={classes.removeButtonContainer}>
            <BaseButtonInput onClick={onRemoveColumn} styleType={'link'} className={classes.removeButton}>
              x Remove
            </BaseButtonInput>
          </Grid>
        }
      </Grid>
    )
  }

  return (
    <React.Fragment>
      {props.column.name === 'calendarYear' &&
        <SalesHeaderSortLabel {...props.children.props}><GroupByStickyColumnHeader /></SalesHeaderSortLabel>
      }
      {props.column.name === state[BREAKOUT_BY] &&
        <SalesHeaderSortLabel {...props.children.props}><BreakoutByColumnHeader /></SalesHeaderSortLabel>
      }
      {props.column.name !== 'calendarYear' && props.column.name !== state[BREAKOUT_BY] &&
        <>{props.children}</>
      }
    </React.Fragment>
  )
}

export default SalesGroupByColumnHeader
