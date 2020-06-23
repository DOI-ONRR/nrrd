
import React, { useContext, useEffect} from 'react'
import clsx from 'clsx'

import { DataFilterContext } from '../../../stores/data-filter-store'

import {
  DATA_TYPE,
  REVENUE,
  PRODUCTION,
  DISBURSEMENT,
  US_STATE,
  PERIOD,
  PERIOD_FISCAL_YEAR,
  PERIOD_CALENDAR_YEAR,
} from '../../../constants'
import {
  DataTypeSelectInput,
  LandTypeSelectInput,
  RevenueTypeSelectInput,
  UsStateSelectInput,
  CountySelectInput,
  OffshoreRegionSelectInput,
  CommoditySelectInput,
  RecipientSelectInput,
  SourceSelectInput,
  GroupBySelectInput,
  BreakoutBySelectInput
} from '../../inputs'

import BaseToolbar from '../BaseToolbar'
import YearRangeSelect from '../data-filters/YearRangeSelect'

import makeStyles from '@material-ui/core/styles/makeStyles'
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

const QueryTableToolbar = ({ label, ...props }) => {
  const { state, updateDataFilter } = useContext(DataFilterContext)
  if (!state) {
    throw new Error('Data Filter Context has an undefined state. Please verify you have the Data Filter Provider included in your page or component.')
  }
  state.dataType=(state.dataType) ? state.dataType : 'Revenue'
  const classes = useStyles()

  const [dataFilterToolbarOpen, setDataFilterToolbarOpen] = React.useState(true)

  const toggleDataFilterToolbar = event => {
    setDataFilterToolbarOpen(!dataFilterToolbarOpen)
  }

  const [dataGroupingToolbarOpen, setDataGroupingToolbarOpen] = React.useState(false)

  const toggleDataGroupingToolbar = event => {
    setDataGroupingToolbarOpen(!dataGroupingToolbarOpen)
  }


  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      updateDataFilter({ ...state, [PERIOD]: newPeriod })
    }
  }

  return (
    <>
      <BaseToolbar>
        <Box mt={2} mb={2}>
          <Grid container direction='row' justify='flex-start' alignItems='flex-end' spacing={1}>
            {label &&
            <Box mr={2} component='span'>
              <Typography variant="h1">{label}</Typography>
            </Box>
            }
            <DataTypeSelectInput defaultSelected={REVENUE} />
            <Box m={'8px'}>
              <ToggleButton
                value='open'
                aria-label="open data filters"
                selected={dataFilterToolbarOpen}
                onChange={toggleDataFilterToolbar}
                className={clsx({ [classes.filtersToggle]: dataFilterToolbarOpen })}
              >
                <FilterList />Filters
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
                <Build />Tools
              </ToggleButton>
            </Box>
            <Box m={'8px'}>
              <ToggleButtonGroup value={state[PERIOD]} exclusive onChange={handlePeriodChange} aria-label="period selection">
                <ToggleButton value={PERIOD_FISCAL_YEAR} aria-label="fiscal year" className={classes.toggleButton}>
                  <div style={{ wordBreak: 'normal', width: 'min-content', lineHeight: 'normal' }}>Fiscal year</div>
                </ToggleButton>
                <ToggleButton value={PERIOD_CALENDAR_YEAR} aria-label="calendar year" className={classes.toggleButton}>
                  <div style={{ wordBreak: 'normal', width: 'min-content', lineHeight: 'normal' }}>Calendar year</div>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
        </Box>
      </BaseToolbar>
      { dataFilterToolbarOpen &&
        <>
          {state[DATA_TYPE] === REVENUE &&
            <RevenueFilterToolbar />
          }
          {state[DATA_TYPE] === PRODUCTION &&
            <ProductionFilterToolbar />
          }
          {state[DATA_TYPE] === DISBURSEMENT &&
            <DisbursementFilterToolbar />
          }
        </>
      }
      { dataGroupingToolbarOpen &&
        <>
          {state[DATA_TYPE] === REVENUE &&
            <RevenueGroupingToolbar />
          }
          {state[DATA_TYPE] === PRODUCTION &&
            <ProductionGroupingToolbar />
          }
          {state[DATA_TYPE] === DISBURSEMENT &&
            <DisbursementGroupingToolbar />
          }
        </>
      }
    </>
  )
}

