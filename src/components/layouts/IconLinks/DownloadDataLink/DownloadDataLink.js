import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
// import Link from '../../../utils/temp-link'

import { makeStyles } from '@material-ui/core/styles'
// import styles from './DownloadDataLink.module.scss'

import DownloadDataIcon from '-!svg-react-loader!../../../../img/svg/icon-download-buttonup.svg'

const useStyles = makeStyles(theme => ({
  root: {
    '& svg': {
      fill: '#1478a6',
      verticalAlign: 'middle',
      marginRight: '8px',
    },
    '& span': {
      verticalAlign: 'baseline',
    }
  }
}))

const DownloadDataLink = props => {
  const classes = useStyles()

  return (
    <Link to={props.to} className={classes.root}>
      <DownloadDataIcon />
      <span>
        {props.children === undefined
          ? 'Download data'
          : props.children}
      </span>
    </Link>
  )
}

DownloadDataLink.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default DownloadDataLink
