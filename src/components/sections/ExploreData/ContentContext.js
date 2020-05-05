import React from 'react'

import {
  Box
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.common.white,
    display: 'block',
    width: '100%',
    position: 'relative',
    zIndex: 250,
  },
}))

const ContentContext = props => {
  const classes = useStyles()
  return (
    <Box className={classes.root}>
      {props.children}
    </Box>
  )
}

export default ContentContext
