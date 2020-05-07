import React from 'react'

import {
  Box
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.common.white,
  },
}))

const CompareContext = props => {
  const classes = useStyles()
  return (
    <>
      {props.children}
    </>
  )
}

export default CompareContext
