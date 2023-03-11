import React from 'react'
import {
  ButtonGroup, Grid
} from '@material-ui/core'

export default ({ children, ...rest }) => {
  return (
    <Grid container justifyContent='center'>
      <ButtonGroup {...rest} >
        { children }
      </ButtonGroup>
    </Grid>
  )
}
