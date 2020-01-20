import React from 'react'
import { Link } from 'gatsby'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import IconMap from '-!svg-react-loader!../../../img/svg/icon-us-map.svg'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1),
  },
  menuLink: {
    '&:hover': {
      textDecoration: 'none'
    }
  }
}))

const RevenueByLocationLink = () => {
  const classes = useStyles()
  return (
    <Grid container className={classes.root} spacing={1} direction="row" justify="flex-end" alignItems="flex-end">
      <Grid item>
        <IconMap />
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
