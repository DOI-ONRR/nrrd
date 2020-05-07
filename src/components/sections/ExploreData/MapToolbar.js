import React, { useContext, useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { navigate } from '@reach/router'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Hidden,
  Menu,
  MenuList,
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@material-ui/core'

import ExploreIcon from '@material-ui/icons/Explore'
import MapIcon from '@material-ui/icons/Map'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SearchIcon from '@material-ui/icons/Search'
import AddIcon from '@material-ui/icons/Add'

import MapSelectControl from './MapSelectControl'
import CONSTANTS from '../../../js/constants'

import { StoreContext } from '../../../store'
import { DataFilterContext } from '../../../stores/data-filter-store'

import { REVENUE, DISBURSEMENTS, PRODUCTION, DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const useStyles = makeStyles(theme => ({
  toolbar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    padding: 0,
    zIndex: 250,
    '@media (max-width: 768px)': {
      position: 'relative',
      width: '100%',
      background: theme.palette.common.white,
      zIndex: 89,
    },
    '& h2': {
      marginTop: theme.spacing(1),
      fontSize: '1rem',
      lineHeight: 'inherit',
    },
    '& label': {
      marginTop: 0,
    },
    '& label span': {
      margin: 0,
      '@media (max-width: 768px)': {
        fontSize: '.85rem',
        lineHeight: '.85rem',
      }
    },
  },
  toolbarControls: {
    display: 'flex',
    justifyContent: 'flex-start',
    transition: 'height .4s ease',
    background: 'transparent',
    '@media (max-width: 768px)': {
      justifyContent: 'flex-start',
      width: '100%',
      overflowX: 'auto',
    }
  },
  mapExploreMenu: {
    position: 'absolute',
    right: 10,
    top: -1,
    zIndex: 99,
    '@media (max-width: 960px)': {
      position: 'relative',
      width: '100%',
      top: 'inherit',
      right: 'inherit',
    },
    '& svg': {
      color: theme.palette.links.default,
    },
    '& button': {
      color: theme.palette.grey[700],
      border: `1px solid ${ theme.palette.grey[300] }`,
      backgroundColor: theme.palette.common.white,
      borderRadius: 0,
      fontSize: theme.typography.h4.fontSize,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, .15)',
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      padding: theme.spacing(0.5),
      height: 50,
      minWidth: 50,
    },
    '& button:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    }
  },
  mapMenuRoot: {
    position: 'relative',
    top: -2,
    border: `1px solid ${ theme.palette.grey['300'] }`,
    height: 60,
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 0,
    background: 'white',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, .15)',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 150,
    zIndex: 99,
    fontSize: theme.typography.body2,
    '& .MuiTypography-root': {
      fontSize: '1.2rem',
      lineHeight: '1.2rem',
    },
    '& *': {
      margin: 0,
    },
    '& nav, & nav > div': {
      paddingTop: 0,
      paddingBottom: 0,
    }
  },
  mobileToolbar: {
    position: 'relative',
    zIndex: 99,
    boxShadow: '0 3px 6px 0 hsla(0,0%,57%,.23)',
    overflowX: 'auto',
    height: 60,
    '& div': {
      height: 60,
    },
  },
  botNavRoot: {
    color: theme.palette.grey[700],
    height: 60,
  },
  botNavSelected: {
    color: theme.palette.links.default,
    '& svg': {
      fill: theme.palette.links.default,
    }
  },
  botNavNotSelected: {
    color: theme.palette.grey[700],
    '& svg': {
      fill: theme.palette.grey[700],
    }
  },
  tooltipRoot: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  }
}))

const MAP_DATA_TYPE_SELECT_OPTIONS = [
  'Revenue',
  'Disbursements',
  'Production'
]

const MAP_LEVEL_OPTIONS = [
  'State',
  'County'
]

const MAP_OFFSHORE_SELECT_OPTIONS = [
  'Off',
  'On'
]

// const MAP_TIMEFRAME_OPTIONS = [
//   CONSTANTS.YEARLY,
//   CONSTANTS.MONTHLY
// ]

const MAP_PERIOD_OPTIONS = [
  CONSTANTS.CALENDAR_YEAR,
  CONSTANTS.FISCAL_YEAR,
  CONSTANTS.MONTHLY
]

// Map explore menu speed dial
const MapExploreMenu = props => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const theme = useTheme()
  const matchesMdUp = useMediaQuery(theme.breakpoints.up('md'))

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = index => event => {
    setAnchorEl(null)
    navigate(props.linkUrls[index])
  }

  return (
    <div className={classes.mapExploreMenu}>
      {matchesMdUp &&
        <>
          <Tooltip title="Explore more" classes={{ tooltip: classes.tooltipRoot }}>
            <IconButton
              aria-label="Other ways to explore data"
              aria-controls="other-ways-to-explore-data"
              aria-haspopup="true"
              onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="other-ways-to-explore-data"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose(null)}
          >
            {
              props.linkLabels.map((item, i) => <MenuItem key={i} onClick={handleClose(i)}>{item}</MenuItem>)
            }
          </Menu>
        </>
      }
      {!matchesMdUp &&
      <>
        <Paper>
          <MenuList>
            {
              props.linkLabels.map((item, i) => <MenuItem key={i} onClick={handleClose(i)}>{item}</MenuItem>)
            }
          </MenuList>
        </Paper>
      </>
      }
    </div>
  )
}

