import React, { useState } from 'react'

import {
  Snackbar
} from '@material-ui/core'

const MapSnackbar = ({ message, ...rest }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'center'
  })
  const { vertical, horizontal, open } = snackbarState

  const handleMapSnackbar = newState => {
    setSnackbarState({ open: true, ...newState })
  }

  const handleSnackbarClose = () => {
    setSnackbarState({ ...snackbarState, open: false })
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      key={`${ vertical },${ horizontal }`}
      open={open}
      onClose={handleSnackbarClose}
      message={message}
    />
  )
}

export default MapSnackbar
