import React from 'react'
import {
  Card,
  Box,
  Typography,
  useTheme,
  makeStyles
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  step: {
    border: '2px solid',
    borderColor: theme.palette.info.main,
    borderRadius: '50%',
    display: 'inline-block',
    height: '38px',
    width: '38px',
    padding: '1px 0px 0px 9px',
    marginRight: '10px'

  },
  name: {
    display: 'inline-block',
  }
}))

export default ({ children, step, name }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Box mb={1}>
      <Card variant='outlined'>
        <Box p={3} pt={0}>
          {step &&
          <Typography variant='h2' className={classes.step}>{step}</Typography>
          }
          {name &&
          <Typography variant='h2' className={classes.name}>{name}</Typography>
          }
          <Box pl={5}>
            { children }
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
