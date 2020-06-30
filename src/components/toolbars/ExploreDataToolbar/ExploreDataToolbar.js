import React, { useContext, useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { navigate } from '@reach/router'

import { DataFilterContext } from '../../../stores/data-filter-store'
import BaseToolbar from '../BaseToolbar'

import {
  Box,
  Grid
} from '@material-ui/core'

import {
  makeStyles
} from '@material-ui/styles'

import MapIcon from '@material-ui/icons/Map'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import {
  CommoditySelectInput,
  DataTypeSelectInput,
  FilterToggleInput,
  MapLevelToggleInput,
  PeriodSelectInput,
  OffshoreRegionSwitchInput
} from '../../inputs'

import YearSlider from '../../sections/ExploreData/YearSlider'

import MapControlToggle from '../../inputs/MapControlToggle'

import {
  COMMODITY,
  COUNTIES,
  COUNTY,
  DATA_FILTER_CONSTANTS as DFC,
  DATA_TYPE,
  DISBURSEMENT,
  PERIOD,
  PRODUCTION,
  REVENUE,
  US_STATE,
  OFFSHORE_REGIONS
} from '../../../constants'

import CONSTANTS from '../../../js/constants'

const EXPLORE_DATA_TOOLBAR_OPTIONS = {
  [DATA_TYPE]: [
    { value: REVENUE, option: 'Revenue' },
    { value: PRODUCTION, option: 'Production' },
    { value: DISBURSEMENT, option: 'Disbursements' },
  ],
  [PERIOD]: [
    { value: CONSTANTS.FISCAL_YEAR, option: 'Fiscal year' },
    // { value: CONSTANTS.CALENDAR_YEAR, option: 'Calendar year' },
    // { value: CONSTANTS.MONTHLY, option: 'Monthly' }
  ],
  [COUNTIES]: [
    { value: US_STATE, option: 'State' },
    { value: COUNTY, option: 'County' }
  ],
  [OFFSHORE_REGIONS]: [
    { value: false, option: '' },
    { value: true, option: '' }
  ]
}

const useStyles = makeStyles(theme => ({
  exploreDataToolbarWrapper: {
    backgroundColor: theme.palette.common.white,
    zIndex: 999,
    position: 'relative',
  },
  mapToolsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderLeft: `1px solid ${ theme.palette.grey[400] }`,
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(2),
    '& fieldset:first-child': {
      marginTop: 0,
    },
    '& fieldset:last-child': {
      marginTop: theme.spacing(3),
    },
    '& div:first-child': {
      marginTop: 0,
      marginRight: theme.spacing(4),
    },
  },
  toolbarIcon: {
    fill: theme.palette.links.default,
    width: '.75em',
    height: '.75em',
    marginRight: '.25em',
  },
  yearSliderWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderLeft: `1px solid ${ theme.palette.grey[400] }`,
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(2),
    width: 300,
  }
}))

