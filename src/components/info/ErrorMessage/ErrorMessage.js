import React, { useContext } from 'react'

import { AppStatusContext } from '../../../stores/app-status-store'

import Modal from '@material-ui/core/Modal'
import Grid from '@material-ui/core/Grid'
import { makeStyles, useTheme } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
    color: 'white',
  },
}))

const ErrorMessage = () => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const { state } = useContext(AppStatusContext)

  const handleClose = () => {
    console.log('close')
  }
  return (
    <Modal open={state.ErrorMessage} onClose={handleClose} aria-labelledby="Error Message" aria-describedby="simple-modal-description">
      {state.ErrorMessage}
    </Modal>
  )
}

export default ErrorMessage
