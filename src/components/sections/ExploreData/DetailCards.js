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
import { ExploreDataLink } from '../../layouts/IconLinks/ExploreDataLink'

import CircleChart from '../../data-viz/CircleChart/CircleChart.js'

import Sparkline from '../../data-viz/Sparkline'

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
    minHeight: 475,
  },
  revenueTypeBox: {
    minHeight: 430,
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
    // border: '1px solid deeppink',
    '& > div:last-child': {
      minHeight: 550,
    },
  }
}))

const APOLLO_QUERY = gql`
  query ExploreDataCompareQuery($period: String!) {
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
  const year = state.year
  const cards = state.cards

  const stateAbbr = (props.abbr.length > 2) ? props.abbr : props.state

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { period: CONSTANTS.FISCAL_YEAR,  }
  })

  const closeCard = fips => {
    dispatch({ type: 'CARDS', payload: { cards: cards.filter(item => item.fips !== fips) } })
  }

  const dataSet = `FY ${ year }`


  let landStatsData


  if (loading) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </div>
    )
  }

  if (error) return `Error! ${ error.message }`

  if ( data ) {
    landStatsData = data.landStats
  }
  return (
    <Card className={`${ classes.root } ${ props.cardCountClass }`}>
      <CardHeader
        title={<CardTitle data={landStatsData} stateTitle={props.cardTitle} stateAbbr={stateAbbr} state={props.state} />}
        action={<CloseIcon
          className={classes.closeIcon}
          onClick={(e, i) => {
            closeCard(props.fips)
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
}

export default DetailCards
