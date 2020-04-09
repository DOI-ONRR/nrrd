import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import CONSTANTS from '../../../js/constants'
import utils from '../../../js/utils'

// import PageScrollTo from '../../navigation/PageScrollTo'
import AddLocationCard from './AddLocationCard'
import DetailCard from './DetailCard'
import LocationTotal from './LocationTotal'

import { StoreContext } from '../../../store'

import {
  Box,
  Container,
  Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const APOLLO_QUERY = gql`
  query ExploreDataCompareQuery($period: String!) {
    # land stats
    land_stats {
      federal_acres
      federal_percent
      location
      total_acres
    }

    # period query
    period(where: {period: {_ilike: $period }}) {
      fiscal_year
    }
  }
`

const useStyles = makeStyles(theme => ({
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
}))

const ExploreDataCompare = ({ children, exploreDataProps, ...props }) => {
  const classes = useStyles()
  const { state } = useContext(StoreContext)
  const cards = state.cards
  const year = state.year

  const {
    cardMenuItems,
    closeCard,
    onLink
  } = exploreDataProps

  let periodData
  let landStatsData

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { period: CONSTANTS.FISCAL_YEAR }
  })

  if (loading) {}

  if (error) return `Error! ${ error.message }`

  if (data) {
    periodData = data.period
    landStatsData = data.land_stats
  }

  return (
    <Container id={utils.formatToSlug(props.title)}>
      <Grid container>
        <Grid item md={12}>
          <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
            <Box component="h3" color="secondary.dark">{props.title}</Box>
          </Box>
          <Box fontSize="body1.fontSize">
                Add more than one card to compare.  Select states, counties, and offshore regions.
          </Box>
          {/* <Box fontSize="body1.fontSize">
            { cards.length > 0 &&
              <Box>You currently have {cards.length > 0 ? 'the following cards selected.' : 'no cards selected.'}</Box>
            }
          </Box> */}
        </Grid>
      </Grid>

      { data &&
      <Box className={classes.compareCards}>
        {
          cards.map((card, i) => {
            return (
              <DetailCard
                key={i}
                cardTitle={card.name}
                periodData={periodData}
                landStatsData={landStatsData}
                fips={card.fips}
                abbr={card.abbr}
                state={card.state}
                name={card.name}
                closeCard={fips => {
                  closeCard(fips)
                }}
                total={<LocationTotal location={card.abbr} />}
              />
            )
          })
        }
        { (cards.length >= 0 && cards.length <= CONSTANTS.MAX_CARDS) ? <AddLocationCard title='Add another card' onLink={onLink} cardMenuItems={cardMenuItems} /> : '' }
      </Box>
      }
    </Container>
  )
}

export default ExploreDataCompare
