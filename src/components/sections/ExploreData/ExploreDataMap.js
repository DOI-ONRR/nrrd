import React, { useState, useContext } from 'react'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Container,
  Grid,
  Box,
  useMediaQuery
} from '@material-ui/core'

import Map from '../../data-viz/Map'
import MapToolbar from './MapToolbar'
import MapControls from './MapControls'
import AddCardButton from './AddCardButton'
import SummaryCard from './SummaryCard'
import YearSlider from './YearSlider'
import MapSnackbar from './MapSnackbar'
import { RevenueSummary } from './Revenue'

import { StoreContext } from '../../../store'

import mapCounties from './counties.json'
import mapStates from './states.json'
import mapCountiesOffshore from './counties-offshore.json'
import mapStatesOffshore from './states-offshore.json'

import CONSTANTS from '../../../js/constants'

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
  contentWrapper: {
    paddingBottom: theme.spacing(4),
    minHeight: 500,
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
  cardButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    '& .MuiButton-root': {
      marginRight: theme.spacing(2),
    },
  },
}))

export default props => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)

  const [mapX, setMapX] = useState()
  const [mapY, setMapY] = useState()
  const [mapK, setMapK] = useState(0.25)

  let x = mapX
  let y = mapY
  let k = mapK

  const {
    cardMenuItems,
    closeCard,
    onLink,
    onYear,
    setZoom
  } = props.exploreDataProps

  const cards = state.cards
  const countyLevel = state.countyLevel === 'County'
  const offshore = state.offshoreData === 'On'
  const year = state.year
  const dataType = state.dataType

  const mapData = props.mapData
  const periodData = props.periodData

  const theme = useTheme()
  const matchesSmDown = useMediaQuery(theme.breakpoints.down('sm'))
  const matchesMdUp = useMediaQuery(theme.breakpoints.up('md'))

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

  return (
    <>
      {mapData &&
        <>
          <Container className={classes.mapWrapper} maxWidth={false}>
            <Grid container>
              <Grid item xs={12}>
                <Box className={classes.mapContainer}>
                  <MapToolbar onChange={handleChange} />
                  <Map
                    mapFeatures={mapFeatures}
                    mapJsonObject={mapJsonObject}
                    mapData={mapData}
                    minColor="#CDE3C3"
                    maxColor="#2F4D26"
                    mapZoom={mapK}
                    mapX={mapX}
                    mapY={mapY}
                    onZoomEnd={
                      event => {
                        x = event.transform.x
                        y = event.transform.y
                        k = event.transform.k
                      }
                    }
                    onClick={(d, fips, foo, bar) => {
                      onLink(d, x, y, k)
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
                      periodData={periodData}
                      closeIcon={state.closeIcon}
                      closeCard={fips => {
                        closeCard(fips)
                      }}
                    >
                      {dataType === CONSTANTS.REVENUE &&
                        <RevenueSummary />
                      }

                      {dataType === CONSTANTS.DISBURSEMENTS &&
                        <span>Disbursements summary card content!</span>
                      }

                      {dataType === CONSTANTS.PRODUCTION &&
                        <span>Production summary card content!</span>
                      }

                    </SummaryCard>
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
              <Grid item xs={12}>
                <Box className={classes.sliderContainer}>
                  <Container>
                    <YearSlider
                      data={periodData}
                      onYear={selected => {
                        onYear(selected, x, y, k)
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
                <AddCardButton onLink={onLink} cardMenuItems={cardMenuItems} />
              </Box>
            }
          </>
            }
          </Container>
          <Container>
            <MapSnackbar message="Only four locations can be viewed at once. Remove one of the location cards to add another location." />
          </Container>
        </>
      }
    </>
  )
}
