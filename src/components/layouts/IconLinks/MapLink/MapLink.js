import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { makeStyles } from '@material-ui/core/styles'

import { IconUsMapImg } from '../../../images'

const useStyles = makeStyles(theme => ({
  root: {
    '& svg': {
      fill: theme.palette.links.primary,
      verticalAlign: 'middle',
      marginRight: '8px',
    },
    '& span': {
      verticalAlign: 'baseline',
    }
  }
}))

const MapLink = props => {
  const classes = useStyles()
  return (
    <Link to={props.to} className={classes.root}>
      <IconUsMapImg />
      <span>
        {props.children === undefined
          ? 'Data by state'
          : props.children}
      </span>
    </Link>
  )
}

MapLink.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default MapLink
