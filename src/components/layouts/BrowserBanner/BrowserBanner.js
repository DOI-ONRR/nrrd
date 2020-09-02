import React from 'react'
import { IEView } from 'react-device-detect'

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
    margin: 0,
    position: 'relative',
    zIndex: 250,
    border: 0,
  }
}))

const BrowserBanner = ({ styles }) => {
  const classes = useStyles()
  return (
    <IEView>
      <span className={classes.root}>
        <WarningIcon style={{ marginRight: 5 }} /> Warning! This browser is not supported — Some features might not work. Try using a different browser,
        such as Chrome, Edge, Firefox, or Safari.
      </span>
    </IEView>
  )
}

export default BrowserBanner
