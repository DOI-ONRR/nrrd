import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import {
  Grid
} from '@material-ui/core'

import CONSTANTS from '../../../js/constants'

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

  return (
    <>
      { card.regionType === 'State' &&
        <Grid container>
          <Grid item xs={12} className={classes.cardTitle}>{card.name}</Grid>
          <Grid item xs={12} className={classes.cardSubtitle}>{CONSTANTS.USA}</Grid>
        </Grid>
      }
      { card.regionType === 'County' &&
        <Grid container>
          <Grid item xs={12} className={classes.cardTitle}>{card.county} {card.districtType}</Grid>
          <Grid item xs={12} className={classes.cardSubtitle}>{card.name}</Grid>
        </Grid>
      }
      { card.regionType === 'Offshore' &&
        <Grid container>
          <Grid item xs={12} className={classes.cardTitle}>{card.locationName}</Grid>
          <Grid item xs={12} className={classes.cardSubtitle}>{card.regionType}</Grid>
        </Grid>
      }
      { card.regionType === '' &&
        <Grid container>
          <Grid item xs={12} className={classes.cardTitle}>{card.locationName}</Grid>
        </Grid>
      }
    </>
  )
}

export default CardTitle
