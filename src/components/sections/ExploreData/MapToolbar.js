import React, { useContext, useState } from 'react'
import { navigate } from '@reach/router'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import { StoreContext } from '../../../store'

const useStyles = makeStyles(theme => ({
  toolbar: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    // borderBottom: `1px solid ${ theme.palette.grays[300] }`,
    // boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.3), 0px 2px 4px -1px rgba(0,0,0,0.14), 0px 2px 4px -1px rgba(0,0,0,0.12)',
    background: theme.palette.grays['200'],
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
      border: `1px solid ${ theme.palette.grays['300'] }`,
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
    border: `1px solid ${ theme.palette.grays['300'] }`,
    height: 50,
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    paddingTop: 0,
    paddingBottom: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    background: theme.palette.common.white,
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

// Map Level select
const MapLevel = props => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const options = [
    'State',
    'County'
  ]

  const handleClickListItem = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (event, i) => {
    setSelectedIndex(i)
    setAnchorEl(null)

    dispatch({ type: 'COUNTY_LEVEL', payload: { countyLevel: i === 1 } })
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className={classes.mapMenuRoot}>
      <List component="nav" aria-label="Map levels">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="map-levels-menu"
          aria-label="map levels locked"
          onClick={handleClickListItem}
        >
          <ListItemText primary="Map level" secondary={options[selectedIndex]} />
        </ListItem>
      </List>
      <Menu
        id="levels-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

// Map Offshore select
const MapOffshore = props => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const options = [
    'Off',
    'On'
  ]

  const handleClickListItem = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (event, i) => {
    setSelectedIndex(i)
    setAnchorEl(i)

    dispatch({ type: 'OFFSHORE', payload: { offshore: i === 1 } })
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className={classes.mapMenuRoot}>
      <List component="nav" aria-label="Map levels">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="map-offshore-menu"
          aria-label="map offshore locked"
          onClick={handleClickListItem}
        >
          <ListItemText primary="Offshore data" secondary={options[selectedIndex]} />
        </ListItem>
      </List>
      <Menu
        id="offshore-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

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
        aria-label="Other ways to explore revenue"
        aria-controls="explore-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="explore-menu"
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
  const classes = useStyles()
  return (
    <Box className={classes.toolbar}>
      <Box className={classes.toolbarControls}>
        <MapLevel onChange={props.handleChange} />
        <MapOffshore onChange={props.handleChange} />
        <MapExploreMenu
          linkLabels={['Revenue by company', 'Native American revenue', 'Query revenue data', 'Downloads & Documentation', 'How revenue works']}
          linkUrls={['/explore/?dataType=revenue-by-company', '/explore/?dataType=native-american-revenue', '/query-data', '/downloads', '/how-it-works']}
        />
      </Box>
    </Box>
  )
}

export default ExploreDataToolbar
