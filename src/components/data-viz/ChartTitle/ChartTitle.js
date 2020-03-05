import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles(theme => ({
  charTitle: {
    borderBottom: `1px solid ${ theme.palette.grays[600] }`,
    color: theme.palette.grays[600],
    fontSize: theme.typography.body2.fontSize,
    marginBottom: theme.spacing(2),
  }
}))

const ChartTitle = props => {
  const classes = useStyles()

  return (
    <Box className={classes.charTitle}>
      {props.children}
    </Box>
  )
}

export default ChartTitle
