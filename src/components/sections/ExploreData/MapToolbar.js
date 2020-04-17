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
  useMediaQuery
} from '@material-ui/core'

import ExploreIcon from '@material-ui/icons/Explore'
import MapIcon from '@material-ui/icons/Map'
import SearchIcon from '@material-ui/icons/Search'

import MoreVertIcon from '@material-ui/icons/MoreVert'

import MapSelectControl from './MapSelectControl'
import CONSTANTS from '../../../js/constants'

import { StoreContext } from '../../../store'

const useStyles = makeStyles(theme => ({
  toolbar: {
    padding: 0,
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
    '@media (max-width: 768px)': {
      justifyContent: 'flex-start',
      width: '100%',
      overflowX: 'auto',
    }
  },
  mapExploreMenu: {
    position: 'absolute',
    right: 10,
    top: 4,
    zIndex: 99,
    '@media (max-width: 768px)': {
      position: 'relative',
      width: '100%',
      top: 'inherit',
      right: 'inherit',
    },
    '& button': {
      color: theme.palette.common.black,
      border: `1px solid ${ theme.palette.grey['300'] }`,
      backgroundColor: theme.palette.common.white,
      borderRadius: '50%',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, .15)',
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      padding: theme.spacing(0.5),
    },
    '& button:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    }
  },
  mapMenuRoot: {
    position: 'relative',
    top: -2,
    border: `1px solid ${ theme.palette.grey['300'] }`,
    height: 50,
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    paddingTop: 0,
    paddingBottom: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
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
  },
  botNavRoot: {
    color: theme.palette.grey[700],
  },
  botNavSelected: {
    color: theme.palette.links.default,
    '& svg': {
      fill: theme.palette.links.default,
    }
  },
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
          <IconButton
            aria-label="Other ways to explore data"
            aria-controls="other-ways-to-explore-data"
            aria-haspopup="true"
            onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
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
  const data = useStaticQuery(graphql`
    query CommodityQuery {
      onrr {
        commodity(where: {commodity: {_neq: ""}}, distinct_on: commodity) {
          commodity
        }
      }
    }
  `)
  const commodityOptions = data.onrr.commodity.map(item => item.commodity)
  const classes = useStyles()

  const theme = useTheme()
  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'))
  const matchesMdUp = useMediaQuery(theme.breakpoints.up('md'))

  console.log('matchesMdUp: ', matchesMdUp)

  const [navValue, setNavValue] = useState(null)
  const [menu, setMenu] = useState({
    showMapTools: false,
    showSearch: false,
    showExplore: false,
  })

  const { state } = useContext(StoreContext)
  const {
    dataType,
    countyLevel,
    offshoreData
  } = state

  return (
    <>
      <Hidden mdUp>
        <Box className={classes.mobileToolbar}>
          <BottomNavigation
            value={navValue}
            onChange={(event, newValue) => {
              setNavValue(newValue)
              switch (newValue) {
              case 0:
                setMenu({ ...menu, showMapTools: !menu.showMapTools, showExplore: false })
                break
              case 1:
                setMenu({ ...menu, showExplore: !menu.showExplore, showMapTools: false })
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
              label="Explore more"
              icon={<ExploreIcon />}
              classes={{ root: classes.botNavRoot, selected: classes.botNavSelected }} />
          </BottomNavigation>
        </Box>
      </Hidden>

      <Box className={classes.toolbar}>
        {(menu.showMapTools || matchesMdUp) &&
          <Box className={classes.toolbarControls}>
            <MapSelectControl
              options={MAP_DATA_TYPE_SELECT_OPTIONS}
              defaultOption={ dataType || 'Revenue' }
              label="Data type"
              payload={{ type: 'DATA_TYPE', payload: { dataType: 'Revenue' } }} />

            <MapSelectControl
              options={MAP_LEVEL_OPTIONS}
              defaultOption={ countyLevel || 'State' }
              label="Map level"
              payload={{ type: 'COUNTY_LEVEL', payload: { countyLevel: 'State' } }} />

            <MapSelectControl
              options={MAP_OFFSHORE_SELECT_OPTIONS}
              defaultOption={ offshoreData || 'Off' }
              label="Offshore data"
              payload={{ type: 'OFFSHORE_DATA', payload: { offshoreData: 'Off' } }} />

            {/* <MapSelectControl
          options={MAP_TIMEFRAME_OPTIONS}
          label="Timeframe"
          payload={{ type: 'TIMEFRAME', payload: { timeframe: MAP_TIMEFRAME_OPTIONS.YEARLY } }} /> */}

            <MapSelectControl
              options={MAP_PERIOD_OPTIONS}
              defaultOption={dataType !== 'Disbursements' ? 'Calendar year' : 'Fiscal year'}
              label="Period"
              payload={{ type: 'PERIOD', payload: { period: MAP_PERIOD_OPTIONS.CALENDAR_YEAR } }} />

            {(dataType !== 'Disbursements') &&
          <MapSelectControl
            options={commodityOptions}
            defaultOption="Oil"
            label="Commodity"
            checkbox={(dataType === 'Revenue') && true}
            payload={{ type: 'COMMODITY', payload: { commodity: 'Oil' } }} />
            }
          </Box>
        }
        {(menu.showExplore || matchesMdUp) &&
          <Box className={classes.toolbarExploreMenu}>
            <MapExploreMenu
              linkLabels={['Query revenue data', 'Downloads & Documentation', 'How revenue works', 'Revenue by company']}
              linkUrls={['/query-data/?dataType=Revenue', '/downloads/#Revenue', '/how-it-works/#revenues', '/how-it-works/federal-revenue-by-company/2018/']}
            />
          </Box>
        }
      </Box>
    </>
  )
}

export default ExploreDataToolbar