export default QueryTableToolbar

const RevenueFilterToolbar = () => {
  const { state } = useContext(DataFilterContext)
  const countyEnabled = (state[US_STATE] && (state[US_STATE].split(',').length === 1))
  return (
    <BaseToolbar borderColor={'rgba(0, 39, 168, 0.5)'} >
      <Box mt={2} mb={2}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <LandTypeSelectInput />
          </Grid>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <RevenueTypeSelectInput />
          </Grid>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <UsStateSelectInput />
          </Grid>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <CountySelectInput helperText={countyEnabled ? undefined : 'Select a single State to view County options.'} disabled={!countyEnabled} />
          </Grid>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <OffshoreRegionSelectInput />
          </Grid>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <CommoditySelectInput />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={12}>
            <YearRangeSelect />
          </Grid>
        </Grid>
      </Box>
    </BaseToolbar>
  )
}

const ProductionFilterToolbar = () => {
  const { state } = useContext(DataFilterContext)
  const countyEnabled = (state[US_STATE] && (state[US_STATE].split(',').length === 1))
  return (
    <BaseToolbar borderColor={'rgba(0, 39, 168, 0.5)'} >
      <Box mt={2} mb={2}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <LandTypeSelectInput />
          </Grid>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <UsStateSelectInput />
          </Grid>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <CountySelectInput helperText={countyEnabled ? undefined : 'Select a single State to view County options.'} disabled={!countyEnabled} />
          </Grid>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <OffshoreRegionSelectInput />
          </Grid>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <CommoditySelectInput />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={12}>
            <YearRangeSelect />
          </Grid>
        </Grid>
      </Box>
    </BaseToolbar>
  )
}

const DisbursementFilterToolbar = () => {
  const { state } = useContext(DataFilterContext)
  const countyEnabled = (state[US_STATE] && (state[US_STATE].split(',').length === 1))
  return (
    <BaseToolbar borderColor={'rgba(0, 39, 168, 0.5)'} >
      <Box mt={2} mb={2}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <RecipientSelectInput />
          </Grid>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <SourceSelectInput />
          </Grid>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <UsStateSelectInput defaultSelectAll={false} />
          </Grid>
          <Grid item xs={12} sm={4} md={3} xl={2}>
            <CountySelectInput helperText={countyEnabled ? undefined : 'Select a single State to view County options.'} disabled={!countyEnabled} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={12}>
            <YearRangeSelect />
          </Grid>
        </Grid>
      </Box>
    </BaseToolbar>
  )
}

const RevenueGroupingToolbar = () => {
  const dataTypeProp = { [DATA_TYPE]: REVENUE }
  return (
    <BaseToolbar borderColor={'rgba(188, 113, 0, 0.5)'}>
      <Box mt={2} mb={2}>
        <GroupBySelectInput {...dataTypeProp} />
        <BreakoutBySelectInput {...dataTypeProp} />
      </Box>
    </BaseToolbar>
  )
}
const ProductionGroupingToolbar = () => {
  const dataTypeProp = { [DATA_TYPE]: PRODUCTION }
  return (
    <BaseToolbar borderColor={'rgba(188, 113, 0, 0.5)'}>
      <Box mt={2} mb={2}>
        <GroupBySelectInput {...dataTypeProp} />
        <BreakoutBySelectInput {...dataTypeProp} />
      </Box>
    </BaseToolbar>
  )
}
const DisbursementGroupingToolbar = () => {
  const dataTypeProp = { [DATA_TYPE]: DISBURSEMENT }
  return (
    <BaseToolbar borderColor={'rgba(188, 113, 0, 0.5)'}>
      <Box mt={2} mb={2}>
        <GroupBySelectInput {...dataTypeProp} />
        <BreakoutBySelectInput {...dataTypeProp} />
      </Box>
    </BaseToolbar>
  )
}
