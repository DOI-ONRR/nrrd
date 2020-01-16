import React from 'react'
import PropTypes from 'prop-types'
import MuiLink from '@material-ui/core/Link'
// import Link from '../../../utils/temp-link'

import { makeStyles } from '@material-ui/core/styles'
// import styles from './DownloadLink.module.scss'

import DownloadIcon from '-!svg-react-loader!../../../../img/svg/icon-download.svg'

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

const DownloadLink = props => {
  const classes = useStyles()
  
  return (
    <MuiLink to={props.to} className={classes.root}>
      <DownloadIcon />
      <span>
        {props.children === undefined
          ? 'Download'
          : props.children}
      </span>
    </MuiLink>
  )
}

DownloadLink.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default DownloadLink
