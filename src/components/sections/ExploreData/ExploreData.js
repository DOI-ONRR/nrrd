import React, { Fragment, useState, useContext, useEffect, useRef } from 'react'
// import { Link } from "gatsby"

import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Snackbar from '@material-ui/core/Snackbar'
import Chip from '@material-ui/core/Chip'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import RefreshIcon from '@material-ui/icons/Refresh'

import { graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Map from '../../data-viz/Map'
import StateCard from '../../layouts/StateCard'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { StoreContext } from '../../../store'
import mapJson from './us-topology.json'
import { useMediaQuery } from '@material-ui/core'
// import  mapJson from './us.t2.json'

export const STATIC_QUERY = graphql`
  {
    onrr {
      commodity(distinct_on: fund_type) {
        fund_type
      }
    }
  }
`

const FISCAL_REVENUE_QUERY = gql`
  query FiscalRevenue($year: Int!, $location: String!) {
    fiscal_revenue_summary(where: {state_or_area: {_nin: ["National", ""]}, fiscal_year: { _eq: $year }, location_type: { _eq: $location } }) {
      fiscal_year
      state_or_area
      sum
    }
  }
`

console.log('FISCAL_REVENUE_QUERY::', FISCAL_REVENUE_QUERY)

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    margin: 0,
  },
  section: {
    marginTop: theme.spacing(2),
    height: '600px'
  },
  toolbar: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(1),
    // borderBottom: `1px solid ${ theme.palette.grey[300] }`,
    // boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.3), 0px 2px 4px -1px rgba(0,0,0,0.14), 0px 2px 4px -1px rgba(0,0,0,0.12)',
    background: theme.palette.grey['200'],
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
  mapWrapper: {
    position: 'relative',
    height: 575,
    // marginBottom: theme.spacing(20),
    background: theme.palette.grey[200],
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      height: 435,
    }
  },
  mapContainer: {
    position: 'relative',
    minWidth: 280,
    flexBasis: '100%',
    order: '3',
    height: 575,
    '@media (max-width: 768px)': {
      height: 350,
    },
  },
  cardContainer: {
    width: 310,
    position: 'absolute',
    right: 0,
    bottom: 120,
    height: 'auto',
    minHeight: 335,
    zIndex: 99,
    '@media (max-width: 960px)': {
      bottom: 40,
    },
    '@media (max-width: 768px)': {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
      alignContent: 'flex-start',
      alignItems: 'flex-end',
      background: 'transparent',
      left: 0,
      top: 0,
      overflowX: 'auto',
      height: 'auto',
      position: 'relative',
    },
    '& > div': {
      cursor: 'pointer',
      bottom: 25,
      '@media (max-width: 768px)': {
        position: 'relative',
        width: '100%',
        margin: 0,
        boxSizing: 'border-box',
        minWidth: 285,
        minHeight: 315,
        marginBottom: theme.spacing(1),
        bottom: 0,
      },
      '& .MuiCardHeader-root': {
        backgroundColor: theme.palette.green.default,
        color: theme.palette.common.white,
      },
      '& .MuiCardHeader-content > span': {
        color: theme.palette.common.white,
      }
    },
    '& > div:nth-child(2)': {
      transform: 'translate3d(-10%, 0px, 0px) !important',
      '@media (max-width: 768px)': {
        transform: 'none !important',
      },
      '& .MuiCardHeader-root': {
        backgroundColor: theme.palette.blue.dark,
        color: theme.palette.common.white,
      },
      '& .MuiCardHeader-content > span': {
        color: theme.palette.common.white,
      }
    },
    '& > div:nth-child(3)': {
      transform: 'translate3d(-20%, 0px, 0px) !important',
      '@media (max-width: 768px)': {
        transform: 'none !important',
      },
      '& .MuiCardHeader-root': {
        backgroundColor: theme.palette.orange.default,
        color: theme.palette.common.white,
      },
      '& .MuiCardHeader-content > span': {
        color: theme.palette.common.white,
      }
    },
    '& > div:nth-child(4)': {
      transform: 'translate3d(-30%, 0px, 0px) !important',
      '@media (max-width: 768px)': {
        transform: 'none !important',
      },
      '& .MuiCardHeader-root': {
        backgroundColor: theme.palette.purple.default,
        color: theme.palette.common.white,
      },
      '& .MuiCardHeader-content > span': {
        color: theme.palette.common.white,
      }
    },
    '& > div:nth-child(5)': {
      transform: 'translate3d(-40%, 0px, 0px) !important',
      '@media (max-width: 768px)': {
        transform: 'none !important',
      },
    },
    '& .minimized ~ div:nth-of-type(2)': {
      transform: 'translate3d(0px, 0px, 0px) !important',
    },
    '& .minimized ~ div:nth-of-type(3)': {
      transform: 'translate3d(-10%, 0px, 0px) !important',
    },
    '& .minimized ~ div:nth-of-type(4)': {
      transform: 'translate3d(-20%, 0px, 0px) !important',
    },
    '& .minimized ~ div:nth-of-type(5)': {
      transform: 'translate3d(-30%, 0px, 0px) !important',
    },
    '@media (min-width: 769px)': {
      '&:hover': {
        cursor: 'pointer',
        '& > div:nth-child(2)': {
          transform: 'translate3d(-100%, 0px, 0px) !important',
        },
        '& > div:nth-child(3)': {
          transform: 'translate3d(-200%, 0px, 0px) !important',
        },
        '& > div:nth-child(4)': {
          transform: 'translate3d(-300%, 0px, 0px) !important',
        },
        '& > div:nth-child(5)': {
          transform: 'translate3d(-400%, 0px, 0px) !important',
        },
        '& .minimized ~ div:nth-of-type(2)': {
          transform: 'translate3d(0px, 0px, 0px) !important',
        },
        '& .minimized ~ div:nth-of-type(3)': {
          transform: 'translate3d(-100%, 0px, 0px) !important',
        },
        '& .minimized ~ div:nth-of-type(4)': {
          transform: 'translate3d(-200%, 0px, 0px) !important',
        },
        '& .minimized ~ div:nth-of-type(5)': {
          transform: 'translate3d(-300%, 0px, 0px) !important',
        },
      }
    }
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: theme.spacing(2),
    zIndex: 101,
    paddingBottom: theme.spacing(0),
    borderTop: `1px solid ${ theme.palette.grey[300] }`,
    borderBottom: `1px solid ${ theme.palette.grey[300] }`,
  },
  sliderRoot: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    zIndex: 101,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    top: 0,
  },
  contentWrapper: {
    paddingBottom: theme.spacing(4),
    minHeight: 500,
  },
  zoomButtonGroupContainer: {
    position: 'absolute',
    bottom: 180,
    left: 10,
    '@media (max-width: 768px)': {
      bottom: 70,
    }
  },
  addCard: {
    position: 'absolute',
    bottom: -10,
    right: 10,
    width: 285,
    '@media (max-width: 768px)': {
      position: 'relative',
      left: 20,
    }
  },
  stateChipContainer: {
    background: theme.palette.common.white,
    borderRadius: 5,
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    }
  },
  formControl: {
    marginRight: theme.spacing(2),
  },
  mapExploreMenu: {
    // position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 99,
    '& button': {
      color: theme.palette.common.black,
      border: `1px solid ${ theme.palette.grey['300'] }`,
      backgroundColor: theme.palette.common.white,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, .15)',
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      minWidth: 150,
    },
    '& button:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    }
  },
  mapMenuItem: {
    border: `1px solid ${ theme.palette.grey['300'] }`,
    height: 48,
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
    '& *': {
      margin: 0,
    },
    '& nav, & nav > div': {
      paddingTop: 0,
      paddingBottom: 0,
    }
  }
}))

