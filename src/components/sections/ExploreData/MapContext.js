import React, { useState, useContext, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import {
  useQueryParams,
  StringParam,
  encodeDelimitedArray,
  decodeDelimitedArray
} from 'use-query-params'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Container,
  Grid,
  Box,
  Slide,
  Snackbar,
  useMediaQuery
} from '@material-ui/core'

import { animateScroll as scroll } from 'react-scroll'

import MapControls from './MapControls'
import ExploreDataToolbar from '../../toolbars/ExploreDataToolbar'

import { ExploreDataContext } from '../../../stores/explore-data-store'
import ExploreMoreDataButton from './ExploreMoreDataButton'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

import useWindowSize from '../../../js/hooks/useWindowSize'

import mapCounties from './counties.json'
import mapStates from './states.json'
import mapCountiesOffshore from './counties-offshore.json'
import mapStatesOffshore from './states-offshore.json'

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    margin: 0,
  },
  section: {
    marginTop: theme.spacing(2),
    height: '600px'
  },
  mapContextWrapper: {
    position: 'relative',
    height: 'calc(100vh - 235px)',
    background: theme.palette.grey[200],
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    overflow: 'hidden',
    zIndex: 1,
    border: '2px solid deeppink',
    '& .map-overlay': {
      left: '0',
      right: '0',
      width: '100%',
      height: '100%',
      bottom: '0',
      top: '0',
      transition: '.3s ease',
      opacity: 0,
    },
    '& .map-overlay.active': {
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, .3)',
      zIndex: '300',
      pointerEvents: 'all',
      opacity: 1,
    }
  },
  mapWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    padding: 0,
    overflow: 'hidden',
    background: theme.palette.grey[200],
    display: 'block',
  },
  cardContainer: {
    width: 310,
    position: 'absolute',
    right: 15,
    top: 10,
    height: 'auto',
    zIndex: 99,
    '@media (max-width: 768px)': {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
      alignContent: 'flex-start',
      alignItems: 'flex-end',
      background: 'transparent',
      left: 0,
      top: -75,
      overflowX: 'auto',
      height: 'auto',
      position: 'relative',
    },
    '& > div': {
      cursor: 'pointer',
      '@media (max-width: 768px)': {
        position: 'relative',
        width: '100%',
        margin: 0,
        boxSizing: 'border-box',
        minWidth: 285,
        minHeight: 380,
        marginBottom: theme.spacing(1),
      }
    },
    '& > div:first-child > .summary-card-header': {
      borderBottom: `8px solid ${ theme.palette.explore[400] }`,
    },
    '& > div:nth-child(2)': {
      transform: 'translate3d(-10%, 0px, 0px) !important',
      '@media (max-width: 768px)': {
        transform: 'none !important',
      },
      '& > .summary-card-header': {
        borderBottom: `8px solid ${ theme.palette.explore[300] }`,
      },
    },
    '& > div:nth-child(3)': {
      transform: 'translate3d(-20%, 0px, 0px) !important',
      '@media (max-width: 768px)': {
        transform: 'none !important',
      },
      '& > .summary-card-header': {
        borderBottom: `8px solid ${ theme.palette.explore[200] }`,
      },
    },
    '& > div:nth-child(4)': {
      transform: 'translate3d(-30%, 0px, 0px) !important',
      '@media (max-width: 768px)': {
        transform: 'none !important',
      },
      '& > .summary-card-header': {
        borderBottom: `8px solid ${ theme.palette.explore[100] }`,
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
        '& .minimized ~ div:nth-of-type(2)': {
          transform: 'translate3d(0px, 0px, 0px) !important',
        },
        '& .minimized ~ div:nth-of-type(3)': {
          transform: 'translate3d(-100%, 0px, 0px) !important',
        },
        '& .minimized ~ div:nth-of-type(4)': {
          transform: 'translate3d(-200%, 0px, 0px) !important',
        },
      }
    }
  },
  contentWrapper: {
    paddingBottom: theme.spacing(4),
    minHeight: 500,
  },
  nonStateCardsContainer: {
    position: 'absolute',
    top: 12,
    right: 65,
    width: 50,
    zIndex: 250,
    '& > div': {
      marginTop: 0,
    },
    '@media (max-width: 1120px)': {
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
  cardButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    '& .MuiButton-root': {
      marginRight: theme.spacing(2),
    },
  },
}))

