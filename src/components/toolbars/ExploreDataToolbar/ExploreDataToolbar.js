import React, { useContext, useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { navigate } from '@reach/router'

import { StoreContext } from '../../../store'
import { DataFilterContext } from '../../../stores/data-filter-store'
import BaseToolbar from '../BaseToolbar'
import SearchLocationsInput from '../../inputs/SearchLocationsInput'
import { StickyWrapper } from '../../utils/StickyWrapper'

import {
  Box,
  MenuItem
} from '@material-ui/core'

import {
  makeStyles
} from '@material-ui/styles'

import MapIcon from '@material-ui/icons/Map'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AddIcon from '@material-ui/icons/Add'

import ExploreDataIcon from '-!svg-react-loader!../../../img/icons/explore-data.svg'

import {
  CommoditySelectInput,
  DataTypeSelectInput,
  FilterToggleInput,
  MapLevelToggleInput,
  PeriodSelectInput,
  OffshoreRegionsSwitchInput
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
    { value: DISBURSEMENT, option: 'Disbursements' },
    { value: PRODUCTION, option: 'Production' },
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
    zIndex: 1001,
    position: 'relative',
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
  yearSliderWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderLeft: `1px solid ${ theme.palette.grey[400] }`,
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(3),
    width: 350,
  },
  tooltipRoot: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  horizontalMenuItems: {
    display: 'flex',
  },
}))

