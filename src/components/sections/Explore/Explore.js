import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
  root: {},
  exploreContent: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    order: 1,
  },
  h3Bar: {
    borderBottom: '2px solid #cde3c3',
    marginBottom: '1em',
    paddingBottom: '.41667rem',
  }
}))

/**
 * DisbursmentTrends - react functional component that generates revenue trends graph
 *
 * uses hook useStaticQuery and graphl to get revenu data then
 * summarizes data for graphical representation
 */

const Explore = props => {
  const classes = useStyles()
  return (
    <Box component="section" className={classes.root}>
      <Box className={classes.contentHeader}>
        <Typography variant="h3" className={classes.h3Bar}>
          Explore {props.title}
        </Typography>
        <Typography variant="body1">
          {props.info}
        </Typography>
      </Box>
      <Grid container spacing={0}>
        <Grid item md={4} className={classes.exploreContent}>
          {props.contentLeft}
        </Grid>
        <Grid item md={4} className={classes.exploreContent}>
          {props.contentCenter}
        </Grid>
        <Grid item md={4} className={classes.exploreContent}>
          {props.contentRight}
        </Grid>
        <Grid item md={12}>
          {props.children}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Explore
