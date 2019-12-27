import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
// import Link from '../../../utils/temp-link'

import { makeStyles } from '@material-ui/core/styles'
// import styles from './ExploreDataLink.module.scss'

import ExploreDataIcon from '-!svg-react-loader!../../../../img/icons/explore-data.svg'
import FilterTableIcon from '-!svg-react-loader!../../../../img/icons/filter-table.svg'
import HowWorksIcon from '-!svg-react-loader!../../../../img/icons/how-works.svg'
import DownloadDataIcon from '-!svg-react-loader!../../../../img/svg/icon-download-buttonup.svg'

const useStyles = makeStyles(theme => ({
  root: {
  },
  exploreDataLink: {
    textDecoration: `none`,
    marginBottom: '1rem',
    '& svg': {
      fill: '#1478a6',
    },
    verticalAlign: 'middle',
    marginRight: '8px',
    '& span': {
      'fontSize': '1rem',
      'marginRight': '1rem',
      'verticalAlign': 'baseline'
    },
    '&:hover': {
      textDecoration: 'underline'
    },
    '&:active': {
      textDecoration: 'underline'
    } 
  }
}))


const ExploreDataLink = props => {
  const classes = useStyles()
  const getIcon = icon => {
    switch(icon) {
    case 'data':
      return( <ExploreDataIcon />)
      break
    case 'filter':
      return( <FilterTableIcon />)
      break
    case 'works':
      return( <HowWorksIcon />)
      break
    case 'download':
      return( <DownloadDataIcon />)
      break
    default:
      return ( <ExploreDataIcon /> )
    }
  }
    
  return (
    <Link to={props.to} className={classes.exploreDataLink}>
      {getIcon(props.icon)}
      <span>
        {props.children === undefined
          ? 'Explore data'
          : props.children}
      </span>
	  </Link>
  )
}

ExploreDataLink.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default ExploreDataLink
