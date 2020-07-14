
import React, { useContext } from 'react'
import clsx from 'clsx'

import { DataFilterContext, DownloadContext } from '../../../stores'

import { downloadWorkbook } from '../../../js/utils'

import {
  DATA_TYPE,
  REVENUE,
  PRODUCTION,
  DISBURSEMENT,
  US_STATE,
  PERIOD,
  PERIOD_FISCAL_YEAR,
  PERIOD_CALENDAR_YEAR,
  EXCEL,
  CSV,
  DOWNLOAD_DATA_TABLE,
  STATE_OFFSHORE_NAME
} from '../../../constants'

import {
  DataTypeSelectInput,
  LandTypeSelectInput,
  RevenueTypeSelectInput,
  UsStateSelectInput,
  CountySelectInput,
  OffshoreRegionSelectInput,
  CommoditySelectInput,
  ProductSelectInput,
  RecipientSelectInput,
  SourceSelectInput,
  FilterToggleInput,
  StateOffshoreSelectInput
} from '../../inputs'

import BaseButtonInput from '../../inputs/BaseButtonInput'
import BaseToolbar from '../BaseToolbar'
import YearRangeSelect from '../data-filters/YearRangeSelect'

import makeStyles from '@material-ui/core/styles/makeStyles'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'

import FilterList from '@material-ui/icons/FilterList'
import CalendarToday from '@material-ui/icons/CalendarToday'
import GetApp from '@material-ui/icons/GetApp'

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
  const downloadDataContext = useContext(DownloadContext)
  if (!state) {
    throw new Error('Data Filter Context has an undefined state. Please verify you have the Data Filter Provider included in your page or component.')
  }
  state.dataType = (state.dataType) ? state.dataType : 'Revenue'
  const classes = useStyles()

  const [dataFilterToolbarOpen, setDataFilterToolbarOpen] = React.useState(true)

  const toggleDataFilterToolbar = event => {
    setPeriodToolbarOpen(false)
    setDownloadToolbarOpen(false)
    setDataFilterToolbarOpen(!dataFilterToolbarOpen)
  }

  const [periodToolbarOpen, setPeriodToolbarOpen] = React.useState(false)

  const togglePeriodToolbar = event => {
    setDataFilterToolbarOpen(false)
    setDownloadToolbarOpen(false)
    setPeriodToolbarOpen(!periodToolbarOpen)
  }

  const [downloadToolbarOpen, setDownloadToolbarOpen] = React.useState(false)

  const toggleDownloadToolbar = event => {
    setDataFilterToolbarOpen(false)
    setPeriodToolbarOpen(false)
    setDownloadToolbarOpen(!downloadToolbarOpen)
  }

  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      updateDataFilter({ ...state, [PERIOD]: newPeriod })
    }
  }

  const handleDownloadExcel = event => {
    console.log(downloadDataContext.state)
    if (downloadDataContext.state[DOWNLOAD_DATA_TABLE] && state[DATA_TYPE]) {
      downloadWorkbook(
        EXCEL,
        state[DATA_TYPE],
        state[DATA_TYPE],
        downloadDataContext.state[DOWNLOAD_DATA_TABLE].cols,
        downloadDataContext.state[DOWNLOAD_DATA_TABLE].rows)
    }
  }

  const handleDownloadCsv = event => {
    if (downloadDataContext.state[DOWNLOAD_DATA_TABLE] && state[DATA_TYPE]) {
      downloadWorkbook(
        CSV,
        state[DATA_TYPE],
        state[DATA_TYPE],
        downloadDataContext.state[DOWNLOAD_DATA_TABLE].cols,
        downloadDataContext.state[DOWNLOAD_DATA_TABLE].rows)
    }
  }

  return (
    <>
      <BaseToolbar>
        <DataTypeSelectInput />
        <FilterToggleInput
          value='open'
          aria-label="open data filters"
          defaultSelected={dataFilterToolbarOpen}
          selected={dataFilterToolbarOpen}
          onChange={toggleDataFilterToolbar}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Box component={'div'} fontSize="0.8rem" fontWeight={'400'} lineHeight={'1rem'}><FilterList /></Box>
            </Grid>
            <Grid item xs={12}>
              <Box component={'div'} fontSize="0.8rem" fontWeight={'400'} lineHeight={'1rem'}>Filters</Box>
            </Grid>
          </Grid>
        </FilterToggleInput>
        <FilterToggleInput
          value='open'
          aria-label="open period toolbar"
          selected={periodToolbarOpen}
          defaultSelected={periodToolbarOpen}
          onChange={togglePeriodToolbar}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Box component={'div'} fontSize="0.8rem" fontWeight={'400'} lineHeight={'1rem'}><CalendarToday /></Box>
            </Grid>
            <Grid item xs={12}>
              <Box component={'div'} fontSize="0.8rem" fontWeight={'400'} lineHeight={'1rem'}>Period</Box>
            </Grid>
          </Grid>
        </FilterToggleInput>
        <FilterToggleInput
          value='open'
          aria-label="open download toolbar"
          selected={downloadToolbarOpen}
          defaultSelected={downloadToolbarOpen}
          onChange={toggleDownloadToolbar}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Box component={'div'} fontSize="0.8rem" fontWeight={'400'} lineHeight={'1rem'}><GetApp /></Box>
            </Grid>
            <Grid item xs={12}>
              <Box component={'div'} fontSize="0.8rem" fontWeight={'400'} lineHeight={'1rem'}>Download</Box>
            </Grid>
          </Grid>
        </FilterToggleInput>
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
      { periodToolbarOpen &&
      <BaseToolbar isSecondary={true}>
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
        <YearRangeSelect />
      </BaseToolbar>
      }
      { downloadToolbarOpen &&
      <BaseToolbar isSecondary={true}>
        <Box mr={2}>
          <BaseButtonInput onClick={handleDownloadExcel} variant='outlined' label={'Download Excel'} styleType={'text'} />
        </Box>
        <BaseButtonInput onClick={handleDownloadCsv} variant='outlined' label={'Download Csv'} styleType={'text'} />
      </BaseToolbar>
      }
    </>
  )
}

