import React from 'react'
import {
  Button, Box
} from '@material-ui/core'

export default ({ children, to, ...rest }) => {
  return (
    <Box bgcolor={to ? 'white' : 'primary.main'}>
      <Button {...rest} disableElevation={true} variant='text' onClick={() => (to && (window.location.href = to))}>
        <Box pl={2} pr={2}>{children}</Box>
      </Button>
    </Box>
  )
}
