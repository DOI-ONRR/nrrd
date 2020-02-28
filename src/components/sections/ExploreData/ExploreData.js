import React, { Fragment, useState, useContext, useEffect, useRef } from 'react'
// import { Link } from "gatsby"

import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import ButtonGroup from '@material-ui/core/ButtonGroup'
import Snackbar from '@material-ui/core/Snackbar'

import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import RefreshIcon from '@material-ui/icons/Refresh'

import { graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Map from '../../data-viz/Map'
import MapToolbar from './MapToolbar'
import StateDetailCard from './StateDetailCard'
import StateCard from '../../layouts/StateCard'

import { StoreContext } from '../../../store'
import mapJson from './us-topology.json'
import { useMediaQuery } from '@material-ui/core'
import { select } from 'd3'
// import  mapJson from './us.t2.json'

console.log('mapJson: ', mapJson)

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

const DISTINCT_LOCATIONS_QUERY = gql`
  query DistinctLocations {
    distinct_locations {
      location
      location_id
      sort_order
    }
  }
`

const MAX_CARDS = 3

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    margin: 0,
  },
  section: {
    marginTop: theme.spacing(2),
    height: '600px'
  },
  mapWrapper: {
    position: 'relative',
    height: 575,
    // marginBottom: theme.spacing(20),
    background: theme.palette.grays[200],
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
    },
    '& > div:nth-child(2)': {
      transform: 'translate3d(-10%, 0px, 0px) !important',
      '@media (max-width: 768px)': {
        transform: 'none !important',
      },
    },
    '& > div:nth-child(3)': {
      transform: 'translate3d(-20%, 0px, 0px) !important',
      '@media (max-width: 768px)': {
        transform: 'none !important',
      },
    },
    '& > div:nth-child(4)': {
      transform: 'translate3d(-30%, 0px, 0px) !important',
      '@media (max-width: 768px)': {
        transform: 'none !important',
      },
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
    borderTop: `1px solid ${ theme.palette.grays[300] }`,
    borderBottom: `1px solid ${ theme.palette.grays[300] }`,
  },
  sliderBox: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    zIndex: 101,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    top: 0,
  },
  sliderRoot: {
  },
  sliderMarkLabel: {
    fontWeight: 'bold',
    top: '28px',
    // color: theme.palette.grays['800'],
    fontSize: '1rem',
  },
  sliderMarkLabelActive: {
    fontWeight: 'bold',
    boxShadow: 'none',
  },
  sliderTrack: {
    height: 4,
    backgroundColor: 'transparent',
  },
  sliderRail: {
    height: 4,
    backgroundColor: theme.palette.grays['500']
  },
  sliderMark: {
    height: 4,
    backgroundColor: theme.palette.common.white,
    width: 0,
  },
  sliderActive: {
    boxShadow: 'none',
    transition: 'none',
    borderRadius: 0,
  },
  sliderThumb: {
    marginTop: -4,
    boxShadow: 'none',
    transition: 'none',
    '&:hover': {
      boxShadow: 'none',
      transition: 'none',
    },
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  sliderValueLabel: {
    width: 60,
    top: -2,
    left: 'calc(-50% + -18px)',
    transform: 'rotate(0deg)',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    '& span': {
      width: 60,
      transform: 'rotate(0)',
      borderRadius: 0,
      textAlign: 'center',
      color: `${ theme.palette.common.white } !important`,
      backgroundColor: theme.palette.primary.dark,
    },
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
  nonStateCardsContainer: {
    position: 'absolute',
    bottom: 102,
    right: 10,
    width: 285,
    zIndex: 99,
    '@media (max-width: 768px)': {
      right: 0,
      bottom: 8,
      width: '100%',
      position: 'inherit',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    }
  },
  addCard: {
    position: 'relative',
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 285,
  },
  formControl: {
    marginRight: theme.spacing(2),
  },
  compareRevenueContainer: {
    marginTop: theme.spacing(7),
  },
  compareCardsContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: theme.spacing(5),
    overflow: 'auto',
    '& media (max-width: 768px)': {
      display: 'relative',
    },
    '& > div': {
      marginRight: theme.spacing(2),
      minWidth: 275,
    },
    '& > div:last-child': {
      margin: theme.spacing(1),
      maxWidth: '25%',
      width: '100%',
      position: 'relative',
      minWidth: 275,
      '@media (max-width: 768px)': {
        maxWidth: '100%',
      }
    },
  },
  addCardContainer: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
    backgroundColor: theme.palette.grays['100'],
  },
  addLocationCard: {
    background: `${ theme.palette.grays['100'] }`,
    '& div:nth-child(1)': {
      background: `${ theme.palette.grays['100'] } !important`,
      '& > span': {
        color: `${ theme.palette.common.black } !important`,
      }
    },
    '& .MuiCardContent-root div': {
      textAlign: 'left',
    }
  },
  cardButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    '& .MuiButton-root': {
      marginRight: theme.spacing(2),
    },
  },
  addCardButtonContainer: {
    marginTop: theme.spacing(2),
    textAlign: 'right',
    '& button': {
      padding: theme.spacing(0.5),
      color: theme.palette.common.black,
      backgroundColor: theme.palette.common.white,
      boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    },
    '@media (max-width: 768px)': {
      textAlign: 'left',
    }
  },
  searchString: {
    fontWeight: 700,
  },
  buttonGroupGrouped: {
    padding: 5,
    background: theme.palette.background.default,
    margin: 0,
  },
  cardHeader: {
    padding: 10,
    height: 75,
    fontSize: '1.2rem',
    '& .MuiCardHeader-action': {
      marginTop: 0,
    },
    '& span': {
      margin: 0,
    },
  },
}))

