import React from 'react'
import { Link } from 'gatsby'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import IconMap from '-!svg-react-loader!../../../img/icons/map-dark.svg'
import { Typography, ThemeProvider } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1),
  },
  menuLink: {
    '&:hover': {
      textDecoration: `none`
    }
  }
}))

const RevenueByLocationLink = () => {
  const classes = useStyles()
  return (
    <Grid container className={classes.root} spacing={1} direction="row" justify="flex-end" alignItems="right">
      <Grid item>
        <IconMap className={classes.icon} />
      </Grid>
      <Grid item>
        <Typography variant="body1">
          <Link 
            className={classes.menuLink} 
            to="/explore/"
            activeClassName={classes.menuActiveLink}>
              Revenue by location
          </Link>
        </Typography>
      </Grid>
    </Grid>
  )
}

export default RevenueByLocationLink