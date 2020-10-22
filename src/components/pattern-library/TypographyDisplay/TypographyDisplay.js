import React from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import theme from '../../../js/mui/theme'

const TypographyDisplay = () => {
  console.log(theme)
  return (
    <>
      <Typography variant={'h1'}>Typography</Typography>
      {
        Object.keys(theme.typography).map(key => {
          if (theme.typography[key] && typeof theme.typography[key] === 'object') {
            console.log(theme.typography[key])
            return (
              <Box key={key} m={2} p={1} border={1} borderColor='#e0e0e0'>
                <Grid container direction="row" justify="flex-start" alignItems="stretch">
                  <Grid item key={key} xs={12} sm={3} md={2}>
                    <Box pl={2}>
                      <Typography variant={key}>
                        {key}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )
          }
        })
      }
    </>
  )
}

export default TypographyDisplay
