import React, { useState, useContext, useEffect } from 'react'

import { AppStatusContext } from '../../../stores/app-status-store'

import Modal from '@material-ui/core/Modal'
import BaseButtonInput from '../../inputs/BaseButtonInput'
import { makeStyles, useTheme } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
    color: 'white',
  },
  errorModal: {
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    overflow: 'auto',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-200px',
    marginLeft: '-150px',
    width: '300px',
    height: '400px',
    backgroundColor: 'white',
    padding: '0px 20px',
    borderRadius: '5px'
  },
  closeButton: {
    position: 'absolute',
    left: '50%',
    marginLeft: '-36px',
    bottom: 10
  }
}))

const ErrorMessage = () => {

  const theme = useTheme()
  const classes = useStyles(theme)
  const { state, deleteErrorMessage } = useContext(AppStatusContext)
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    deleteErrorMessage()
    setOpen(false)
  }

  useEffect(() => {
    setOpen(state.isError || false)
  }, [state])

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="Error Message" aria-describedby="simple-modal-description">
      <div className={classes.errorModal}>
        <h2>Error</h2>
        <div style={{ overflow: 'auto' }}>{state.message}</div>
        <BaseButtonInput variant={'contained'} onClick={handleClose} className={classes.closeButton}>Close</BaseButtonInput>
      </div>
    </Modal>
  )
}

export default ErrorMessage
