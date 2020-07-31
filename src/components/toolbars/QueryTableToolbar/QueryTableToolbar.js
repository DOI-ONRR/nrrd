
import React, { useContext } from 'react'

import { DataFilterContext, DownloadContext } from '../../../stores'

import { downloadWorkbook } from '../../../js/utils'

import {
  DATA_TYPE,
  REVENUE,
  PRODUCTION,
  DISBURSEMENT,
  PERIOD_FISCAL_YEAR,
  PERIOD_CALENDAR_YEAR,
  EXCEL,
  CSV,
  DOWNLOAD_DATA_TABLE,
  STATE_OFFSHORE_NAME,
  PERIOD_TYPES

} from '../../../constants'

import {
  DataTypeSelectInput,
  LandTypeSelectInput,
  RevenueTypeSelectInput,
  CountySelectInput,
  CommoditySelectInput,
  ProductSelectInput,
  RecipientSelectInput,
  SourceSelectInput,
  FilterToggleInput,
  StateOffshoreSelectInput,
  PeriodSelectInput,
  FiscalYearSlider,
  CalendarYearSlider
} from '../../inputs'

import BaseButtonInput from '../../inputs/BaseButtonInput'

import {
  FilterTableIconImg,
  IconDownloadBaseImg,
  IconDownloadXlsImg,
  IconDownloadCsvImg
} from '../../images'

import BaseToolbar from '../BaseToolbar'
import Link from '../../Link'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import Box from '@material-ui/core/Box'

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
  toolsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderLeft: `1px solid ${ theme.palette.grey[400] }`,
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(2),
    width: '-webkit-fill-available'
  },
  hide: {
    display: 'none',
  },
  toolbarIcon: {
    fill: theme.palette.links.default,
    width: '.75em',
    height: '.75em',
    marginRight: '.25em',
  },
  exploreDataIcon: {
    width: 23,
    height: 23,
    maxHeight: 'inherit !important',
    maxWidth: 'inherit !important',
  },
}))

const QueryTableToolbar = ({ label, ...props }) => {
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const downloadDataContext = useContext(DownloadContext)
  if (!state) {
    throw new Error('Data Filter Context has an undefined state. Please verify you have the Data Filter Provider included in your page or component.')
  }
  state.dataType = (state.dataType) ? state.dataType : 'Revenue'
  const theme = useTheme()
  const classes = useStyles(theme)

  const [queryDataToolbarOpen, setQueryDataToolbarOpen] = React.useState(true)

  const toggleQueryDataToolbar = event => {
    setDownloadToolbarOpen(false)
    setDataFilterToolbarOpen(false)
    setQueryDataToolbarOpen(!queryDataToolbarOpen)
  }

  const [dataFilterToolbarOpen, setDataFilterToolbarOpen] = React.useState(false)

  const toggleDataFilterToolbar = event => {
    setDownloadToolbarOpen(false)
    setQueryDataToolbarOpen(false)
    setDataFilterToolbarOpen(!dataFilterToolbarOpen)
  }

  const [downloadToolbarOpen, setDownloadToolbarOpen] = React.useState(false)

  const toggleDownloadToolbar = event => {
    setDataFilterToolbarOpen(false)
    setQueryDataToolbarOpen(false)
    setDownloadToolbarOpen(!downloadToolbarOpen)
  }

  const handleDownloadExcel = event => {
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
        <FilterToggleInput
          value='open'
          aria-label="open query data tools"
          defaultSelected={queryDataToolbarOpen}
          selected={queryDataToolbarOpen}
          onChange={toggleQueryDataToolbar}>
          <FilterTableIconImg className={ `${ classes.toolbarIcon }, ${ classes.exploreDataIcon }` } /><span>Query data</span>
        </FilterToggleInput>
        <FilterToggleInput
          value='open'
          aria-label="open data filters"
          defaultSelected={dataFilterToolbarOpen}
          selected={dataFilterToolbarOpen}
          onChange={toggleDataFilterToolbar}>
          <FilterList className={ `${ classes.toolbarIcon }, ${ classes.exploreDataIcon }` }/> <span>More filters</span>
        </FilterToggleInput>
        <FilterToggleInput
          value='open'
          aria-label="open download toolbar"
          selected={downloadToolbarOpen}
          defaultSelected={downloadToolbarOpen}
          onChange={toggleDownloadToolbar}>
          <IconDownloadBaseImg className={ `${ classes.toolbarIcon }, ${ classes.exploreDataIcon }` } style={ { fill: classes.toolbarIcon.fill } }/> <span>Download</span>
        </FilterToggleInput>
      </BaseToolbar>
      { queryDataToolbarOpen &&
        <BaseToolbar isSecondary={true}>
          <Box>
            <DataTypeSelectInput />
          </Box>
          <Box className={classes.toolsWrapper}>
            {state[DATA_TYPE] === DISBURSEMENT
              ? <PeriodSelectInput data={PERIOD_TYPES.filter(type => type !== PERIOD_CALENDAR_YEAR)}/>
              : <PeriodSelectInput />
            }
            {state.period === PERIOD_FISCAL_YEAR &&
              <FiscalYearSlider />
            }
            {state.period === PERIOD_CALENDAR_YEAR &&
              <CalendarYearSlider />
            }
          </Box>
        </BaseToolbar>
      }
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
      { downloadToolbarOpen &&
      <BaseToolbar isSecondary={true}>
        <Box mr={2}>
          <Link href={'#'} onClick={handleDownloadExcel} linkType='DownloadXls'>Download filterd data (Excel)</Link>
        </Box>
        <Box mr={2}>
          <Link href={'#'} onClick={handleDownloadCsv} linkType='DownloadCsv'>Download filterd data (csv)</Link>
        </Box>
        <Box mr={2}>
          {state[DATA_TYPE] === REVENUE &&
            <Link href={'./downloads/#Revenue'} linkType='DownloadData'>Source file and documentation</Link>
          }
          {state[DATA_TYPE] === PRODUCTION &&
            <Link href={'./downloads/#Production'} linkType='DownloadData'>Source file and documentation</Link>
          }
          {state[DATA_TYPE] === DISBURSEMENT &&
            <Link href={'./downloads/#Disbursements'} linkType='DownloadData'>Source file and documentation</Link>
          }
        </Box>
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
    </BaseToolbar>
  )
}
