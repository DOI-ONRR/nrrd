import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    overflow: 'auto',
    alignItems: 'stretch',
    backgroundColor: theme.palette.common.white,
    minHeight: 50,
  },
  rootSecondary: {
    backgroundColor: theme.palette.primary.main,
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    overflow: 'auto',
  },
}))

const BaseToolbar = ({ isSecondary, children }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Toolbar classes={{
      root: (isSecondary) ? classes.rootSecondary : classes.root,
    }}>
      {children}
    </Toolbar>
  )
}

export default BaseToolbar
