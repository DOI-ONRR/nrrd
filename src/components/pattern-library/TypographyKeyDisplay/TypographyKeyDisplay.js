import React from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { ThemeProvider } from '@material-ui/core/styles'

import theme from '../../../js/mui/theme'

const TypographyKeyDisplay = ({ keys = [], children }) => {
  return (
    <Box m={2} p={1} border={1} borderColor='#e0e0e0'>
      <Grid container>
        <Grid item xs={12}>
          {keys.map(key => {
            if (theme.typography[key] && typeof theme.typography[key] === 'object') {
              return (
                <Grid key={key} container direction="row" justify="flex-start" alignItems="stretch">
                  <Grid item xs={12}>
                    <Box pl={2}>
                      <Grid item xs={3}>
                        <ThemeProvider theme={theme}>
                          <Typography variant={key}>
                            {key}
                          </Typography>
                        </ThemeProvider>
                      </Grid>
                      <Grid item xs={6}>
                        {
                          Object.keys(theme.typography[key]).map(subKey => {
                            return (
                              <Grid key={`${ key }_${ subKey }`} item xs={12}>
                                <Typography color={'primary'} component={'span'}>{`${ subKey }: `}</Typography>
                                <Typography component={'span'}>{`${ theme.typography[key][subKey] }`}</Typography>
                              </Grid>
                            )
                          })
                        }
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              )
            }
          })}
        </Grid>
        <Grid item xs={12}>
          <Box m={2} p={1} border={1} borderColor='#e0e0e0' bgcolor='#e0e0e0'>
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TypographyKeyDisplay
