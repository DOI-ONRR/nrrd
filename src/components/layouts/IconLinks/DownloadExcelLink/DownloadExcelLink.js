import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
// import Link from '../../../utils/temp-link'

import { makeStyles } from '@material-ui/core/styles'
// import styles from './DownloadExcelLink.module.scss'

import DownloadExcelIcon from '-!svg-react-loader!../../../../img/svg/icon-download-xls.svg'

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

const DownloadExcelLink = props => {
  const classes = useStyles()

  return (
    <Link to={props.to} className={classes.root}>
      <DownloadExcelIcon />
      <span>
        {props.children === undefined
          ? 'Download'
          : props.children}
      </span>
    </Link>
  )
}

DownloadExcelLink.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default DownloadExcelLink
