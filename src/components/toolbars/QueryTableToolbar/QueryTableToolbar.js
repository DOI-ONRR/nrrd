
import React, { useContext } from 'react'

import { DataFilterContext, DownloadContext } from '../../../stores'

import { downloadWorkbook } from '../../../js/utils'

import DataTypeFilter from '../../inputs/filters/DataTypeFilter'
import PeriodFilter from '../../inputs/filters/PeriodFilter'
import FiscalYearFilter from '../../inputs/filters/FiscalYearFilter'
import CalendarYearFilter from '../../inputs/filters/CalendarYearFilter'
import CommodityFilter from '../../inputs/filters/CommodityFilter'
import CompanyNameFilter from '../../inputs/filters/CompanyNameFilter'
import RevenueTypeFilter from '../../inputs/filters/RevenueTypeFilter'
import StateOffshoreFilter from '../../inputs/filters/StateOffshoreFilter'

import {
  QK_QUERY_TOOL,
  DATA_TYPE,
  REVENUE,
  PRODUCTION,
  DISBURSEMENT,
  PERIOD_FISCAL_YEAR,
  PERIOD_CALENDAR_YEAR,
  EXCEL,
  CSV,
  DOWNLOAD_DATA_TABLE,
  PERIOD_TYPES,
  REVENUE_BY_COMPANY,
  PERIOD_MONTHLY,
  PERIOD
} from '../../../constants'

import {
  LandTypeSelectInput,
  CommoditySelectInput,
  ProductSelectInput,
  RecipientSelectInput,
  SourceSelectInput,
  FilterToggleInput,
  PeriodSelectInput,
  StateNameSelectInput
} from '../../inputs'

import ClearAllFiltersBtn from '../../inputs/ClearAllFiltersBtn'

import {
  FilterTableIconImg,
  IconDownloadBaseImg
} from '../../images'

import BaseToolbar from '../BaseToolbar'
import Link from '../../Link'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import Box from '@material-ui/core/Box'

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
  toolsWrapperFirst: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderLeft: `1px solid ${ theme.palette.grey[400] }`,
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(2),
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
  const { state } = useContext(DataFilterContext)
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

  // eslint-disable-next-line no-unused-vars
  const [dataFilterToolbarOpen, setDataFilterToolbarOpen] = React.useState(false)

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
          aria-label="open download toolbar"
          selected={downloadToolbarOpen}
          defaultSelected={downloadToolbarOpen}
          onChange={toggleDownloadToolbar}>
          <IconDownloadBaseImg className={ `${ classes.toolbarIcon }, ${ classes.exploreDataIcon }` } style={ { fill: classes.toolbarIcon.fill } }/> <span>Download</span>
        </FilterToggleInput>
      </BaseToolbar>
      { queryDataToolbarOpen &&
        <BaseToolbar isSecondary={true}>
          <Box className={classes.toolsWrapperFirst}>
            <DataTypeFilter useDataTypesPlus={true} />
          </Box>
          <Box className={classes.toolsWrapper}>
            {state[DATA_TYPE] === DISBURSEMENT
              ? <PeriodSelectInput data={PERIOD_TYPES.filter(type => type !== PERIOD_CALENDAR_YEAR)}/>
              : <PeriodFilter queryKey={QK_QUERY_TOOL} showClearSelected={false} />
            }
            {state.period === PERIOD_FISCAL_YEAR &&
              <FiscalYearFilter queryKey={QK_QUERY_TOOL} showClearSelected={false} />
            }
            {(state.period === PERIOD_CALENDAR_YEAR || state.period === PERIOD_MONTHLY) &&
              <CalendarYearFilter queryKey={QK_QUERY_TOOL} showClearSelected={false} />
            }
          </Box>
          <Box className={classes.toolsWrapper}>
            {state[DATA_TYPE] === REVENUE &&
              <RevenueFilterToolbar />
            }
            {state[DATA_TYPE] === PRODUCTION &&
              <ProductionFilterToolbar period={state[PERIOD]} />
            }
            {state[DATA_TYPE] === DISBURSEMENT &&
              <DisbursementFilterToolbar />
            }
            {state[DATA_TYPE] === REVENUE_BY_COMPANY &&
              <RevenueByCompanyFilterToolbar />
            }
            <ClearAllFiltersBtn style={{ margin: '8px' }}/>
          </Box>
        </BaseToolbar>
      }
      { downloadToolbarOpen &&
      <BaseToolbar isSecondary={true}>
        <Box mr={2}>
          <Link href={'#'} onClick={handleDownloadExcel} linkType='DownloadXls'>Download filtered data (Excel)</Link>
        </Box>
        <Box mr={2}>
          <Link href={'#'} onClick={handleDownloadCsv} linkType='DownloadCsv'>Download filtered data (csv)</Link>
        </Box>
        <Box mr={2}>
          {state[DATA_TYPE] === REVENUE &&
            <Link href={'/downloads/federal-revenue-by-location/'} linkType='DownloadData'>Source file and documentation</Link>
          }
          {state[DATA_TYPE] === PRODUCTION &&
            <Link href={'/downloads/production/'} linkType='DownloadData'>Source file and documentation</Link>
          }
          {state[DATA_TYPE] === DISBURSEMENT &&
            <Link href={'/downloads/disbursements/'} linkType='DownloadData'>Source file and documentation</Link>
          }
          {state[DATA_TYPE] === REVENUE_BY_COMPANY &&
            <Link href={'/downloads/federal-revenue-by-company/'} linkType='DownloadData'>Source file and documentation</Link>
          }
        </Box>
      </BaseToolbar>
      }
    </>
  )
}

export default QueryTableToolbar

const RevenueFilterToolbar = () => {
  return (
    <>
      <LandTypeSelectInput />
      <RevenueTypeFilter queryKey={QK_QUERY_TOOL} selectType='Multi' defaultSelectAll={true}/>
      <StateOffshoreFilter queryKey={QK_QUERY_TOOL} selectType='Multi' defaultSelectAll={true}/>
      <CommoditySelectInput />
    </>
  )
}

const ProductionFilterToolbar = ({ period }) => {
  return (
    <>
      <LandTypeSelectInput />
      {period !== PERIOD_MONTHLY &&
        <StateOffshoreFilter queryKey={QK_QUERY_TOOL} selectType='Multi' defaultSelectAll={true}/>
      }
      <ProductSelectInput />
    </>
  )
}

const DisbursementFilterToolbar = () => {
  return (
    <>
      <RecipientSelectInput />
      <SourceSelectInput />
      <StateNameSelectInput defaultSelectAll={false} />
    </>
  )
}

const RevenueByCompanyFilterToolbar = () => {
  return (
    <>
      <CompanyNameFilter queryKey={QK_QUERY_TOOL} style={{ width: '300px' }} label={'Search companies'}/>
      <CommodityFilter queryKey={QK_QUERY_TOOL} showClearSelected={false} selectType='Multi' defaultSelectAll={true} />
      <RevenueTypeFilter queryKey={QK_QUERY_TOOL} selectType='Multi' defaultSelectAll={true}/>
    </>
  )
}
