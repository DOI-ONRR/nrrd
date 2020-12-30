import React from 'react'

import {
  Box
} from '@material-ui/core'

import Grid from '@material-ui/core/Grid'

import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { makeStyles, useTheme } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  sortIcon: {
    fontSize: '30px',
    position: 'relative',
    right: 5
  },
  sortLabelContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    cursor: 'pointer'
  }
}))

const CustomTableHeaderSortLabel = ({ onSort, children, align, direction }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Grid container direction={(align === 'right') ? 'row-reverse' : 'row'} spacing={0} style={{ height: '75px' }}>
      <Grid item>
        <Grid container direction="column" alignItems="center" spacing={0}>
          <Grid item>
            <SortingUpIcon direction={direction} />
          </Grid>
          <Grid item>
            { children }
          </Grid>
          <Grid item>
            <SortingDownIcon direction={direction} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
/*
    <span style={{ display: 'row-reverse' }}>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <SortingUpIcon direction={direction} />
        </Grid>
        <Grid item>
          { children }
        </Grid>
        <Grid item>
          <SortingDownIcon direction={direction} />
        </Grid>
      </Grid>
    </span>
*/
export default CustomTableHeaderSortLabel

const SortingUpIcon = ({ direction }) => {
  const theme = useTheme()
  return (
    <div style={{ textAlign: 'center', width: 'fit-content' }}>
      <ArrowDropUpIcon style={{ position: 'relative', top: '24px', color: (direction === 'asc') ? theme.palette.links.default : theme.palette.grey[300] }} />
    </div>
  )
}

const SortingDownIcon = ({ direction }) => {
  const theme = useTheme()
  return (
    <div style={{ textAlign: 'center', width: 'fit-content' }}>
      <ArrowDropDownIcon style={{ position: 'relative', top: '-15px', color: (direction === 'desc') ? theme.palette.links.default : theme.palette.grey[300] }} />
    </div>
  )
}
