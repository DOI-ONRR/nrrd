import React from 'react'
import PropTypes from 'prop-types'
import { withPrefix } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'

import DownloadExcelIcon from '-!svg-react-loader!../../../img/svg/icon-download-xls.svg'

const useStyles = makeStyles(() => ({
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

const DownloadExcelLink = ({ to, children, ...props }) => {
  return (
    <a href={withPrefix(to)} {...props} className={useStyles().root}>
      <DownloadExcelIcon />
      <span>
        {children === undefined
          ? 'Download'
          : children}
      </span>
    </a>
  )
}

DownloadExcelLink.propTypes = {
  /** The url for the link */
  to: PropTypes.string,
}

export default DownloadExcelLink
