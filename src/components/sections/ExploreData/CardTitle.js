import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import {
  Grid
} from '@material-ui/core'

import CONSTANTS from '../../../js/constants'
import mapStates from './states.json'

const useStyles = makeStyles(theme => ({
  cardTitle: {
    fontSize: '1.25rem',
    marginTop: theme.spacing(1),
  },
  cardSubtitle: {
    fontSize: '.85rem',
    position: 'relative',
    top: -6,
  }
}))

const CardTitle = props => {
  const classes = useStyles()
  const card = props.card
  const fips = props.card.fipsCode
  const states = mapStates.objects['states-geo'].geometries

  const state = states.filter(state => state.id === card.state)

  return (
    <>
      {/* States */}
      { (fips && fips.length === 2) &&
        <Grid container>
          <Grid item xs={12} className={classes.cardTitle}>{card.name}</Grid>
          <Grid item xs={12} className={classes.cardSubtitle}>{CONSTANTS.USA}</Grid>
        </Grid>
      }
      {/* Counties */}
      { (fips && fips.length === 5) &&
        <Grid container>
          {(card.county) &&
            <>
              <Grid item xs={12} className={classes.cardTitle}>{card.county} {card.districtType}</Grid>
              <Grid item xs={12} className={classes.cardSubtitle}>{card.name}</Grid>
            </>
          }
          {(card.county === '') &&
            <>
              <Grid item xs={12} className={classes.cardTitle}>{card.locationName}</Grid>
              <Grid item xs={12} className={classes.cardSubtitle}>{state[0].properties.name}</Grid>
            </>
          }
        </Grid>
      }
      {/* Offshore */}
      { (fips && fips.length === 3) &&
        <Grid container>
          <Grid item xs={12} className={classes.cardTitle}>{card.locationName}</Grid>
          <Grid item xs={12} className={classes.cardSubtitle}>{card.regionType}</Grid>
        </Grid>
      }
    </>
  )
}

export default CardTitle
