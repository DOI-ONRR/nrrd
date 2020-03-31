import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Grid
} from '@material-ui/core'

import AddLocationCard from './AddLocationCard'
import DetailCard from './DetailCard'
import LocationTotal from './LocationTotal'
import utils from '../../../js/utils'

const MAX_CARDS = 3

const useStyles = makeStyles(theme => ({
  root: {
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

const CompareRevenue = props => {
  const { cards, ...rest } = props
  const classes = useStyles()
  return (
    <>
      <Grid container>
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
      <Box className={classes.root}>
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
                  rest.closeCard(fips)
                }}
                total={<LocationTotal stateOrArea={card.abbr} format={d => utils.formatToDollarInt(d)} />}
              />
            )
          })
        }
        { (cards.length >= 0 && cards.length <= MAX_CARDS) ? <AddLocationCard title='Add another card' onLink={rest.onLink} menuItems={rest.cardMenuItems} /> : '' }
      </Box>
    </>
  )
}

export default CompareRevenue

CompareRevenue.propTypes = {
  // Cards array
  cards: PropTypes.array.isRequired
}
