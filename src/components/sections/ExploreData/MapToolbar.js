import React, { useContext, useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { navigate } from '@reach/router'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Menu,
  MenuItem,
  IconButton
} from '@material-ui/core'

import MoreVertIcon from '@material-ui/icons/MoreVert'

import MapSelectControl from './MapSelectControl'
import CONSTANTS from '../../../js/constants'

const useStyles = makeStyles(theme => ({
  toolbar: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    // borderBottom: `1px solid ${ theme.palette.grey[300] }`,
    // boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.3), 0px 2px 4px -1px rgba(0,0,0,0.14), 0px 2px 4px -1px rgba(0,0,0,0.12)',
    background: theme.palette.grey['200'],
    overflowX: 'auto',
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
    }
  },
  toolbarControls: {
    display: 'flex',
    justifyContent: 'flex-start',
    '@media (max-width: 768px)': {
      justifyContent: 'flex-start',
    }
  },
  mapExploreMenu: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 99,
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
  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = index => event => {
    setAnchorEl(null)
    navigate(props.linkUrls[index])
  }

  return (
    <div className={classes.mapExploreMenu}>
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

  return (
    <Box className={classes.toolbar}>
      <Box className={classes.toolbarControls}>
        <MapSelectControl
          options={MAP_DATA_TYPE_SELECT_OPTIONS}
          label="Data type"
          payload={{ type: 'DATA_TYPE', payload: { dataType: 'Revenue' } }} />

        <MapSelectControl
          options={MAP_LEVEL_OPTIONS}
          label="Map level"
          payload={{ type: 'COUNTY_LEVEL', payload: { countyLevel: 'State', prop1: 'prop1 value', prop2: 'prop2 value' } }} />

        <MapSelectControl
          options={MAP_OFFSHORE_SELECT_OPTIONS}
          label="Offshore data"
          payload={{ type: 'OFFSHORE_DATA', payload: { offshoreData: 'Off' } }} />

        {/* <MapSelectControl
          options={MAP_TIMEFRAME_OPTIONS}
          label="Timeframe"
          payload={{ type: 'TIMEFRAME', payload: { timeframe: MAP_TIMEFRAME_OPTIONS.YEARLY } }} /> */}

        <MapSelectControl
          options={MAP_PERIOD_OPTIONS}
          label="Period"
          payload={{ type: 'PERIOD', payload: { period: MAP_PERIOD_OPTIONS.CALENDAR_YEAR } }} />

        <MapSelectControl
          options={commodityOptions}
          label="Commodity"
          checkbox
          payload={{ type: 'COMMODITY', payload: { commodity: '' } }} />

        <MapExploreMenu
          linkLabels={['Query revenue data', 'Downloads & Documentation', 'How revenue works', 'Revenue by company']}
          linkUrls={['/query-data/?dataType=Revenue', '/downloads/#Revenue', '/how-it-works/#revenues', '/how-it-works/federal-revenue-by-company/2018/']}
        />
      </Box>
    </Box>
  )
}

export default ExploreDataToolbar