// State Chips
const StateChip = props => {
  const classes = useStyles()

  const handleDelete = () => {
    console.info('You clicked the delete icon.')
  }

  const handleClick = () => {
    console.info('You clicked the Chip.')
  }

  return (
    <Chip
      label={props.chipName}
      onDelete={handleDelete} />
  )
}

// Other ways
const MapExploreMenu = props => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className={classes.mapExploreMenu}>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenuClick}>
        Other ways to explore revenue
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={anchorEl}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Revenue by company</MenuItem>
        <MenuItem onClick={handleClose}>Native American revenue</MenuItem>
        <MenuItem onClick={handleClose}>Query revenue data</MenuItem>
        <MenuItem onClick={handleClose}>Downloads & Documentation</MenuItem>
        <MenuItem onClick={handleClose}>How revenue works</MenuItem>
      </Menu>
    </div>
  )
}

// Add Card
const AddCardButton = props => {
  const classes = useStyles()
  return (
    <Button
      variant="contained"
      color="default"
      className={classes.addCard}
      disableRipple
      startIcon={<AddIcon />}
    >
        Add {props.cardName} Card
    </Button>
  )
}

// Custom Marks
const customMarks = [
  {
    label: '2003',
    value: 2003
  },
  {
    label: '2019',
    value: 2019
  }
]

