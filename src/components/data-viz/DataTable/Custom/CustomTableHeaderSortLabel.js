import React from 'react'

import {
  Box
} from '@material-ui/core'

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
    alignItems: 'flex-end',
    width: '100%',
    cursor: 'pointer'
  }
}))

const CustomTableHeaderSortLabel = ({ onSort, children, direction }) => {
  const classes = useStyles()
  return (
    <Box onClick={onSort} className={classes.sortLabelContainer}>
      <SortingUpIcon direction={direction} />
      {children}
      <SortingDownIcon direction={direction} />
    </Box>
  )
}

export default CustomTableHeaderSortLabel

const SortingUpIcon = ({ direction }) => {
  const classes = useStyles()
  const theme = useTheme()
  return <ArrowDropUpIcon className={classes.sortIcon} style={{ color: (direction === 'asc') ? theme.palette.links.default : theme.palette.grey[300], top: 15 }} />
}

const SortingDownIcon = ({ direction }) => {
  const classes = useStyles()
  const theme = useTheme()
  return <ArrowDropDownIcon className={classes.sortIcon} style={{ color: (direction === 'desc') ? theme.palette.links.default : theme.palette.grey[300], top: -15 }} />
}
