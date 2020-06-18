import React, { useContext } from 'react'
import clsx from 'clsx'

import { DataFilterContext } from '../../../stores/data-filter-store'

import {
  DATA_TYPES,
  DATA_TYPE,
  LAND_TYPE,
  COMMODITY,
  US_STATE,
  REVENUE_TYPE,
  PERIOD,
  PERIOD_FISCAL_YEAR,
  PERIOD_CALENDAR_YEAR
} from '../../../constants'
import BaseSelectInput from '../../inputs/BaseSelectInput'
import WithDataFilterQuery from '../../inputs/withDataFilterQuery'
import BaseToolbar from '../BaseToolbar'
import DataTableGroupingToolbar from '../../data-viz/DataTable/DataTableGroupingToolbar'
import YearRangeSelect from '../data-filters/YearRangeSelect'

import makeStyles from '@material-ui/core/styles/makeStyles'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'

import Build from '@material-ui/icons/Build'
import FilterList from '@material-ui/icons/FilterList'

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
    color: theme.palette.grey[700],
    fontSize: theme.typography.h6.fontSize,
    boxShadow: 'none',
    '& svg > *:first-child': {
      fontSize: '100px',
    },
    '& span': {
      flexDirection: 'column'
    },
  },
  toggleButton: {
    display: 'block',
    '& div': {
      fontSize: theme.typography.h6.fontSize,
    },
  },
  filtersToggle: {
    borderBottom: '5px solid rgba(0, 39, 168)',
    opacity: '0.5',
  },
  toolsToggle: {
    borderBottom: '5px solid rgba(188, 113, 0)',
    opacity: '0.5',
  },
  hide: {
    display: 'none',
  },
}))

const QueryTableToolbar = () => {
  const { state, updateDataFilter } = useContext(DataFilterContext)
  if (!state) {
    throw new Error('Data Filter Context has an undefined state. Please verify you have the Data Filter Provider included in your page or component.')
  }
  const classes = useStyles()

  const [dataFilterToolbarOpen, setDataFilterToolbarOpen] = React.useState(false)

  const toggleDataFilterToolbar = event => {
    setDataFilterToolbarOpen(!dataFilterToolbarOpen)
  }

  const [dataGroupingToolbarOpen, setDataGroupingToolbarOpen] = React.useState(false)

  const toggleDataGroupingToolbar = event => {
    setDataGroupingToolbarOpen(!dataGroupingToolbarOpen)
  }

  const [period, setPeriod] = React.useState(state[PERIOD])

  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod)
      updateDataFilter({ ...state, [PERIOD]: newPeriod })
    }
  }

  return (
    <>
      <BaseToolbar>
        <BaseSelectInput label='Data type' data={DATA_TYPES.map((item, index) => ({ option: item, default: (index === 0) }))} dataFilterKey={DATA_TYPE} />
        <Box m={'8px'}>
          <ToggleButton
            value='open'
            aria-label="open data filters"
            selected={dataFilterToolbarOpen}
            onChange={toggleDataFilterToolbar}
            className={clsx({ [classes.filtersToggle]: dataFilterToolbarOpen })}
          >
            <FilterList fontSize="medium" />Filters
          </ToggleButton>
        </Box>
        <Box m={'8px'}>
          <ToggleButton
            value='open'
            aria-label="open data filters"
            selected={dataGroupingToolbarOpen}
            onChange={toggleDataGroupingToolbar}
            className={clsx({ [classes.toolsToggle]: dataGroupingToolbarOpen })}
          >
            <Build fontSize="medium" />Tools
          </ToggleButton>
        </Box>
        <Box m={'8px'}>
          <ToggleButtonGroup value={period} exclusive onChange={handlePeriodChange} aria-label="period selection">
            <ToggleButton value={PERIOD_FISCAL_YEAR} aria-label="fiscal year" className={classes.toggleButton}>
              <div style={{ wordBreak: 'normal', width: 'min-content', lineHeight: 'normal' }}>Fiscal year</div>
            </ToggleButton>
            <ToggleButton value={PERIOD_CALENDAR_YEAR} aria-label="calendar year" className={classes.toggleButton}>
              <div style={{ wordBreak: 'normal', width: 'min-content', lineHeight: 'normal' }}>Calendar year</div>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </BaseToolbar>
      { dataFilterToolbarOpen &&
        <RevenueMainToolbar />
      }
      { dataGroupingToolbarOpen &&
        <RevenueGroupingToolbar />
      }
    </>
  )
}

export default QueryTableToolbar

const RevenueMainToolbar = () => {
  return (
    <BaseToolbar borderColor={'rgba(0, 39, 168, 0.5)'} >
      {WithDataFilterQuery(BaseSelectInput, LAND_TYPE, { selectType: 'Single', label: 'Land type' })}
      {WithDataFilterQuery(BaseSelectInput, REVENUE_TYPE, { selectType: 'Single', label: 'Revenue type' })}
      {WithDataFilterQuery(BaseSelectInput, US_STATE, { selectType: 'Single', label: 'State' })}
      {WithDataFilterQuery(BaseSelectInput, COMMODITY, { selectType: 'Single', label: 'Commodity' })}
      {WithDataFilterQuery(BaseSelectInput, US_STATE, { selectType: 'Single', label: 'State' })}
      <YearRangeSelect />
    </BaseToolbar>
  )
}

const RevenueGroupingToolbar = () => {
  return (
    <BaseToolbar borderColor={'rgba(188, 113, 0, 0.5)'}><DataTableGroupingToolbar /></BaseToolbar>
  )
}

/*  */
