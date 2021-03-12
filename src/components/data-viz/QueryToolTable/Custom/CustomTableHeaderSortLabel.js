import React, { useContext } from 'react'

import Grid from '@material-ui/core/Grid'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { useTheme } from '@material-ui/styles'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import {
  ALL_YEARS,
  PERIOD,
  DATA_TYPE
} from '../../../../constants'

const CustomTableHeaderSortLabel = ({ onSort, children, align, direction, ...restProps }) => {
  const { state } = useContext(DataFilterContext)

  const TrendLabel = () => {
    return (
      <div style={{ textAlign: 'center', lineHeight: '1.5rem' }}>
        <div>Trend</div>
        <div style={{ fontSize: '1rem' }}>{ALL_YEARS[state[DATA_TYPE]][state[PERIOD]]?.length} years</div>
      </div>
    )
  }
  return (
    <>
      {restProps.column.name === 'Trend'
        ? <TrendLabel />
        : <Grid container direction={(align === 'right') ? 'row-reverse' : 'row'} spacing={0} style={{ cursor: 'pointer' }}>
          <Grid item>
            <Grid container direction="column" alignItems="center" spacing={0}>
              <Grid item onClick={onSort}>
                <SortingUpIcon direction={direction} />
              </Grid>
              <Grid item>
                { children }
              </Grid>
              <Grid item onClick={onSort}>
                <SortingDownIcon direction={direction} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
    </>
  )
}

export default CustomTableHeaderSortLabel

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
