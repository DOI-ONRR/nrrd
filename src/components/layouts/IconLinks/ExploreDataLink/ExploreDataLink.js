import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

import ExploreDataIcon from '-!svg-react-loader!../../../../img/icons/explore-data.svg'
import FilterTableIcon from '-!svg-react-loader!../../../../img/icons/filter-table.svg'
import HowWorksIcon from '-!svg-react-loader!../../../../img/icons/how-works.svg'
import DownloadDataIcon from '-!svg-react-loader!../../../../img/svg/icon-download-buttonup.svg'

const useStyles = makeStyles(theme => ({
  root: {
  },
  exploreDataLink: {
    textDecoration: 'none',
    marginBottom: '1rem',
    display: 'flex',
    '& svg': {
      fill: theme.palette.links.default,
      verticalAlign: 'middle',
      marginRight: '8px',
      flex: 'none',
    },
    verticalAlign: 'middle',
    marginRight: '8px',
    '& span': {
      fontSize: theme.typography.body1.fontSize,
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
      textDecoration: 'underline',
      color: theme.palette.text.secondary,
    },
    '&:active': {
      textDecoration: 'underline',
      color: theme.palette.text.secondary,
    }
  }
}))

const ExploreDataLink = props => {
  const classes = useStyles()
  const getIcon = icon => {
    switch (icon) {
    case 'data':
      return (<ExploreDataIcon />)
    case 'filter':
      return (<FilterTableIcon />)
    case 'works':
      return (<HowWorksIcon />)
    case 'download':
      return (<DownloadDataIcon />)
    default:
      return (<ExploreDataIcon />)
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
