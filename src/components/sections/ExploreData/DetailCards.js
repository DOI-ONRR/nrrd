import React, { useContext, useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'

// utility functions
import utils from '../../../js/utils'
import { StoreContext } from '../../../store'

// import { DataFilterContext } from '../../../stores/data-filter-store'
// import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

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
    },
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
      minWidth: 275,
      '@media (max-width: 768px)': {
        maxWidth: '100%',
      }
    },
    '& .card-content-container': {
      display: 'flex',
      flexDirection: 'column',
    },
    '& .card-content-container > div:first-of-type': {
      minHeight: 165,
    },
    '& .card-content-container > div:nth-child(2) .chart-container .legend': {
      minHeight: 275
    },
    '& .card-content-container > div:nth-child(3) .chart-container .legend': {
      minHeight: 245
    }
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
}))

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
  const data = useStaticQuery(graphql`
    query LandStatsQuery {
      onrr {
        land_stats {
          federal_acres
          federal_percent
          location
          total_acres
        }
      }
    }
  `)
  const classes = useStyles()

  const { state: pageState, dispatch } = useContext(StoreContext)
  const cards = pageState.cards

  const MAX_CARDS = (props.MaxCards) ? props.MaxCards : 3 // 3 cards means 4 cards

  // const { loading, error, data } = useQuery(APOLLO_QUERY)

  const closeCard = fips => {
    // console.log('fips: ', fips)
    dispatch({ type: 'CARDS', payload: cards.filter(item => item.fips !== fips) })
  }

  // card Menu Item for adding/removing Nationwide Federal or Native American cards
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

  const handleMapSnackbar = newState => {
    setMapSnackbarState({ open: true, ...newState })
  }

  const handleMapSnackbarClose = () => {
    setMapSnackbarState({ ...mapSnackbarState, open: false })
  }

  // onLink
  const onLink = state => {
    // console.log('onLink state: ', state)
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
        handleMapSnackbar({ vertical: 'bottom', horizontal: 'center' })
        setMapSnackbarState({ ...snackbarState, open: false })
      }
    }

    dispatch({ type: 'CARDS', payload: cards })
  }

  const landStatsData = data.onrr.land_stats

  return (
    <>
      <Box className={classes.compareCards}>
        {cards.map((card, i) => {
          const children = React.Children.map(props.children, child =>
            React.cloneElement(child, {
              key: i,
              fips: card.fips,
              abbr: card.abbr,
              name: card.name,
              state: card.state
            })
          )
          return (
            <Card className={classes.root} key={i}>
              <CardHeader
                title={<CardTitle data={landStatsData} stateTitle={card.name} stateAbbr={card.abbr} state={card.state} />}
                action={<CloseIcon
                  className={classes.closeIcon}
                  onClick={(e, i) => {
                    closeCard(card.fips)
                  }}
                />}
                classes={{ root: classes.cardHeader, content: classes.cardHeaderContent }}
                disableTypography
              />
              <CardContent className="card-content-container">
                {children}
              </CardContent>
              <CardActions></CardActions>
            </Card>
          )
        })
        }

        { (cards.length >= 0 && cards.length <= MAX_CARDS) ? <AddLocationCard title='Add another card' onLink={onLink} cardMenuItems={cardMenuItems} /> : '' }
      </Box>
    </>
  )
}

export default DetailCards