const ExploreDataToolbar = () => {
  const data = useStaticQuery(graphql`
    query CommodityQuery {
      onrr {
        production_commodity: fiscal_production_summary(where: {commodity: {_neq: ""}}, distinct_on: commodity) {
          commodity
        }
        revenue_commodity: revenue_commodity_summary(where: {commodity: {_neq: ""}}, distinct_on: commodity) {
          commodity
        }
      }
    }
  `)

  const productionCommodityOptions = data.onrr.production_commodity.map(item => item.commodity)
  const revenueCommodityOptions = data.onrr.revenue_commodity.map(item => item.commodity)

  const classes = useStyles()
  const { state: filterState, updateDataFilter } = useContext(DataFilterContext)

  const [exploreDataTabOpen, setExploreDataTabOpen] = useState(true)
  const [periodTabOpen, setPeriodTabOpen] = useState(false)
  const [locationTabOpen, setLocationTabOpen] = useState(false)
  const [exploreMoreTabOpen, setExploreMoreTabOpen] = useState(false)

  const {
    dataType,
    commodity,
    counties,
    offshoreRegions
  } = filterState

  const toggleExploreDataToolbar = event => {
    setExploreDataTabOpen(!exploreDataTabOpen)
    setPeriodTabOpen(false)
    setLocationTabOpen(false)
    setExploreMoreTabOpen(false)
  }

  const togglePeriodToolbar = event => {
    setPeriodTabOpen(!periodTabOpen)
    setExploreMoreTabOpen(false)
    setLocationTabOpen(false)
    setExploreDataTabOpen(false)
  }

  const toggleLocationToolbar = event => {
    setLocationTabOpen(!locationTabOpen)
    setExploreMoreTabOpen(false)
    setPeriodTabOpen(false)
    setExploreDataTabOpen(false)
  }

  const toggleExploreMoreToolbar = event => {
    setExploreMoreTabOpen(!exploreMoreTabOpen)
    setExploreDataTabOpen(false)
    setPeriodTabOpen(false)
    setLocationTabOpen(false)
  }

  return (
    <Box className={classes.exploreDataToolbarWrapper}>
      <BaseToolbar>
        <FilterToggleInput
          value="open"
          aria-label="Open explore data filters"
          defaultSelected={exploreDataTabOpen}
          selected={exploreDataTabOpen}
          onChange={toggleExploreDataToolbar}
        >
          <MapIcon className={classes.toolbarIcon} /> Explore data
        </FilterToggleInput>
        <FilterToggleInput
          value="open"
          aria-label="Open period filters"
          defaultSelected={periodTabOpen}
          selected={periodTabOpen}
          onChange={togglePeriodToolbar}>
          <CalendarIcon className={classes.toolbarIcon} /> Period
        </FilterToggleInput>
        <FilterToggleInput
          value="open"
          aria-label="Open location filters"
          defaultSelected={locationTabOpen}
          selected={locationTabOpen}
          onChange={toggleLocationToolbar}>
          <LocationOnIcon className={classes.toolbarIcon} /> Location
        </FilterToggleInput>
        <FilterToggleInput
          value="open"
          aria-label="Open explore more filters"
          defaultSelected={exploreMoreTabOpen}
          selected={exploreMoreTabOpen}
          onChange={toggleExploreMoreToolbar}>
          <MoreVertIcon className={classes.toolbarIcon} /> Explore more {dataType}
        </FilterToggleInput>
      </BaseToolbar>
      {exploreDataTabOpen &&
        <BaseToolbar isSecondary={true}>
          <DataTypeSelectInput
            dataFilterKey={dataType}
            data={EXPLORE_DATA_TOOLBAR_OPTIONS[DATA_TYPE]}
            defaultSelected={ dataType || REVENUE }
            label='Data type'
            selectType='Single'
            showClearSelected={false} />

          {(dataType === 'Revenue') &&
          <CommoditySelectInput
            dataFilterKey={COMMODITY}
            data={revenueCommodityOptions}
            defaultSelected={commodity}
            defaultSelectAll={typeof commodity === 'undefined'}
            label='Commodity'
            selectType='Multi'
            helperText='' />
          }

          <Box className={classes.mapToolsWrapper}>
            <MapLevelToggleInput
              dataFilterKey={COUNTIES}
              defaultSelected={counties || US_STATE}
              data={EXPLORE_DATA_TOOLBAR_OPTIONS[COUNTIES]}
              label="Map level toggle"
              legend="Map level"
              size="small" />

            <OffshoreRegionSwitchInput
              dataFilterKey={OFFSHORE_REGIONS}
              data={EXPLORE_DATA_TOOLBAR_OPTIONS[OFFSHORE_REGIONS]}
              defaultSelected={offshoreRegions}
              label='Show offshore'
              helperText=''
              disabled={dataType === 'Disbursements'}
              selectType='Single' />
          </Box>
        </BaseToolbar>
      }
      {periodTabOpen &&
        <BaseToolbar isSecondary={true}>
          <PeriodSelectInput
            dataFilterKey={PERIOD}
            data={EXPLORE_DATA_TOOLBAR_OPTIONS[PERIOD]}
            defaultSelected='Fiscal year'
            label='Period'
            selectType='Single'
            showClearSelected={false} />
          <Box className={classes.yearSliderWrapper}>
            <YearSlider />
          </Box>
        </BaseToolbar>
      }
      {locationTabOpen &&
        <BaseToolbar isSecondary={true}>
          Location toolbar yo!
        </BaseToolbar>
      }
      {exploreMoreTabOpen &&
        <BaseToolbar isSecondary={true}>
          Explore more toolbar yo!
        </BaseToolbar>
      }
    </Box>
  )
}

export default ExploreDataToolbar
