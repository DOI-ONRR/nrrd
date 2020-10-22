import React from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import theme from '../../../js/mui/theme'

const PaletteDisplay = () => {
  return (
    <>
      <Typography variant={'h1'}>Palette</Typography>
      {
        Object.keys(theme.palette).map(key => {
          if (theme.palette[key] && typeof theme.palette[key] === 'object') {
            return (
              <Box key={key} m={2} p={1} border={1} borderColor='#e0e0e0'>
                <Grid container direction="row" justify="flex-start" alignItems="stretch">
                  {Object.keys(theme.palette[key]).map(subKey => {
                    if (typeof theme.palette[key][subKey] === 'string') {
                      return (
                        <Grid item key={`${ key }.${ subKey }`} xs={12} sm={3} md={2}>
                          <Box pl={2} bgcolor={theme.palette[key][subKey]} color={theme.palette.getContrastText(theme.palette[key][subKey])}>
                            <Typography variant={'caption'}>
                              {`${ key }.${ subKey }`}<br></br>{`${ theme.palette[key][subKey] }`}
                            </Typography>
                          </Box>
                        </Grid>
                      )
                    }
                  })}
                </Grid>
              </Box>
            )
          }
          else if (typeof theme.palette[key] === 'string' && theme.palette[key] !== 'light') {
            return (
              <Box key={key} m={2} p={1} border={1} borderColor='#e0e0e0'>
                <Grid container direction="row" justify="flex-start" alignItems="stretch">
                  <Grid item xs={12} sm={3} md={2}>
                    <Box pl={2} bgcolor={theme.palette[key]} color={theme.palette.getContrastText(theme.palette[key])}>
                      <Typography variant={'caption'}>{`${ key }`}<br></br>{`${ theme.palette[key] }`}</Typography>
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

export default PaletteDisplay