const MapContext = props => {
  const data = useStaticQuery(graphql`
    query StateLinksQuery {
      onrr {
        locations: location(where: {region_type: {_in: ["State", "Offshore", "County"]}, fips_code: {_neq: ""}}, distinct_on: fips_code) {
          fips_code
          location_name
          state
          state_name
          county
          region_type
          district_type
        }
      }
    }
  `)

  const CommaArrayParam = {
    encode: array => encodeDelimitedArray(array, ','),
    decode: arrayStr => decodeDelimitedArray(arrayStr, ',')
  }

  const classes = useStyles()
  const theme = useTheme()
  const size = useWindowSize()

  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'))
  const matchesMdUp = useMediaQuery(theme.breakpoints.up('md'))

  const { state: filterState } = useContext(DataFilterContext)
  const { state: pageState, updateExploreDataCards, updateExploreDataMapZoom } = useContext(ExploreDataContext)

  const cards = pageState.cards

  // urlQuery state
  const [queryParams, setQueryParams] = useQueryParams({
    dataType: StringParam,
    period: StringParam,
    mapLevel: StringParam,
    location: CommaArrayParam,
    offshoreRegions: StringParam,
    commodity: StringParam,
    year: StringParam,
  })

  const [mapOverlay, setMapOverlay] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [mapActive, setMapActive] = useState(true)

  const [mapX, setMapX] = useState(pageState.mapX || 0)
  const [mapY, setMapY] = useState(pageState.mapY || 0)
  const [mapK, setMapK] = useState(pageState.mapZoom)

  // Map snackbar
  const [mapSnackbarState, setMapSnackbarState] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'center'
  })

  useEffect(() => {
    scrollToTop()
    window.addEventListener('scroll', handler)

    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [(typeof window !== 'undefined') ? window.location.pathname : ''])

  // handler
  const handler = () => {
    if (window.pageYOffset > 0) {
      setMapOverlay(true)
      setMapActive(false)
    }
    else {
      setMapOverlay(false)
      setMapActive(true)
    }
  }

  // useEventListener('scroll', handler)

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 0,
      delay: 0,
    })
  }

  const MAX_CARDS = (props.MaxCards) ? props.MaxCards : 3 // 3 cards means 4 cards

  const cardMenuItems = [
    {
      fips_code: 'NF',
      state: 'Nationwide Federal',
      state_name: 'Nationwide Federal',
      location_name: 'Nationwide Federal',
      region_type: '',
      county: '',
      label: 'Add Nationwide Federal card'
    },
    {
      fips_code: 'NA',
      state: 'Native American',
      state_name: 'Native American',
      location_name: 'Native American',
      region_type: '',
      county: '',
      label: 'Add Native American card'
    }
  ]

  const { vertical, horizontal, open } = mapSnackbarState

  const handleMapSnackbar = newState => () => {
    setMapSnackbarState({ open: true, ...newState })
  }

  const handleMapSnackbarClose = () => {
    // setMapSnackbarState({ ...mapSnackbarState, open: false })
  }

  let x = mapX
  let y = mapY
  let k = mapK

  // setZoom
  const setZoom = (x, y, k) => {
    setMapY(y)
    setMapX(x)
    setMapK(k)

    updateExploreDataMapZoom({ ...pageState, mapZoom: { mapX: x, mapY: y, mapZoom: k } })
  }

  // check width, set zoom
  useEffect(() => {
    // mobile zoom
    if (size.width <= 425) {
      setZoom(105, 150, 0.45)
    }
    // tablet zoom
    if (size.width <= 768 && size.width > 425) {
      setZoom(125, 75, 0.75)
    }
  }, [size.width])

  // onLink
  const onLink = (state, x, y, k) => {
    // decern betweeen topo json and location data fips
    const fips = state.properties ? state.id : state.fips_code
    const name = state.properties ? state.properties.name : state.state_name
    const abbr = state.properties ? state.properties.state : state.state
    let region = 'State'
    if (fips.length === 5) {
	    region = 'County'
    }
    const locations = [...data.onrr.locations, cardMenuItems[0], cardMenuItems[1]]

    // filter out location from location data
    const location = locations.filter(item => item.fips_code === fips)

    const stateObj = {
      fipsCode: (location[0]) ? location[0].fips_code : fips,
      name: (location[0]) ? location[0].state_name : name,
      locationName: (location[0]) ? location[0].location_name : name,
      state: (location[0]) ? location[0].state : abbr,
      regionType: (location[0]) ? location[0].region_type : region,
      districtType: (location[0]) ? location[0].district_type : '',
      county: (location[0]) ? location[0].county : ''
    }
    // console.debug('stateObject: ', stateObj)
    if (
      cards.filter(item => item.fipsCode === fips).length === 0
    ) {
      if (cards.length <= MAX_CARDS) {
        cards.push(stateObj)
      }
      else {
        // TODO: snackbar not triggering atm
        handleMapSnackbar({ vertical: 'bottom', horizontal: 'center' })
      }
    }

    updateExploreDataCards({ ...pageState, cards: cards })
  }

  const countyLevel = filterState[DFC.MAP_LEVEL] === DFC.COUNTY_CAPITALIZED
  const offshore = filterState[DFC.OFFSHORE_REGIONS] === true

  const handleClick = val => {
    if (val === 'add' && k >= 0.25) {
      k = k + 0.25
      x = x - 150
    }
    if (val === 'remove' && k >= 0.25) {
      k = k - 0.25
      x = x + 100
    }
    if (val === 'refresh') {
      k = 0.75
      x = 150
      y = 100
    }
    setZoom(x, y, k)
  }

  let mapJsonObject = mapStates
  let mapFeatures = 'states-geo'

  if (countyLevel) {
    if (offshore) {
      mapJsonObject = mapCountiesOffshore
      mapFeatures = 'counties-offshore-geo'
    }
    else {
      mapJsonObject = mapCounties
      mapFeatures = 'counties-geo'
    }
  }
  else {
    if (offshore) {
      mapJsonObject = mapStatesOffshore
      mapFeatures = 'states-offshore-geo'
    }
    else {
      mapJsonObject = mapStates
      mapFeatures = 'states-geo'
    }
  }

  const onZoomEnd = event => {
    x = event.transform.x
    y = event.transform.y
    k = event.transform.k
    setZoom(x, y, k)

    // console.debug("OnZoomEnd", event)
  }

  const onClick = (d, fips, foo, bar) => {
    onLink(d, x, y, k)
  }

  useEffect(() => {
    // get decoded location param
    const locationParam = queryParams.location
    let filteredLocations

    // console.log('queryParams: ', queryParams)

    // filter out location based on location params
    if (typeof locationParam !== 'undefined' && locationParam.length > 0) {
      filteredLocations = data.onrr.locations.filter(item => {
        for (const elem of locationParam) {
          // strip elem of any trailing slash
          const strElem = elem.replace(/\/$/, '')
          if (strElem === item.fips_code) {
            return item
          }
          else {
            // Nationwide Federal card
            if (strElem === 'NF') {
              onLink(cardMenuItems[0])
            }
            // Native American card
            if (strElem === 'NA') {
              onLink(cardMenuItems[1])
            }
          }
        }
      })

      const stateLinks = filteredLocations.map(item => {
        const nObj = {}
        nObj.fips_code = item.fips_code
        nObj.name = item.location_name
        nObj.state = item.state
        nObj.county = item.county
        nObj.regionType = item.region_type
        nObj.districtType = item.district_type
        return nObj
      })

      for (const elem of stateLinks) {
        onLink(elem)
      }
    }
  }, [data])

  useEffect(() => {
    setQueryParams({
      dataType: filterState.dataType,
      period: filterState.period,
      mapLevel: filterState.mapLevel,
      offshoreRegions: filterState.offshoreRegions,
      commodity: filterState.commodity,
      location: cards.length > 0 ? cards.map(item => item.fipsCode) : undefined,
      year: filterState.year
    }, 'replaceIn')
  }, [filterState, pageState])

  // console.log('mapJsonObject: ', mapJsonObject)

  const mapChild = React.cloneElement(props.children[0],
    {
      mapFeatures: mapFeatures, // use context instead
      mapJsonObject: mapJsonObject, // use context instead
      minColor: '#CDE3C3',
      maxColor: '#2F4D26',
      // minColor: theme.palette.explore[100],
      // maxColor: theme.palette.explore[600],
      mapZoom: mapK,
      mapX: mapX,
      mapY: mapY,
      onZoomEnd: onZoomEnd,
      onClick: onClick
    })

  return (
    <>
      <ExploreDataToolbar
        onLink={onLink}
        cardMenuItems={cardMenuItems}
        mapOverlay={mapOverlay} />
      <Container className={classes.mapContextWrapper} maxWidth={false}>
        <Grid container>
          <Grid item xs={12}>
            <Box className={classes.mapWrapper}>
              {mapChild}
              <MapControls
                handleClick={handleClick}
              />
            </Box>
            <Box className={`map-overlay ${ mapOverlay ? 'active' : '' }`}></Box>
          </Grid>
          { matchesMdUp &&
            <Grid item xs={12}>
              <Box className={classes.cardContainer}>
                {cards.map((state, i) => {
                  return (
                    React.cloneElement(props.children[1], {
                      key: i,
                      county: state.county,
                      fipsCode: state.fipsCode,
                      locationName: state.locationName,
                      name: state.name,
                      regionType: state.regionType,
                      districtType: state.districtType,
                      state: state.state
                    })
                  )
                })}
              </Box>
            </Grid>
          }
          <ExploreMoreDataButton />
        </Grid>
      </Container>
      <Container maxWidth={false} style={{ padding: 0, position: 'relative', background: 'white', zIndex: 250 }}>
        { matchesSmDown &&
          <Slide direction="up" in={cards.length > 0} mountOnEnter unmountOnExit>
            <Grid item xs={12}>
              <Box className={classes.cardContainer}>
                {cards.map((state, i) => {
                  return (
                    React.cloneElement(props.children[1], {
                      key: i,
                      county: state.county,
                      fipsCode: state.fipsCode,
                      locationName: state.locationName,
                      name: state.name,
                      regionType: state.regionType,
                      districtType: state.districtType,
                      state: state.state
                    })

                  )
                })}
              </Box>
            </Grid>
          </Slide>
        }
      </Container>
      <Container>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleMapSnackbarClose}
          message="Only four locations can be viewed at once. Remove one of the location cards to add another location."
          key={vertical + horizontal}
          autoHideDuration={6000}
        />
      </Container>
    </>
  )
}

export default MapContext
