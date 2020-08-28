import React, { useContext } from 'react'
import { useStaticQuery, graphql } from 'gatsby'

// utility functions
import utils from '../../../js/utils'
import { StoreContext } from '../../../store'
import { DataFilterContext } from '../../../stores/data-filter-store'

import CardTitle from './CardTitle'

import { isIE } from 'react-device-detect'

// import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Card,
  CardActions,
  CardHeader,
  CardContent
} from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'
import {
  IconUsMapImg,
  MapStateAKImg,
  MapStateALImg,
  MapStateARImg,
  MapStateAZImg,
  MapStateCAImg,
  MapStateCOImg,
  MapStateCTImg,
  MapStateDCImg,
  MapStateDEImg,
  MapStateFLImg,
  MapStateGAImg,
  MapStateHIImg,
  MapStateIAImg,
  MapStateIDImg,
  MapStateILImg,
  MapStateINImg,
  MapStateKSImg,
  MapStateKYImg,
  MapStateLAImg,
  MapStateMAImg,
  MapStateMDImg,
  MapStateMEImg,
  MapStateMIImg,
  MapStateMNImg,
  MapStateMOImg,
  MapStateMSImg,
  MapStateMTImg,
  MapStateNCImg,
  MapStateNDImg,
  MapStateNEImg,
  MapStateNHImg,
  MapStateNJImg,
  MapStateNMImg,
  MapStateNVImg,
  MapStateNYImg,
  MapStateOHImg,
  MapStateOKImg,
  MapStateORImg,
  MapStatePAImg,
  MapStateRIImg,
  MapStateSCImg,
  MapStateSDImg,
  MapStateTNImg,
  MapStateTXImg,
  MapStateUTImg,
  MapStateVAImg,
  MapStateVTImg,
  MapStateWAImg,
  MapStateWIImg,
  MapStateWVImg,
  MapStateWYImg
} from '../../images'

import AddLocationCard from './AddLocationCard'

import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const components = {
  AK: MapStateAKImg,
  AL: MapStateALImg,
  AR: MapStateARImg,
  AZ: MapStateAZImg,
  CA: MapStateCAImg,
  CO: MapStateCOImg,
  CT: MapStateCTImg,
  DC: MapStateDCImg,
  DE: MapStateDEImg,
  FL: MapStateFLImg,
  GA: MapStateGAImg,
  HI: MapStateHIImg,
  IA: MapStateIAImg,
  ID: MapStateIDImg,
  IL: MapStateILImg,
  IN: MapStateINImg,
  KS: MapStateKSImg,
  KY: MapStateKYImg,
  LA: MapStateLAImg,
  MA: MapStateMAImg,
  MD: MapStateMDImg,
  ME: MapStateMEImg,
  MI: MapStateMIImg,
  MN: MapStateMNImg,
  MO: MapStateMOImg,
  MS: MapStateMSImg,
  MT: MapStateMTImg,
  NC: MapStateNCImg,
  ND: MapStateNDImg,
  NE: MapStateNEImg,
  NH: MapStateNHImg,
  NJ: MapStateNJImg,
  NM: MapStateNMImg,
  NV: MapStateNVImg,
  NY: MapStateNYImg,
  OH: MapStateOHImg,
  OK: MapStateOKImg,
  OR: MapStateORImg,
  PA: MapStatePAImg,
  RI: MapStateRIImg,
  SC: MapStateSCImg,
  SD: MapStateSDImg,
  TN: MapStateTNImg,
  TX: MapStateTXImg,
  UT: MapStateUTImg,
  VA: MapStateVAImg,
  VT: MapStateVTImg,
  WA: MapStateWAImg,
  WI: MapStateWIImg,
  WV: MapStateWVImg,
  WY: MapStateWYImg
}

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '25%',
    width: '100%',
    margin: theme.spacing(1),
    '@media (max-width: 768px)': {
      maxWidth: '100%',
    },
    '& .cardContent__Revenue': {
      gridTemplateRows: '185px 660px auto',
    },
    '& .cardContent__Disbursements': {
      gridTemplateRows: '185px 855px 650px',
    },
    '& .cardContent__Production': {
      gridTemplateRows: '185px 325px 835px',
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
    top: 5,
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
    alignItems: 'center',
    '& .MuiCardHeader-action': {
      marginTop: 0,
    },
    '& span': {
      margin: 0,
    },
    '& span:first-child': {
      marginTop: 0,
      marginRight: theme.spacing(1),
      fontSize: '1.25rem',
    },
  },
  cardHeaderContent: {
    fontSize: theme.typography.h3.fontSize,
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
    marginTop: 15,
  },
  cardContentContainer: {
    display: isIE ? 'block' : 'grid',
    minHeight: 1500,
    '& > div': {
      margin: 0,
    },
  },
  detailCardHeaderContent: {
    display: 'flex',
    '& svg': {
      maxWidth: 50,
      maxHeight: 50,
      width: 50,
      height: 50,
      margin: 'auto 8px auto 0',
    },
    '& span > div': {
      fontSize: theme.typography.caption.fontSize,
      position: 'relative',
      top: 0,
    },
  },
  landPercentage: {
    position: 'relative',
    top: -8,
  }
}))

