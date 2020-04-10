import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

// utility functions
import utils from '../../../js/utils'
import { StoreContext } from '../../../store'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  CircularProgress
} from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'
import IconMap from '-!svg-react-loader!../../../img/svg/icon-us-map.svg'

import AddLocationCard from './AddLocationCard'

import CONSTANTS from '../../../js/constants'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '25%',
    width: '100%',
    margin: theme.spacing(1),
    '@media (max-width: 768px)': {
      maxWidth: '100%',
    }
  },
  compareCards: {
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
  closeIcon: {
    color: 'white',
    position: 'relative',
    top: theme.spacing(1.75),
    right: theme.spacing(1),
    cursor: 'pointer',
    maxWidth: 20,
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    padding: 10,
    height: 75,
    fontSize: '1.2rem',
    '& .MuiCardHeader-action': {
      marginTop: 0,
    },
    '& span': {
      margin: 0,
    },
    '& span:first-child': {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
  cardHeaderContent: {
    fontSize: theme.typography.h3.fontSize,
  },
  detailCardHeaderContent: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '& svg': {
      maxWidth: 50,
      maxHeight: 50,
      fill: theme.palette.common.white,
    },
    '& span > div': {
      fontSize: theme.typography.caption.fontSize,
    },
  },
  progressContainer: {
    maxWidth: '25%',
    display: 'flex',
    '& > *': {
      marginTop: theme.spacing(3),
      marginRight: 'auto',
      marginLeft: 'auto',
    }
  },
  commodityBox: {
    minheight: 350,
    border: '2px solid purple',
  },
  revenueTypeBox: {
    height: 250,
  },
  circularProgressRoot: {
    color: theme.palette.primary.dark,
  },
  usLocationIcon: {
    fill: theme.palette.common.white,
    marginRight: theme.spacing(1.5),
    height: 75,
    width: 75,
  },
  cardLocationIcon: {
    maxHeight: 50,
    maxWidth: 50,
    marginRight: theme.spacing(1.5),
    filter: 'invert(1)',
  },
  boxTopSection: {
    minHeight: 150,
  },
  boxSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    '& .chart-container': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'top',
      '& .chart': {
        width: '100%',
        height: 250
      },
      '& .legend': {
        marginTop: theme.spacing(2),
        height: 'auto',
      },
    },
  }
}))

const APOLLO_QUERY = gql`
  query ExploreDataCompareQuery {
    # land stats
    land_stats {
      federal_acres
      federal_percent
      location
      total_acres
    }
  }
`

const nonStateOrCountyCards = [
  CONSTANTS.NATIONWIDE_FEDERAL,
  CONSTANTS.NATIVE_AMERICAN
]

// Card title
const CardTitle = props => {
  const classes = useStyles()

  const landStatsData = props.data

  const stateTitle = props.stateTitle
  const stateAbbr = props.state ? props.state : props.stateAbbr
  const isCounty = props.stateAbbr.length > 2

  // Get land percentage
  const getLandPercent = stateOrArea => {
    const loc = stateOrArea === 'Nationwide Federal' ? 'National' : stateOrArea
    const landStat = landStatsData.find(item => item.location === loc)
    if (landStat) return <Box>{ `${ utils.round(landStat.federal_percent, 1) }% federal` }</Box>
  }

  let cardTitle = `${ props.stateTitle }`

  if (isCounty && !nonStateOrCountyCards.includes(stateTitle)) {
    cardTitle = `${ stateTitle }, ${ stateAbbr }`
  }

  let svgImg

  if (nonStateOrCountyCards.includes(stateTitle)) {
    svgImg = <IconMap className={classes.usLocationIcon} alt="US Icon" />
  }
  else {
    svgImg = (!isCounty) ? <img src={`/maps/states/${ stateAbbr }.svg`} alt={`${ stateAbbr } State Icon`} className={classes.cardLocationIcon} /> : ''
  }

  return (
    <div className={classes.detailCardHeaderContent}>
      {svgImg}
      <span>
        {cardTitle}
        {getLandPercent(stateAbbr)}
      </span>
    </div>
  )
}

const DetailCards = props => {
  const classes = useStyles()

  const { state, dispatch } = useContext(StoreContext)
  const cards = state.cards

  const MAX_CARDS = (props.MaxCards) ? props.MaxCards : 3 // 3 cards means 4 cards

  const { loading, error, data } = useQuery(APOLLO_QUERY)

  const closeCard = fips => {
    dispatch({ type: 'CARDS', payload: { cards: cards.filter(item => item.fips !== fips) } })
  }

  // card Menu Item for adding/removing Nationwide Federal or Native American cards
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

  // onLink
  const onLink = state => {
    // setMapK(k)
    // setMapY(y)
    // setMapX(x)
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
        handleSnackbar({ vertical: 'bottom', horizontal: 'center' })
        setSnackbarState({ ...snackbarState, open: false })
      }
    }
    return dispatch({ type: 'CARDS', payload: { cards: cards } })
  }

  // const dataSet = `FY ${ year }`

  let landStatsData

  if (loading) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </div>
    )
  }

  if (error) return `Error! ${ error.message }`

  if (data) {
    landStatsData = data.land_stats
  }

  return (
    <>
      <Box className={classes.compareCards}>
        {cards.map((card, i) => {
          return (
            <Card className={`${ classes.root } ${ props.cardCountClass }`}>
              <CardHeader
                title={<CardTitle data={landStatsData} stateTitle={card.name} stateAbbr={card.abbr} state={card.abbr} />}
                action={<CloseIcon
                  className={classes.closeIcon}
                  onClick={(e, i) => {
                    closeCard(card.fips)
                  }}
                />}
                classes={{ root: classes.cardHeader, content: classes.cardHeaderContent }}
                disableTypography
              />
              <CardContent>
                {props.children}
              </CardContent>
              <CardActions></CardActions>
            </Card>
          )
        })
        }

        { (cards.length >= 0 && cards.length <= CONSTANTS.MAX_CARDS) ? <AddLocationCard title='Add another card' onLink={onLink} cardMenuItems={cardMenuItems} /> : '' }
      </Box>
    </>
  )
}

export default DetailCards
