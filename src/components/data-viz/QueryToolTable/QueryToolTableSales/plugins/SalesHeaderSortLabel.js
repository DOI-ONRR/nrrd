import React from 'react'

import Grid from '@material-ui/core/Grid'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import makeStyles from '@material-ui/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'
import GlossaryTerm from '../../../../GlossaryTerm/GlossaryTerm'

const SalesHeaderSortLabel = ({ onSort, children, align, direction, column, ...restProps }) => {
  const itemStyles = makeStyles(() => ({
    root: {
      marginTop: '0.25em !important',
      marginBottom: '0.25em !important'
    }
  }))

  return (
    <Grid
      container
      justifyContent='center'
      spacing={0}
      style={{ cursor: 'pointer' }}>
      <Grid item xs={12} noWrap>
        <Grid container direction="column" alignItems="center" spacing={0}>
          <Grid item onClick={onSort}>
            <SortingUpIcon direction={direction} />
          </Grid>
          <Grid item classes={itemStyles()}>
            {column.name !== 'calendarYear'
              ? <GlossaryTerm termKey={column.title}>{ children }</GlossaryTerm>
              : children
            }
          </Grid>
          <Grid item onClick={onSort}>
            <SortingDownIcon direction={direction} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SalesHeaderSortLabel

const SortingUpIcon = ({ direction }) => {
  const theme = useTheme()
  return (
    <div style={{ textAlign: 'center', width: 'fit-content', height: '15px' }}>
      <ArrowDropUpIcon style={{ position: 'relative', color: (direction === 'asc') ? theme.palette.links.default : theme.palette.grey[300] }} />
    </div>
  )
}

const SortingDownIcon = ({ direction }) => {
  const theme = useTheme()
  return (
    <div style={{ textAlign: 'center', width: 'fit-content', height: '10px' }}>
      <ArrowDropDownIcon style={{ position: 'relative', top: '-15px', color: (direction === 'desc') ? theme.palette.links.default : theme.palette.grey[300] }} />
    </div>
  )
}