// YearSlider
const YearSlider = props => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)
  const [year] = useState(state.year)

  const theme = useTheme()
  const matchesSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const matchesMdUp = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Box className={classes.sliderRoot}>
      <Grid container spacing={4}>
        <Grid item xs>
          <Slider
            defaultValue={year}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="on"
            step={1}
            onChangeCommitted={(e, yr) => {
              props.onYear(yr)
            }}
            marks={customMarks}
            min={2003}
            max={2019}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

// Map Zoom Controls
const MapControls = props => {
  const classes = useStyles()

  return (
    <Box className={classes.zoomButtonGroupContainer}>
      <ButtonGroup
        orientation="vertical"
        variant="contained"
        aria-label="Explore data map zoom controls">
        <Button onClick={() => props.handleClick('add')}>
          <AddIcon />
        </Button>
        <Button onClick={() => props.handleClick('remove')}>
          <RemoveIcon />
        </Button>
        <Button onClick={() => props.handleClick('refresh')}>
          <RefreshIcon />
        </Button>
      </ButtonGroup>
    </Box>
  )
}

// Map Offshore
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
    <div className={classes.mapMenuItem}>
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

// Map Level
const MapLevel = props => {
  console.log('MapLevel props: ', props)

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
    console.log('handleMenuItemClick:', event, i)
    setSelectedIndex(i)
    setAnchorEl(i)

    dispatch({ type: 'COUNTY_LEVEL', payload: { countyLevel: i === 1 } })
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className={classes.mapMenuItem}>
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

const ExploreData = () => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)

  const theme = useTheme()
  const matchesSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'))
  const matchesMdUp = useMediaQuery(theme.breakpoints.up('md'))

  // Snackbar state
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'center'
  })
  const { vertical, horizontal, open } = snackbarState

  const cards = state.cards
  const year = state.year

  const [mapX, setMapX] = useState()
  const [mapY, setMapY] = useState()
  const [mapK, setMapK] = useState(0.25)

  let x = mapX
  let y = mapY
  let k = mapK

  const cardCountClass = () => {
    switch (cards.length) {
    case 2:
      return 'cards-2'
    case 3:
      return 'cards-3'
    case 4:
      return 'cards-4'
    default:
      return 'cards-1'
    }
  }

  const setZoom = (x, y, k) => {
    setMapY(y)
    setMapX(x)
    setMapK(k)
  }

  const handleChange = (type, name) => event => {
    setZoom(x, y, k)
    return dispatch({ type: type, payload: { [name]: event.target.checked } })
  }

  const handleClick = val => {
    if (val === 'add' && k >= 0.25) {
      k = k + 0.25
      x = x - 100
    }
    if (val === 'remove' && k >= 0.25) {
      k = k - 0.25
      x = x + 100
    }
    if (val === 'refresh') {
      k = 0.25
      x = 0
      y = 0
    }
    setZoom(x, y, k)
  }

  const handleSnackbar = newState => {
    // console.log('handleSnackbar hit yo!')
    setSnackbarState({ open: true, ...newState })
  }

  const handleSnackbarClose = () => {
    setSnackbarState({ ...snackbarState, open: false })
  }

  const location = state.countyLevel ? 'County' : 'State'

  const onLink = state => {
    setMapK(k)
    setMapY(y)
    setMapX(x)
    if (
      cards.filter(item => item.fips === state.properties.FIPS).length === 0
    ) {
      if (cards.length <= 3) {
        cards.push({
          fips: state.properties.FIPS,
          abbrev: state.properties.abbr,
          name: state.properties.name
        })
      }
      else {
        // console.log('fire alert yo!')
        handleSnackbar({ vertical: 'bottom', horizontal: 'center' })
      }
    }
    return dispatch({ type: 'CARDS', payload: { cards: cards } })
  }

  const onYear = selected => {
    setMapK(k)
    setMapY(y)
    setMapX(x)
    dispatch({ type: 'YEAR', payload: { year: selected } })
  }

  const closeCard = fips => {
    setMapK(k)
    setMapY(y)
    setMapX(x)
    dispatch({ type: 'CARDS', payload: { cards: cards.filter(item => item.fips !== fips) } })
  }

  const { loading, error, data } = useQuery(FISCAL_REVENUE_QUERY, {
    variables: { year, location }
  })
  // const cache = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]
  //  cache.map((year, i) => {
  //      useQuery(FISCAL_REVENUE_QUERY, { variables: { year, location } })
  //  })
  let mapData = [[]]
  if (loading) {
    //
  }

  if (error) return `Error! ${ error.message }`

  if (data) {
    mapData = data.fiscal_revenue_summary.map((item, i) => [
      item.state_or_area,
      item.sum
    ])
  }
  if (mapData) {
    // const timeout = 5000
    return (
      <Fragment>
        <Container maxWidth={false} className={classes.toolbar}>
          <Container>
            <Grid container>
              {/* <Grid item xs={12} sm={4}>
                <Typography variant="h2">Fiscal Year {year} Revenue</Typography>
                {/* <Typography style={{ fontSize: '10px', lineHeight: 'inherit' }}>
                Select a state for detailed production, revenue, and disbursements data.
                </Typography>
              </Grid> */}
              <Grid item xs={12}>
                <Box className={classes.toolbarControls}>
                  <MapLevel onChange={handleChange} />
                  <MapOffshore onChange={handleChange} />
                  <MapExploreMenu />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Container>
        <Container className={classes.mapWrapper} maxWidth={false}>
          <Grid container>
            <Grid item xs={12}>
              <Box className={classes.mapContainer}>
                <Map
                  mapFeatures={state.countyLevel ? 'counties' : 'states'}
                  mapJsonObject={mapJson}
                  mapData={mapData}
                  minColor="#CDE3C3"
                  maxColor="#2F4D26"
                  mapZoom={mapK}
                  mapX={mapX}
                  mapY={mapY}
                  onZoomEnd={
                    event => {
                      //  console.debug('On Zoom in Explore Data', event.transform)
                      x = event.transform.x
                      y = event.transform.y
                      k = event.transform.k
                      // setMapK(event.transform.k)
                      // setMapX(event.transform.x)
                      // setMapY(event.transform.y)
                    }
                  }
                  onClick={(d, fips, foo, bar) => {
                    onLink(d)
                  }} />
                <MapControls
                  handleClick={handleClick}
                />
              </Box>
            </Grid>
            { matchesMdUp &&
            <Grid item xs={12}>
              <Box className={`${ classes.cardContainer } ${ cardCountClass() }`}>
                {cards.map((state, i) => {
                  return (
                    <StateCard
                      key={i}
                      fips={state.fips}
                      abbrev={state.abbrev}
                      name={state.name}
                      minimizeIcon={state.minimizeIcon}
                      closeIcon={state.closeIcon}
                      closeCard={fips => {
                        closeCard(fips)
                      }}
                    />
                  )
                })}
                <AddCardButton cardName="Native American" />
              </Box>
            </Grid>
            }
            <Grid item xs={12}>
              <Box className={classes.sliderContainer}>
                <Container>
                  <YearSlider
                    onYear={selected => {
                      onYear(selected)
                    }}
                  />
                </Container>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Container maxWidth={false} style={{ padding: 0 }}>
          { matchesSmDown &&
          <>
            <Grid item xs={12}>
              <Box className={`${ classes.cardContainer } ${ cardCountClass() }`}>
                {cards.map((state, i) => {
                  return (
                    <StateCard
                      key={i}
                      fips={state.fips}
                      abbrev={state.abbrev}
                      name={state.name}
                      minimizeIcon={state.minimizeIcon}
                      closeIcon={state.closeIcon}
                      closeCard={fips => {
                        closeCard(fips)
                      }}
                    />
                  )
                })}
              </Box>
            </Grid>
            <AddCardButton cardName="Native American" />
          </>
          }
        </Container>
        <Container className={classes.contentWrapper}>
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            key={`${ vertical },${ horizontal }`}
            open={open}
            onClose={handleSnackbarClose}
            message="Only four locations can be viewed at once. Remove one of the location cards to add another location."
          />
          <Grid container>
            <Grid item md={12}>
              <Typography variant="h2" className="header-bar green thick">
                Revenue
              </Typography>
              <Typography variant="body1">
                When companies extract natural resources on federal lands and waters, they pay royalties, rents, bonuses, and other fees, much like they would to any landowner. In fiscal year 2018, ONRR collected a total of [$9,161,704,392] in revenue.
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Typography variant="h3" className="header-bar green thin">
                Compare revenue
              </Typography>
              <Typography variant="body1">
                Add more than one card to compare.  Select states, counties, and offshore regions.
              </Typography>
              <Typography variant="body1">
                You currently have the following cards selected:
              </Typography>
              <div className={classes.stateChipContainer}>
                {
                  cards.map((state, i) => {
                    return (
                      <StateChip key={i} chipName={state.name} />
                    )
                  })
                }
              </div>
            </Grid>
          </Grid>
        </Container>
      </Fragment>
    )
  }
}
export default ExploreData
