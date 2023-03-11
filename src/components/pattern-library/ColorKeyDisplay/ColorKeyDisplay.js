import React from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import theme from '../../../js/mui/theme'

const ColorKeyDisplay = ({ keys, children }) => {
  console.log(theme, keys)
  return (
    <Box m={2} p={1} border={1} borderColor='#e0e0e0'>
      <Grid container>
        <Grid item xs={12}>
          {keys.map(key => {
            return (
              <Grid key={key} container direction="row" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                {Object.keys(theme.palette[key]).map(subKey => {
                  if (typeof theme.palette[key][subKey] === 'string') {
                    return (
                      <Grid item key={`${ key }.${ subKey }`} xs={12} sm={3} md={2}>
                        <Box
                          pl={2}
                          bgcolor={theme.palette[key][subKey]}
                          border={1}
                          borderColor='#e0e0e0'
                          color={theme.palette.getContrastText(theme.palette[key][subKey])}
                        >
                          <Typography variant={'caption'}>
                            {`${ key }.${ subKey }`}<br></br>{`${ theme.palette[key][subKey] }`}
                          </Typography>
                        </Box>
                      </Grid>
                    )
                  }
                  else if (typeof theme.palette[key] === 'string' && theme.palette[key] !== 'light') {
                    return (
                      <Grid key={key} container direction="row" justifyContent="flex-start" alignItems="stretch">
                        <Grid item xs={12} sm={3} md={2}>
                          <Box
                            pl={2}
                            bgcolor={theme.palette[key]}
                            border={1}
                            borderColor='#e0e0e0'
                            color={theme.palette.getContrastText(theme.palette[key])}
                          >
                            <Typography variant={'caption'}>{`${ key }`}<br></br>{`${ theme.palette[key] }`}</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    )
                  }
                })}
              </Grid>
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

export default ColorKeyDisplay
