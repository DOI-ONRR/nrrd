import React, { useState, useContext } from 'react'
import { graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Container,
  Typography,
  Slider,
  Grid,
  Box,
  Button,
  ButtonGroup,
  TextField,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  useMediaQuery
} from '@material-ui/core'

import { Autocomplete } from '@material-ui/lab'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import RefreshIcon from '@material-ui/icons/Refresh'

import Map from '../../data-viz/Map'
import MapToolbar from './MapToolbar'
import DetailCard from './DetailCard'
import SummaryCard from './SummaryCard'

import { StoreContext } from '../../../store'
import mapJson from './us-topology.json'

import utils from '../../../js/utils'

import CONSTANTS from '../../../js/constants'

import { select } from 'd3'
import LineChart from '../../data-viz/LineChart/LineChart.js'
// import  mapJson from './us.t2.json'

// import StatesSvg from '-!svg-react-loader!../../../img/svg/usstates/all.svg'

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
    fiscal_revenue_summary(where: {state_or_area: {_nin: ["Nationwide Federal", ""]}, fiscal_year: { _eq: $year }, location_type: { _eq: $location } }) {
      fiscal_year
      state_or_area
      sum
    }
  }
`

const LOCATION_TOTAL_QUERY = gql`
  query NationwideFederal($stateOrArea: String!, $year: Int!) {
    fiscal_revenue_summary(where: {state_or_area: {_eq: $stateOrArea, _neq: ""}, fiscal_year: {_eq: $year}}) {
      fiscal_year
      state_or_area
      sum
    }
  }
`

const DISTINCT_LOCATIONS_QUERY = gql`
  query DistinctLocations {
    distinct_locations(where: {location: {_neq: ""}}) {
      location
      location_id
      sort_order
    }
  }
