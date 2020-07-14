import React from 'react'
import { IEView } from 'react-device-detect'

import {
  Box
} from '@material-ui/core'
import {
  makeStyles
} from '@material-ui/styles'

import WarningIcon from '@material-ui/icons/Warning'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fa842e !important',
    padding: 0,
    marginBottom: 10,
  }
}))

const BrowserBanner = ({ styles }) => {
  const classes = useStyles()
  return (
    <IEView>
      <span className={classes.root}>
        <WarningIcon style={{ marginRight: 5 }} /> Warning! This browser is not supported — Some features might not work. Try using a different browser, such as Chrome, Edge, Firefox, or Safari.
      </span>
    </IEView>
  )
}

export default BrowserBanner