// Explore data toolbar
const ExploreDataToolbar = props => {
  const { cardMenuItems, onLink } = props

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

  const theme = useTheme()
  const matchesMdUp = useMediaQuery(theme.breakpoints.up('md'))

  const [navValue, setNavValue] = useState(null)
  const [menu, setMenu] = useState({
    showMapTools: false,
    showSearch: false,
    showExplore: false,
  })

  const { state: filterState } = useContext(DataFilterContext)
  const { state: pageState } = useContext(StoreContext)

  const cards = pageState.cards

  // add locations
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (index, item) => event => {
    setAnchorEl(null)
    if (typeof item !== 'undefined') {
      onLink(item)
    }
  }

  const {
    dataType,
    counties,
    offshoreRegion
  } = filterState

  return (
    <>
      <Hidden mdUp>
        <Box className={classes.mobileToolbar}>
          <BottomNavigation
            value={navValue}
            onChange={(event, newValue) => {
              console.log('newVal: ', newValue)
              setNavValue(newValue)
              switch (newValue) {
              case 0:
                setMenu({ ...menu, showMapTools: !menu.showMapTools, showSearch: false, showExplore: false })
                !menu.showMapTools || setNavValue(null)
                break
              case 1:
                setAnchorEl(newValue)
                setMenu({ ...menu, showSearch: !menu.showSearch, showExplore: false, showMapTools: false })
                !menu.showSearch || setNavValue(null)
                break
              case 2:
                setMenu({ ...menu, showExplore: !menu.showExplore, showMapTools: false, showSearch: false })
                !menu.showExplore || setNavValue(null)
                break
              default:
                break
              }
            }}
            showLabels
            className={classes.root}
          >
            <BottomNavigationAction
              label="Map tools"
              icon={<MapIcon />}
              classes={{
                root: classes.botNavRoot,
                selected: classes.botNavSelected
              }} />

            <BottomNavigationAction
              label="Add locations"
              icon={<AddIcon />}
              classes={{
                root: classes.botNavRoot,
                selected: classes.botNavSelected
              }} />

            <BottomNavigationAction
              label="Explore more"
              icon={<MoreVertIcon />}
              classes={{
                root: classes.botNavRoot,
                selected: classes.botNavSelected
              }} />
          </BottomNavigation>
        </Box>
      </Hidden>

      <Box className={classes.toolbar}>
        {(menu.showMapTools || matchesMdUp) &&
          <Box className={classes.toolbarControls}>
            <MapSelectControl
              options={MAP_DATA_TYPE_SELECT_OPTIONS}
              defaultOption={ dataType || REVENUE }
              label="Data type"
              dataFilterType={DFC.DATA_TYPE} />

            <MapSelectControl
              options={MAP_LEVEL_OPTIONS}
              defaultOption={ counties || 'State' }
              label="Map level"
              dataFilterType={DFC.COUNTIES} />

            <MapSelectControl
              options={MAP_OFFSHORE_SELECT_OPTIONS}
              defaultOption={ offshoreRegion || 'Off' }
              label="Offshore data"
              dataFilterType={DFC.OFFSHORE_REGIONS} />

            {/* <MapSelectControl
                  options={MAP_TIMEFRAME_OPTIONS}
                  label="Timeframe"
                  dataFilterType={DFC.TIMEFRAME'} /> */}

            <MapSelectControl
              options={MAP_PERIOD_OPTIONS}
              defaultOption={dataType !== 'Disbursements' ? 'Calendar year' : 'Fiscal year'}
              label="Period"
              dataFilterType="" />

            {(dataType === 'Revenue') &&
            <MapSelectControl
              options={revenueCommodityOptions}
              defaultOption="Oil"
              label="Commodity"
              checkbox={(dataType === REVENUE) && true}
              dataFilterType={DFC.COMMODITIES} />
            }

            {(dataType === 'Production') &&
              <MapSelectControl
                options={productionCommodityOptions}
                defaultOption="Oil (bbl)"
                label="Commodity"
                checkbox={false}
                dataFilterType={DFC.COMMODITY} />
            }
          </Box>
        }

        <Hidden mdUp>
          {(menu.showSearch || matchesMdUp) &&
          <Box>
            {cardMenuItems &&
              cardMenuItems.map((item, i) => <MenuItem disabled={cards.some(c => c.abbr === item.name)} key={i} onClick={handleClose(i, item)}>{item.label}</MenuItem>)
            }
          </Box>
          }
        </Hidden>

        {(menu.showExplore || matchesMdUp) &&
          <Box>
            {dataType === REVENUE &&
                <MapExploreMenu
                  linkLabels={['Query revenue data', 'Downloads & Documentation', 'How revenue works', 'Revenue by company']}
                  linkUrls={['/query-data/?dataType=Revenue', '/downloads/#Revenue', '/how-revenue-works/#revenues', '/how-revenue-works/federal-revenue-by-company/2018/']}
                />
            }
            {dataType === DISBURSEMENTS &&
                <MapExploreMenu
                  linkLabels={['Query disbursements data', 'Downloads & Documentation', 'How disbursements works']}
                  linkUrls={['/query-data/?dataType=Disbursements', '/downloads/#Disbursements', '/how-revenue-works/#understanding-federal-disbursements']}
                />
            }
            {dataType === PRODUCTION &&
                <MapExploreMenu
                  linkLabels={['Query production data', 'Downloads & Documentation', 'How production works']}
                  linkUrls={['/query-data/?dataType=Production', '/downloads/#Production', '/how-revenue-works/#the-production-process']}
                />
            }
          </Box>
        }
      </Box>
    </>
  )
}

export default ExploreDataToolbar