const nonStateOrCountyCards = [
  DFC.NATIONWIDE_FEDERAL,
  DFC.NATIVE_AMERICAN
]

// Detail Card title
const DetailCardTitle = props => {
  console.log('DetailCardTitle props: ', props)
  const classes = useStyles()

  const landStatsData = props.data

  // Get land percentage
  const getLandPercent = stateOrArea => {
    const loc = stateOrArea === 'NF' ? 'National' : stateOrArea
    const landStat = landStatsData.find(item => item.location === loc)
    if (landStat) return <Box>{ `${ utils.round(landStat.federal_percent, 1) }% federal land` }</Box>
  }

  let svgImg

  const getImageComponent = fips => {
    const StateImgComponent = components[fips]
    return <StateImgComponent alt={`${ fips } State Icon`} className={classes.cardLocationIcon} />
  }

  if (nonStateOrCountyCards.includes(props.card.state)) {
    svgImg = <IconUsMapImg className={classes.usLocationIcon} alt="US Icon" />
  }
  else {
    svgImg = (props.card.regionType === 'State') ? getImageComponent(props.card.fipsCode) : ''
  }

  return (
    <div className={classes.detailCardHeaderContent}>
      {svgImg}
      <span>
        <CardTitle card={props.card} />
        <span className={classes.landPercentage}>{getLandPercent(props.card.fipsCode)}</span>
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
  const classes = useStyles()

  const { state: pageState, dispatch } = useContext(StoreContext)
  const { state: filterState } = useContext(DataFilterContext)
  const cards = pageState.cards

  const MAX_CARDS = (props.MaxCards) ? props.MaxCards : 3 // 3 cards means 4 cards

  // const { loading, error, data } = useQuery(APOLLO_QUERY)

  const closeCard = fips => {
    // console.log('fips: ', fips)
    dispatch({ type: 'CARDS', payload: cards.filter(item => item.fipsCode !== fips) })
  }

  // card Menu Item for adding/removing Nationwide Federal or Native American cards
  const cardMenuItems = [
    { fips_code: 'NF', state: 'Nationwide Federal', state_name: 'Nationwide Federal', location_name: 'Nationwide Federal', region_type: '', county: '', label: 'Add Nationwide Federal card' },
    { fips_code: 'NA', state: 'Native American', state_name: 'Native American', location_name: 'Native American', region_type: '', county: '', label: 'Add Native American card' }
  ]

  // onLink
  const onLink = state => {
    // console.log('onLink state: ', state)

    // decern betweeen topo json and location data fips
    const fips = state.properties ? state.id : state.fips_code
    const locations = [...data.onrr.locations, cardMenuItems[0], cardMenuItems[1]]

    // filter out location from location data
    const location = locations.filter(item => item.fips_code === fips)

    const stateObj = {
      fipsCode: location[0].fips_code,
      name: location[0].state_name,
      locationName: location[0].location_name,
      state: location[0].state,
      regionType: location[0].region_type,
      districtType: location[0].district_type,
      county: location[0].county
    }

    if (
      cards.filter(item => item.fipsCode === fips).length === 0
    ) {
      if (cards.length <= MAX_CARDS) {
        if (stateObj.state && stateObj.state.match(/Nationwide Federal/)) {
          cards.unshift(stateObj)
        }
        else {
          cards.push(stateObj)
        }
      }
      else {
        // TODO: snackbar not triggering atm
        handleMapSnackbar({ vertical: 'bottom', horizontal: 'center' })
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
              county: card.county,
              fipsCode: card.fipsCode,
              locationName: card.locationName,
              name: card.name,
              regionType: card.regionType,
              state: card.state
            })
          )
          return (
            <Card className={classes.root} key={i}>
              <CardHeader
                title={<DetailCardTitle card={card} cardType="detail" data={landStatsData} />}
                action={<CloseIcon
                  className={classes.closeIcon}
                  onClick={(e, i) => {
                    closeCard(card.fipsCode)
                  }}
                />}
                classes={{ root: classes.cardHeader, content: classes.cardHeaderContent }}
                disableTypography
              />
              <CardContent className={`${ classes.cardContentContainer } cardContent__${ filterState.dataType }`}>
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
