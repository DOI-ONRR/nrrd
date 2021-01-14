import React from 'react'
import { navigate } from 'gatsby'
import {
  Button, Box
} from '@material-ui/core'

export default ({ children, to, ...rest }) => {
  return (
    <Box bgcolor={to ? 'white' : 'primary.main'}>
      <Button {...rest} disableElevation={true} variant='text' onClick={() => navigate(to)}>
        <Box pl={2} pr={2} style={{ textTransform: 'none' }}>{children}</Box>
      </Button>
    </Box>
  )
}