export default QueryTableToolbar

const isCountyEnabled = ({ state }) => (state[STATE_OFFSHORE_NAME] &&
  (state[STATE_OFFSHORE_NAME].split(',').length === 1) &&
  (!state[STATE_OFFSHORE_NAME].includes('Offshore')) &&
  (!state[STATE_OFFSHORE_NAME].includes('Not')))

const RevenueFilterToolbar = () => {
  const countyEnabled = isCountyEnabled(useContext(DataFilterContext))
  return (
    <BaseToolbar isSecondary={true} >
      <LandTypeSelectInput />
      <RevenueTypeSelectInput />
      <StateOffshoreSelectInput />
      <CountySelectInput helperText={countyEnabled ? undefined : 'Select a single State to view County options.'} disabled={!countyEnabled} />
      <CommoditySelectInput />
    </BaseToolbar>
  )
}

const ProductionFilterToolbar = () => {
  const countyEnabled = isCountyEnabled(useContext(DataFilterContext))
  return (
    <BaseToolbar isSecondary={true} >
      <LandTypeSelectInput />
      <StateOffshoreSelectInput />
      <CountySelectInput helperText={countyEnabled ? undefined : 'Select a single State to view County options.'} disabled={!countyEnabled} />
      <ProductSelectInput />
      <YearRangeSelect />
    </BaseToolbar>
  )
}

const DisbursementFilterToolbar = () => {
  const countyEnabled = isCountyEnabled(useContext(DataFilterContext))
  return (
    <BaseToolbar isSecondary={true} >
      <RecipientSelectInput />
      <SourceSelectInput />
      <StateOffshoreSelectInput defaultSelectAll={false} />
      <CountySelectInput helperText={countyEnabled ? undefined : 'Select a single State to view County options.'} disabled={!countyEnabled} />
      <YearRangeSelect />
    </BaseToolbar>
  )
}
