import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { makeStyles } from '@material-ui/core/styles'
// import styles from './DataArchiveLink.module.scss'
import DataArchiveIcon from '-!svg-react-loader!../../../../img/svg/icon-archive.svg'

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

const DataArchiveLink = props => {
  const classes = useStyles()

  return (
    <Link to={props.to} className={classes.root}>
      <DataArchiveIcon />
      <span>
        {props.children === undefined
          ? 'Data archive'
          : props.children}
      </span>
    </Link>
  )
  
}

DataArchiveLink.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default DataArchiveLink
