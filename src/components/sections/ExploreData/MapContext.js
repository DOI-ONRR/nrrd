import React, { useState, useContext, useEffect } from 'react'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Container,
  Grid,
  Box,
  Snackbar,
  useMediaQuery
} from '@material-ui/core'

import { animateScroll as scroll } from 'react-scroll'

import MapToolbar from './MapToolbar'
import MapControls from './MapControls'
import AddCardButton from './AddCardButton'
import YearSlider from './YearSlider'

import { StoreContext } from '../../../store'
import ExploreMoreDataButton from './ExploreMoreDataButton'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

import useEventListener from '../../../js/use-event-listener'

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
    height: 'calc(100vh - 185px)',
    background: theme.palette.grey[200],
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      height: 'calc(100vh - 132px)',
    },
    '& .mapContainer': {
      position: 'fixed',
      top: 65,
    },
    '& .legend': {
      bottom: 175,
      '@media (max-width: 425px)': {
        bottom: 150,
      },
      '@media (max-width: 768px)': {
        bottom: 162,
        margin: '0',
      },
    },
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
    right: 0,
    bottom: 92,
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
      minHeight: 'inherit',
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
        minHeight: 325,
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
  const classes = useStyles()
  const { state: filterState, updateDataFilter } = useContext(DataFilterContext)
  const { state: pageState, dispatch } = useContext(StoreContext)
  const cards = pageState.cards

  const [mapOverlay, setMapOverlay] = useState(false)
  const [mapActive, setMapActive] = useState(true)

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

  useEffect(() => {
    scrollToTop()
    window.addEventListener('scroll', handler)

    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [(typeof window !== 'undefined') ? window.location.pathname : ''])

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 0,
      delay: 0,
    })
  }

  const [mapX, setMapX] = useState(pageState.mapX || 0)
  const [mapY, setMapY] = useState(pageState.mapY || 0)
  const [mapK, setMapK] = useState(pageState.mapZoom)

  const MAX_CARDS = (props.MaxCards) ? props.MaxCards : 3 // 3 cards means 4 cards

  const cardMenuItems = [
    { fips: 99, abbr: 'Nationwide Federal', name: 'Nationwide Federal', label: 'Add Nationwide Federal card' },
    { fips: undefined, abbr: 'Native American', name: 'Native American', label: 'Add Native American card' }
  ]

  // Map snackbar
  const [mapSnackbarState, setMapSnackbarState] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'center'
  })

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

  // onYear
  const onYear = (selected, x, y, k) => {
    setMapK(k)
    setMapY(y)
    setMapX(x)
    updateDataFilter({ ...filterState, [DFC.YEAR]: selected })
  }
  // setZoom
  const setZoom = (x, y, k) => {
    // console.debug("WTH MapContext.setZoom: ", x,y,k);
    setMapY(y)
    setMapX(x)
    setMapK(k)

    dispatch({ type: 'MAP_ZOOM', payload: { mapX: x, mapY: y, mapZoom: k } })
  }

  // onLink
  const onLink = (state, x, y, k) => {
    // setMapK(k)
    // setMapY(y)
    // setMapX(x)
    // console.debug("WTF MapContext.onLink: ", state, x, y, k)
    let fips = state.properties ? state.properties.FIPS : state.fips
    const name = state.properties ? state.properties.name : state.name
    if (fips === undefined) {
      fips = state.id
    }
    let stateAbbr
    let abbr
    if (fips && fips.length > 2) {
      abbr = fips
      stateAbbr = state.properties.state ? state.properties.state : state.properties.region
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
        return handleMapSnackbar({ vertical: 'bottom', horizontal: 'center' })
      }
    }

    dispatch({ type: 'CARDS', payload: cards })
  }

  const countyLevel = filterState[DFC.COUNTIES] === 'County'
  const offshore = filterState[DFC.OFFSHORE_REGIONS] === 'Show'

  const theme = useTheme()
  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'))
  const matchesMdUp = useMediaQuery(theme.breakpoints.up('md'))

  const handleChange = (type, name) => event => {
     // console.debug("WTH MapContext.handleChange: ", val);
    // setZoom(x, y, k)
    updateDataFilter({ ...filterState, [type]: event.target.checked })
  }

  const handleClick = val => {
    // console.debug("WTH MapContext.handleClick: ", val);
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
  }

  const onClick = (d, fips, foo, bar) => {
    onLink(d, x, y, k)
  }

  const mapChild = React.cloneElement(props.children[0],
    {
      mapFeatures: mapFeatures, // use context instead
      mapJsonObject: mapJsonObject, // use context instead
      minColor: '#CDE3C3', //local
      maxColor: '#2F4D26', //local
      mapZoom: mapK, //use context
      mapX: mapX,    // use context
      mapY: mapY,    // use context
      onZoomEnd: onZoomEnd, //local
      onClick: onClick //local
    })

  return (
    <>
      <Container className={classes.mapContextWrapper} maxWidth={false}>
        <Grid container>
          <Grid item xs={12}>
            <Box className={classes.mapWrapper}>
              <MapToolbar onLink={onLink} onChange={handleChange} cardMenuItems={cardMenuItems} />
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
                      fips: state.fips,
                      abbr: state.abbr,
                      name: state.name,
                    })
                  )
                })}
              </Box>
              { cardMenuItems.length > 0 &&
              <Box className={classes.nonStateCardsContainer}>
                <AddCardButton
                  cards={cards}
                  cardMenuItems={cardMenuItems}
                  onLink={onLink} />
              </Box>
              }
            </Grid>
          }

          <ExploreMoreDataButton />
          <YearSlider
            onYear={selected => {
              onYear(selected, x, y, k)
            }}
          />
        </Grid>
      </Container>
      <Container maxWidth={false} style={{ padding: 0, position: 'relative', background: 'white', zIndex: 250 }}>
        { matchesSmDown &&
          <>
            <Grid item xs={12}>
              <Box className={classes.cardContainer}>
                {cards.map((state, i) => {
                  return (
                    React.cloneElement(props.children[1], {
                      key: i,
                      fips: state.fips,
                      abbr: state.abbr,
                      name: state.name,
                    })

                  )
                })}
              </Box>
            </Grid>
            { cardMenuItems.length > 0 &&
                <Box className={classes.nonStateCardsContainer}>
                  <AddCardButton onLink={onLink} cardMenuItems={cardMenuItems} />
                </Box>
            }
          </>
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