`

const FISCAL_YEARS_QUERY = gql`
  query FiscalYears($period: String!) {
    period(where: {period: {_eq: $period }}) {
      fiscal_year
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
    minHeight: 575,
    '@media (max-width: 768px)': {
      height: 350,
      minHeight: 350,
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
    borderTop: `1px solid ${ theme.palette.grey[300] }`,
    borderBottom: `1px solid ${ theme.palette.grey[300] }`,
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
    color: theme.palette.grey['900'],
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
    backgroundColor: theme.palette.grey['500']
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
      marginRight: theme.spacing(1),
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
    backgroundColor: theme.palette.grey['100'],
  },
  addLocationCard: {
    background: `${ theme.palette.grey['100'] }`,
    '& div:nth-child(1)': {
      background: `${ theme.palette.grey['100'] } !important`,
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
  cardHeaderContent: {
    fontSize: theme.typography.h3.fontSize,
  },
  autoCompleteRoot: {
    background: theme.palette.background.default,
    color: theme.palette.primary.dark,
  },
  autoCompleteFocused: {
    color: theme.palette.primary.dark,
  }
}))

// get region details from map object
const getRegionProperties = input => {
  // check for fips_code that are only 4 digits, the data values should all be 5
  input = input.length === 4 ? input = `0${ input }` : input

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

// AddCardButton - map speed dial button
const AddCardButton = props => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (index, item) => event => {
    setAnchorEl(null)
    if (typeof item !== 'undefined') {
      props.onLink(item)
    }
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

  const [input, setInput] = useState(null)
  const [keyCount, setKeyCount] = useState(0)

  const handleSearch = event => {
    setInput(event.target.value)
  }

  const handleChange = val => {
    if (val) {
      const item = getRegionProperties(val.location_id)[0]
      props.onLink(item)
      setInput(null)
      setKeyCount(keyCount + 1)
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
    const distinctLocations = data.distinct_locations
    return (
      <Card className={classes.addLocationCard}>
        <CardHeader
          title={props.title}
          classes={{ root: classes.cardHeader, content: classes.cardHeaderContent }}
          disableTypography
        />
        <CardContent>
          <Autocomplete
            key={keyCount}
            id="location-selecte"
            autoComplete
            inputValue={input}
            options={distinctLocations}
            getOptionLabel={option => option.location}
            style={{ width: '100%' }}
            renderInput={params => (
              <TextField
                {...params}
                label="Search locations..."
                variant="outlined"
                fullWidth
                onChange={handleSearch}
              />
            )}
            renderOption={option => renderLabel(option.location)}
            onChange={(e, v) => handleChange(v)}
            classes={{
              inputRoot: classes.autoCompleteRoot,
              focused: classes.autoCompleteFocused,
            }}
          />
        </CardContent>
        <CardActions>
          { props.menuItems.length > 0 &&
            <AddCardButton onLink={props.onLink} menuItems={props.menuItems} />
          }
        </CardActions>
      </Card>
    )
  }
}

// YearSlider
const YearSlider = props => {
  const classes = useStyles()
  const { state } = useContext(StoreContext)
  const [year] = useState(state.year)

  const { loading, error, data } = useQuery(FISCAL_YEARS_QUERY, { variables: { period: 'Fiscal Year' } })

  let periodData
  let minYear
  let maxYear

  if (loading) return null
  if (error) return `Error loading revenue data table ${ error.message }`

  if (data) {
    periodData = data.period

    // set min and max trend years
    minYear = periodData.reduce((min, p) => p.fiscal_year < min ? p.fiscal_year : min, periodData[0].fiscal_year)
    maxYear = periodData.reduce((max, p) => p.fiscal_year > max ? p.fiscal_year : max, periodData[periodData.length - 1].fiscal_year)
  }

  const customMarks = [
    {
      label: minYear,
      value: minYear
    },
    {
      label: maxYear,
      value: maxYear
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
            min={minYear}
            max={maxYear}
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

// location total
const LocationTotal = props => {
  const { format, stateOrArea } = props
  const { state } = useContext(StoreContext)
  const year = state.year

  const { loading, error, data } = useQuery(LOCATION_TOTAL_QUERY, {
    variables: { stateOrArea, year }
  })

  if (loading) return ''
  if (error) return `Error loading revenue data table ${ error.message }`

  if (data) {
    return (
      <>
        { data.fiscal_revenue_summary.length > 0 ? format(data.fiscal_revenue_summary[0].sum) : format(0) }
      </>
    )
  }
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

  const nationalCard = cards && cards.some(item => item.abbr === 'Nationwide Federal')
  const nativeAmericanCard = cards && cards.some(item => item.abbr === 'Native American')
  let cardMenuItems = []

  if (!nationalCard) {
    cardMenuItems = [{ fips: 99, abbr: 'Nationwide Federal', name: 'Nationwide Federal', label: 'Add Nationwide Federal card' }]
  }

  if (!nativeAmericanCard) {
    cardMenuItems = [{ fips: undefined, abbr: 'Native American', name: 'Native American', label: 'Add Native American card' }]
  }

  if (!nationalCard && !nativeAmericanCard) {
    cardMenuItems = [{ fips: 99, abbr: 'Nationwide Federal', name: 'Nationwide Federal', label: 'Add Nationwide Federal card' }, { fips: undefined, abbr: 'Native American', name: 'Native American', label: 'Add Native American card' }]
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
    console.debug('onLink:', state)

    const fips = state.properties ? state.properties.FIPS : state.fips
    const name = state.properties ? state.properties.name : state.name
    let stateAbbr
    let abbr

    if (fips && fips.length > 2) {
      abbr = fips
      stateAbbr = state.properties.state
    }
    else {
      abbr = state.properties ? state.properties.abbr : state.abbr
      stateAbbr = state.properties ? state.properties.abbr : state.abbr
    }

    const stateObj = {
      fips: fips,
      abbr: abbr,
      name: name,
      state: stateAbbr
    }

    if (
      cards.filter(item => item.fips === fips).length === 0
    ) {
      if (cards.length <= MAX_CARDS) {
        if (stateObj.abbr && stateObj.abbr.match(/Nationwide Federal/)) {
          cards.unshift(stateObj)
        }
        else {
          cards.push(stateObj)
        }
      }
      else {
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

  let mapData = [[]]

  if (loading) return 'Loading...'
  if (error) return `Error loading revenue data table ${ error.message }`

  if (data) {
    mapData = data.fiscal_revenue_summary.map((item, i) => [
      item.state_or_area,
      item.sum
    ])
  }
  if (mapData) {
    return (
      <>
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
                    <SummaryCard
                      key={i}
                      fips={state.fips}
                      abbr={state.abbr}
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
                  menuItems={cardMenuItems}
                  onLink={onLink} />
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
                    <SummaryCard
                      key={i}
                      fips={state.fips}
                      abbr={state.abbr}
                      name={state.name}
                      year={state.year}
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
                <AddCardButton onLink={onLink} menuItems={cardMenuItems} />
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
              <Box mb={1} color="secondary.main" borderBottom={5}>
                <Box component="h2" color="secondary.dark">Revenue</Box>
              </Box>
              <Typography variant="body1">
                When companies extract natural resources on federal lands and waters, they pay royalties, rents, bonuses, and other fees, much like they would to any landowner. <strong>In fiscal year {year}, ONRR collected a total of <LocationTotal stateOrArea="Nationwide Federal" format={d => utils.formatToDollarInt(d)} /> in revenue.</strong>
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
                <Box component="h3" color="secondary.dark">Compare revenue</Box>
              </Box>
              <Box fontSize="body1.fontSize">
                Add more than one card to compare.  Select states, counties, and offshore regions.
              </Box>
              <Box fontSize="body1.fontSize">
                { cards.length > 0 &&
                  <Box>You currently have {cards.length > 0 ? 'the following cards selected.' : 'no cards selected.'}</Box>
                }
              </Box>
            </Grid>
          </Grid>
          <Box className={classes.compareCardsContainer}>
            {
              cards.map((card, i) => {
                return (
                  <DetailCard
                    key={i}
                    cardTitle={card.name}
                    fips={card.fips}
                    abbr={card.abbr}
                    state={card.state}
                    name={card.name}
                    closeCard={fips => {
                      closeCard(fips)
                    }}
                    total={<LocationTotal stateOrArea={card.abbr} format={d => utils.formatToDollarInt(d)} />}
                  />
                )
              })
            }
            { (cards.length >= 0 && cards.length <= MAX_CARDS) ? <AddLocationCard title='Add another card' onLink={onLink} menuItems={cardMenuItems} /> : '' }
          </Box>
        </Container>
      </>
    )
  }
}

export default ExploreData
