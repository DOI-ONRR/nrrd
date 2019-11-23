import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
// import Link from '../../../utils/temp-link'

import { makeStyles } from '@material-ui/core/styles'
// import styles from './DownloadCsvLink.module.scss'

import DownloadCsvIcon from '-!svg-react-loader!../../../../img/svg/icon-download-csv.svg'

const useStyles = makeStyles(theme => ({
  root: {
    '& svg': {
      fill: 'currentColor',
      verticalAlign: 'middle',
      marginRight: '8px',
    },
    '& span': {
      verticalAlign: 'baseline',
    }
  }
}))

const DownloadCsvLink = props => {
  const classes = useStyles()

  return (
    <Link to={props.to} className={classes.root}>
      <DownloadCsvIcon />
      <span>
        {props.children === undefined
          ? 'Download'
          : props.children}
      </span>
    </Link>
  )
}

DownloadCsvLink.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default DownloadCsvLink
