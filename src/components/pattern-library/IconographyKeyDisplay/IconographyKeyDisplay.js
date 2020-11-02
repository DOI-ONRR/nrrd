import React from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import * as Images from '../../images'

const IconographyKeyDisplay = ({ keys = [], children }) => {
  return (
    <Box m={2} p={1} border={1} borderColor='#e0e0e0'>
      <Grid container>
        <Grid item xs={12}>
          {keys.map(key => {
            const ImageComponent = Images[key]
            return (
              <ImageComponent />
            )
          })}
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </Box>
  )
}

export default IconographyKeyDisplay