// get region details from map object
const getRegionProperties = input => {
  let selectedObj
  if (input.length > 2) {
    selectedObj = mapJson.objects.counties.geometries.filter(obj => {
      if (obj.properties.FIPS.toLowerCase() === input.toLowerCase()) {
        return obj.properties
      }
    })
  }
  else {
    selectedObj = mapJson.objects.states.geometries.filter(obj => {
      if (obj.properties.abbr.toLowerCase() === input.toLowerCase()) {
        return obj.properties
      }
    })
  }

  return selectedObj
}

// AddCardButton
const AddCardButton = props => {
  // Map explore menu speed dial

  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const { state, dispatch } = useContext(StoreContext)
  const cards = state.cards

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (index, item) => event => {
    setAnchorEl(null)
    if (typeof item === 'undefined') {
      dispatch({ type: 'CARDS', payload: { cards: cards } })
    }
    else {
      if (item.abbrev === 'National') {
        cards.unshift(item)
      }
      else {
        cards.push(item)
      }
    }

    dispatch({ type: 'CARDS', payload: { cards: cards } })
  }

  return (
    <div className={classes.addCardButtonContainer}>
      <IconButton
        aria-label="Add additional location card menu"
        aria-controls="add-additional-location-card-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}>
        <AddIcon />
      </IconButton>
      <Menu
        id="add-additional-location-card-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose(null)}
      >
        {
          props.menuItems.map((item, i) => <MenuItem key={i} onClick={handleClose(i, item)}>{item.label}</MenuItem>)
        }
      </Menu>
    </div>
  )
}

// Add location card with search
const AddLocationCard = props => {
  const classes = useStyles()

  const { state, dispatch } = useContext(StoreContext)
  const [input, setInput] = useState(null)
  const [keyCount, setKeyCount] = useState(0)
  const cards = state.cards

  const handleSearch = event => {
    setInput(event.target.value)
  }

  const handleChange = val => {
    if (val) {
      if (
        cards.filter(item => item.fips === getRegionProperties(val.location_id)[0].properties.FIPS).length === 0
      ) {
        cards.push({
          fips: getRegionProperties(val.location_id)[0].properties.FIPS,
          abbrev: val.location_id,
          name: val.location
        })
        dispatch({ type: 'CARDS', payload: { cards: cards } })
        setInput(null)
        setKeyCount(keyCount + 1)
      }
    }
  }

  const renderLabel = item => {
    const label = item
    const searchString = input

    if (searchString) {
      const index = label.toLowerCase().indexOf(searchString.toLowerCase())

      if (index !== -1) {
        const length = searchString.length
        const prefix = label.substring(0, index)
        const suffix = label.substring(index + length)
        const match = label.substring(index, index + length)

        return (
          <span>
            {prefix}<Box variant="span" fontWeight="bold" display="inline">{match}</Box>{suffix}
          </span>
        )
      }
    }

    return (
      <span>{label}</span>
    )
  }

  const { loading, error, data } = useQuery(DISTINCT_LOCATIONS_QUERY)

  if (loading) return null
  if (error) return `Error! ${ error.message }`

  if (data) {
    // console.log('explore data: ', data)
    const distinctLocations = data.distinct_locations
    return (
      <Card className={classes.addLocationCard}>
        <CardHeader
          title={props.title}
          classes={{ root: classes.cardHeader }}
        />
        <CardContent>
          <Autocomplete
            key={keyCount}
            id="combo-box-demo"
            autoComplete
            inputValue={input}
            options={distinctLocations}
            getOptionLabel={option => option.location}
            style={{ width: '100%' }}
            renderInput={params => (
              <TextField {...params} label="Search locations..." variant="outlined" fullWidth onChange={handleSearch} />
            )}
            renderOption={option => renderLabel(option.location)}
            onChange={(e, v) => handleChange(v)}
          />
        </CardContent>
        <CardActions>
          { props.menuItems.length > 0 &&
            <AddCardButton menuItems={props.menuItems} />
          }
        </CardActions>
      </Card>
    )
  }
}

