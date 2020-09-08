import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

import {
  IconExploreDataImg,
  FilterTableIconImg,
  HowWorksLinkIconImg,
  IconDownloadDataImg
} from '../../../images'

const useStyles = makeStyles(theme => ({
  root: {
  },
  exploreDataIcon: {
    color: theme.palette.links.default,
  },
  exploreDataLink: {
    // textDecoration: 'none',
    marginBottom: '1rem',
    display: 'flex',
    color: theme.palette.links.default,
    '& svg': {
      fill: theme.palette.links.default,
      verticalAlign: 'middle',
      marginRight: '8px',
      flex: 'none',
    },
    verticalAlign: 'middle',
    marginRight: '8px',
    '& span': {
      marginRight: '1rem',
      verticalAlign: 'baseline',
      position: 'relative',
      top: -2,
      textTransform: 'lowercase',
    },
    '& span:first-letter': {
      textTransform: 'capitalize',
    },
    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.text.secondary,
    },
    '&:active': {
      textDecoration: 'none',
      color: theme.palette.text.secondary,
    }
  }
}))

const ExploreDataLink = props => {
  const classes = useStyles()

  const getIcon = icon => {
    switch (icon) {
    case 'data':
      return (<IconExploreDataImg className={classes.exploreDataIcon} />)
    case 'filter':
      return (<FilterTableIconImg className={classes.exploreDataIcon} />)
    case 'works':
      return (<HowWorksLinkIconImg className={classes.exploreDataIcon} />)
    case 'download':
      return (<IconDownloadDataImg className={classes.exploreDataIcon} />)
    default:
      return (<IconExploreDataImg className={classes.exploreDataIcon} />)
    }
  }

  return (
    <Link to={props.to} className={classes.exploreDataLink}>
      {getIcon(props.icon)}
      <Box component="span" fontSize="body2" color="text.secondary">
        {props.children === undefined
          ? 'Explore data'
          : props.children}
      </Box>
	  </Link>
  )
}

ExploreDataLink.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default ExploreDataLink
