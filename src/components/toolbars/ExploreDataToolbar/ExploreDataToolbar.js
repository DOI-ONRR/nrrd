import React, { useContext, useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { navigate } from '@reach/router'

import { ExploreDataContext } from '../../../stores/explore-data-store'
import { DataFilterContext } from '../../../stores/data-filter-store'
import BaseToolbar from '../BaseToolbar'
import SearchLocationsInput from '../../inputs/SearchLocationsInput'
import { StickyWrapper } from '../../utils/StickyWrapper'
import DataTypeFilter from '../../inputs/data-filters/DataTypeFilter'

import {
  Box,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@material-ui/core'

import {
  makeStyles
} from '@material-ui/styles'

import LocationOnIcon from '@material-ui/icons/LocationOn'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import { IconExploreDataImg } from '../../images'

import {
  CommoditySelectInput,
  FilterToggleInput,
  PeriodSelectInput
} from '../../inputs'

import YearSlider from '../../sections/ExploreData/YearSlider'

import {
  COMMODITY,
  DATA_FILTER_CONSTANTS as DFC,
  DATA_TYPE,
  DISBURSEMENT,
  PERIOD,
  PRODUCTION,
  REVENUE
} from '../../../constants'

const EXPLORE_DATA_TOOLBAR_OPTIONS = {
  [DATA_TYPE]: [
    { value: REVENUE, option: 'Revenue' },
    { value: DISBURSEMENT, option: 'Disbursements' },
    { value: PRODUCTION, option: 'Production' },
  ],
  [PERIOD]: [
    { value: DFC.PERIOD_FISCAL_YEAR, option: DFC.PERIOD_FISCAL_YEAR },
    { value: DFC.PERIOD_CALENDAR_YEAR, option: DFC.PERIOD_CALENDAR_YEAR },
    // { value: DFC.PERIOD_MONTHLY_YEAR, option: DFC.PERIOD_MONTHLY_YEAR }
  ]
}

const useStyles = makeStyles(theme => ({
  exploreDataToolbarWrapper: {
    backgroundColor: theme.palette.common.white,
    zIndex: 1001,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      position: 'sticky',
      top: 60,
    }
  },
  toolsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderLeft: `1px solid ${ theme.palette.grey[400] }`,
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(2),
    height: 75,
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
    query DistinctCommodityQuery {
      onrr {

ProductionCommodityOptions: production_commodity_options(where: {product: {_neq: ""}}, order_by: {commodity_order: asc}) {
    product
  }
       
  # replacing in favor of commodity view which has the commodity_order field to order by
        RevenueCommodityOptions: revenue_commodity_options(where: {commodity: {_neq: ""}}, order_by:  {commodity_order: asc}) {
           commodity
        }
      }
    }
  `)

  const {
    onLink,
    cardMenuItems
  } = props

  const productionCommodityOptions = data.onrr.ProductionCommodityOptions.map(item => item.product)
  // const revenueCommodityOptions = data.onrr.revenue_commodity.map(item => item.commodity)
  const revenueCommodityOptions = data.onrr.RevenueCommodityOptions.map(item => item.commodity)

  const classes = useStyles()
  const { state: filterState } = useContext(DataFilterContext)
  const { state: pageState } = useContext(ExploreDataContext)

  const [exploreDataTabOpen, setExploreDataTabOpen] = useState(true)
  const [locationTabOpen, setLocationTabOpen] = useState(false)
  const [exploreMoreTabOpen, setExploreMoreTabOpen] = useState(false)

  const theme = useTheme()
  const matchesSmDown = useMediaQuery(theme.breakpoints.down('xs'))

  const {
    dataType,
    commodity
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

  const handleClose = (index, item) => event => {
    if (typeof item !== 'undefined') {
      onLink(item)
    }
  }

  return (
    <Box className={classes.exploreDataToolbarWrapper}>
      <StickyWrapper enabled={!matchesSmDown} top={60} bottomBoundary={0} innerZ="1000" activeClass="sticky">
        <BaseToolbar>
          <FilterToggleInput
            value="open"
            aria-label="Open explore data filters"
            defaultSelected={exploreDataTabOpen}
            selected={exploreDataTabOpen}
            onChange={toggleExploreDataToolbar}
          >
            <IconExploreDataImg className={`${ classes.toolbarIcon } ${ classes.exploreDataIcon }`} />
            <h1 style={{ fontSize: '1.125rem', margin: 0 }}><span>Explore data</span></h1>
          </FilterToggleInput>
          <FilterToggleInput
            value="open"
            aria-label="Open location filters"
            defaultSelected={locationTabOpen}
            selected={locationTabOpen}
            onChange={toggleLocationToolbar}>
            <LocationOnIcon className={classes.toolbarIcon} />
            <span>Add a location</span>
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
          <DataTypeFilter defaultSelected={ dataType || REVENUE }/>
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
            {(dataType === 'Revenue' || dataType === 'Production') &&

            <PeriodSelectInput
              dataFilterKey={PERIOD}
              data={EXPLORE_DATA_TOOLBAR_OPTIONS[PERIOD]}
              defaultSelected='Fiscal Year'
              label='Period'
              selectType='Single'
              showClearSelected={false} />
            }
            {(dataType === 'Disbursements') &&

            <PeriodSelectInput
              dataFilterKey={PERIOD}
              data={['Fiscal Year']}
              defaultSelected='Fiscal Year'
              label='Period'
              selectType='Single'
              showClearSelected={false} />
            }
            <YearSlider />
          </Box>
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
                      // 'Federal revenue by company'
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

  const handleClose = index => event => {
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