// YearSlider
const YearSlider = props => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)
  const [year] = useState(state.year)

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

  return (
    <Box id="year-slider" className={classes.sliderBox}>
      <Grid container spacing={4}>
        <Grid item xs>
          <Slider
            defaultValue={year}
            aria-label="Year slider"
            aria-labelledby="year-slider"
            aria-valuetext={year.toString()}
            valueLabelDisplay="on"
            step={1}
            onChangeCommitted={(e, yr) => {
              props.onYear(yr)
            }}
            marks={customMarks}
            min={2003}
            max={2019}
            classes={{
              root: classes.sliderRoot,
              markLabel: classes.sliderMarkLabel,
              markLabelActive: classes.sliderMarkLabelActive,
              track: classes.sliderTrack,
              rail: classes.sliderRail,
              mark: classes.sliderMark,
              active: classes.sliderActive,
              thumb: classes.sliderThumb,
              valueLabel: classes.sliderValueLabel,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

// Map Controls
const MapControls = props => {
  const classes = useStyles()

  return (
    <Box className={classes.zoomButtonGroupContainer}>
      <ButtonGroup
        orientation="vertical"
        variant="contained"
        aria-label="Explore data map zoom controls"
        classes={{ grouped: classes.buttonGroupGrouped }}>
        <Button onClick={() => props.handleClick('add')} role="button" aria-label="Map zoom in">
          <AddIcon />
        </Button>
        <Button onClick={() => props.handleClick('remove')} role="button" aria-label="Map zoom out">
          <RemoveIcon />
        </Button>
        <Button onClick={() => props.handleClick('refresh')} role="button" aria-label="Map reset">
          <RefreshIcon />
        </Button>
      </ButtonGroup>
    </Box>
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

  const nationalCard = cards && cards.some(item => item.abbrev === 'National')
  const nativeAmericanCard = cards && cards.some(item => item.abbrev === 'Native American')
  let cardMenuItems = []

  if (!nationalCard) {
    cardMenuItems = [{ fips: 99, abbrev: 'National', name: 'National', label: 'Add National card' }]
  }

  if (!nativeAmericanCard) {
    cardMenuItems = [{ fips: undefined, abbrev: 'Native American', name: 'Native American', label: 'Add Native American card' }]
  }

  if (!nationalCard && !nativeAmericanCard) {
    cardMenuItems = [{ fips: 99, abbrev: 'National', name: 'National', label: 'Add National card' }, { fips: undefined, abbrev: 'Native American', name: 'Native American', label: 'Add Native American card' }]
  }

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
      if (cards.length <= MAX_CARDS) {
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
        <Container className={classes.mapWrapper} maxWidth={false}>
          <Grid container>
            <Grid item xs={12}>
              <Box className={classes.mapContainer}>
                <MapToolbar onChange={handleChange} />
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
              </Box>
              { cardMenuItems.length > 0 &&
              <Box className={classes.nonStateCardsContainer}>
                <AddCardButton
                  cards={cards}
                  menuItems={cardMenuItems} />
              </Box>
              }

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
            { cardMenuItems.length > 0 &&
              <Box className={classes.nonStateCardsContainer}>
                <AddCardButton menuItems={cardMenuItems} />
              </Box>
            }
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
              <Box color="secondary.main" mb={1} borderBottom={5} borderColor="secondary.main">
                <Box color="primary.dark"><h2 style={{ margin: '1rem 0 0' }}>Revenue</h2></Box>
              </Box>
              <Typography variant="body1">
                When companies extract natural resources on federal lands and waters, they pay royalties, rents, bonuses, and other fees, much like they would to any landowner. In fiscal year {year}, ONRR collected a total of [$9,161,704,392] in revenue.
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Box color="secondary.main" mb={1} borderBottom={2} borderColor="secondary.main">
                <Box color="primary.dark"><h4 style={{ margin: '1rem 0 0' }}>Compare revenue</h4></Box>
              </Box>
              <Typography variant="body1">
                Add more than one card to compare.  Select states, counties, and offshore regions.
              </Typography>
            </Grid>
          </Grid>
          <Box className={classes.compareCardsContainer}>
            {
              cards.map((card, i) => {
                return (
                  <StateDetailCard
                    key={i}
                    cardTitle={card.name}
                    fips={card.fips}
                    closeCard={fips => {
                      closeCard(fips)
                    }}
                  />
                )
              })
            }
            { (cards.length >= 0 && cards.length <= MAX_CARDS) ? <AddLocationCard title='Add a location' menuItems={cardMenuItems} /> : '' }
          </Box>
        </Container>
      </Fragment>
    )
  }
}

export default ExploreData
