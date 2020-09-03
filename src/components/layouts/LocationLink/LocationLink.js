import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import { IconUsMapImg } from '../../images'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1),
    justifyContent: 'flex-end',
    '@media (max-width: 426px)': {
      justifyContent: 'flex-start',
      paddingTop: theme.spacing(0),
    },
  },
  menuLink: {
    color: theme.palette.links.default,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  iconMap: {
    fill: theme.palette.links.default,
    position: 'relative',
    top: -2,
  }
}))

const LocationLink = props => {
  const classes = useStyles()
  const { linkTitle, linkUrl } = props
  return (
    <Grid container className={classes.root} spacing={1} direction="row">
      <Grid item>
        <IconUsMapImg className={classes.iconMap} />
      </Grid>
      <Grid item>
        <Typography variant="body1">
          <Link
            className={classes.menuLink}
            to={linkUrl}
            activeClassName={classes.menuActiveLink}>
            {linkTitle}
          </Link>
        </Typography>
      </Grid>
    </Grid>
  )
}

LocationLink.propTypes = {
  linkTitle: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
}

export default LocationLink