const ExploreDataToolbar = props => {
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

  const {
    onLink,
    cardMenuItems,
    mapOverlay
  } = props

  const productionCommodityOptions = data.onrr.production_commodity.map(item => item.commodity)
  const revenueCommodityOptions = data.onrr.revenue_commodity.map(item => item.commodity)

  const classes = useStyles()
  const { state: filterState, updateDataFilter } = useContext(DataFilterContext)
  const { state: pageState } = useContext(StoreContext)

  const [exploreDataTabOpen, setExploreDataTabOpen] = useState(true)
  const [locationTabOpen, setLocationTabOpen] = useState(false)
  const [exploreMoreTabOpen, setExploreMoreTabOpen] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null)

  const {
    dataType,
    commodity,
    counties,
    offshoreRegions
  } = filterState

  const {
    cards
  } = pageState

  const toggleExploreDataToolbar = event => {
    setExploreDataTabOpen(!exploreDataTabOpen)
    setLocationTabOpen(false)
    setExploreMoreTabOpen(false)
  }

  const toggleLocationToolbar = event => {
    setLocationTabOpen(!locationTabOpen)
    setExploreMoreTabOpen(false)
    setExploreDataTabOpen(false)
  }

  const toggleExploreMoreToolbar = event => {
    setExploreMoreTabOpen(!exploreMoreTabOpen)
    setExploreDataTabOpen(false)
    setLocationTabOpen(false)
  }

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (index, item) => event => {
    setAnchorEl(null)
    if (typeof item !== 'undefined') {
      onLink(item)
    }
  }

  return (
    <Box className={classes.exploreDataToolbarWrapper}>
      <StickyWrapper enabled={true} top={0} bottomBoundary={0} innerZ="1000" activeClass="sticky">
        <BaseToolbar>
          <FilterToggleInput
            value="open"
            aria-label="Open explore data filters"
            defaultSelected={exploreDataTabOpen}
            selected={exploreDataTabOpen}
            onChange={toggleExploreDataToolbar}
          >
            <ExploreDataIcon className={`${ classes.toolbarIcon } ${ classes.exploreDataIcon }`} />
            <span>Explore data</span>
          </FilterToggleInput>
          <FilterToggleInput
            value="open"
            aria-label="Open location filters"
            defaultSelected={locationTabOpen}
            selected={locationTabOpen}
            onChange={toggleLocationToolbar}>
            <LocationOnIcon className={classes.toolbarIcon} />
            <span>Compare</span>
          </FilterToggleInput>
          <FilterToggleInput
            value="open"
            aria-label="Open explore more filters"
            defaultSelected={exploreMoreTabOpen}
            selected={exploreMoreTabOpen}
            onChange={toggleExploreMoreToolbar}>
            <MoreVertIcon className={classes.toolbarIcon} />
            <span>Explore more {dataType}</span>
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

          {(dataType === 'Production') &&
            <CommoditySelectInput
              dataFilterKey={COMMODITY}
              data={productionCommodityOptions}
              defaultSelected={commodity || 'Oil (bbl)'}
              label='Commodity'
              selectType='Single'
              showClearSelected={false} />
          }

          <Box className={classes.toolsWrapper}>
            <PeriodSelectInput
              dataFilterKey={PERIOD}
              data={EXPLORE_DATA_TOOLBAR_OPTIONS[PERIOD]}
              defaultSelected='Fiscal year'
              label='Period'
              selectType='Single'
              showClearSelected={false} />
            <YearSlider />
          </Box>
          {!mapOverlay &&
          <Box className={classes.toolsWrapper}>
            <MapLevelToggleInput
              dataFilterKey={COUNTIES}
              defaultSelected={counties || CONSTANTS.STATE}
              data={EXPLORE_DATA_TOOLBAR_OPTIONS[COUNTIES]}
              label="Map level toggle"
              legend="Map level"
              size="small"
              disabled={mapOverlay} />

            <OffshoreRegionsSwitchInput
              dataFilterKey={OFFSHORE_REGIONS}
              data={EXPLORE_DATA_TOOLBAR_OPTIONS[OFFSHORE_REGIONS]}
              defaultSelected={offshoreRegions === true}
              label='Show offshore'
              helperText=''
              disabled={dataType === 'Disbursements' || mapOverlay}
              selectType='Single' />
          </Box>
          }
        </BaseToolbar>
        }
        {locationTabOpen &&
        <BaseToolbar isSecondary={true}>
          <Box className={classes.horizontalMenuItems}>
            <SearchLocationsInput onLink={onLink} />
            {cardMenuItems &&
              cardMenuItems.map((item, i) =>
                <MenuItem
                  disabled={cards.some(c => c.locationName === item.location_name)}
                  key={i}
                  onClick={handleClose(i, item)}>
                  {item.label}
                </MenuItem>
              )
            }
          </Box>
        </BaseToolbar>
        }
        {exploreMoreTabOpen &&
        <BaseToolbar isSecondary={true}>
          <Box>
            {dataType === REVENUE &&
                  <MapExploreMenu
                    linkLabels={[
                      'Query revenue data',
                      'Downloads & Documentation',
                      'How revenue works',
                      // 'Revenue by company'
                    ]}
                    linkUrls={[
                      '/query-data/?dataType=Revenue',
                      '/downloads/#Revenue',
                      '/how-revenue-works#understanding-federal-revenues',
                      // '/how-revenue-works/federal-revenue-by-company/2018'
                    ]}
                  />
            }
            {dataType === DISBURSEMENT &&
                  <MapExploreMenu
                    linkLabels={[
                      'Query disbursements data',
                      'Downloads & Documentation',
                      'How disbursements works'
                    ]}
                    linkUrls={[
                      '/query-data/?dataType=Disbursements',
                      '/downloads/#Disbursements',
                      '/how-revenue-works/#understanding-federal-disbursements'
                    ]}
                  />
            }
            {dataType === PRODUCTION &&
                  <MapExploreMenu
                    linkLabels={[
                      'Query production data',
                      'Downloads & Documentation',
                      'How production works'
                    ]}
                    linkUrls={[
                      '/query-data/?dataType=Production',
                      '/downloads/#Production',
                      '/how-revenue-works/#the-production-process'
                    ]}
                  />
            }
          </Box>
        </BaseToolbar>
        }
      </StickyWrapper>
    </Box>
  )
}

export default ExploreDataToolbar

// Map explore menu speed dial
const MapExploreMenu = props => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(true)

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = index => event => {
    // setAnchorEl(null)
    navigate(props.linkUrls[index])
  }

  return (
    <Box className={classes.horizontalMenuItems}>
      {
        props.linkLabels.map((item, i) => <MenuItem key={i} onClick={handleClose(i)}>{item}</MenuItem>)
      }
    </Box>
  )
}
