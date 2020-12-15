import React from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import PatternLibraryCard from '../PatternLibraryCard'

import theme from '../../../js/mui/theme'

const PaletteDisplay = ({ children }) => {
  const notes = (Array.isArray(children)) ? children : [children]

  const getNotes = (key, subKey) => notes.filter(child => (child?.props.noteKeys?.includes(key) || child?.props.noteKeys?.includes(`${ key }.${ subKey }`)))

  return (
    <>
      {
        Object.keys(theme.palette).map(key => {
          if (theme.palette[key] && typeof theme.palette[key] === 'object') {
            return (
              <Box key={key} pl={2}>
                <Typography variant={'h4'}>{`${ key }`}</Typography>
                <Grid container direction="row" justify="flex-start" alignItems="stretch" spacing={2}>
                  {Object.keys(theme.palette[key]).map(subKey => {
                    if (typeof theme.palette[key][subKey] === 'string') {
                      const notes = getNotes(key, subKey)
                      return (
                        <Grid item key={`${ key }.${ subKey }`} xs={12} sm={4} md={3}>
                          <PatternLibraryCard title={`${ key }.${ subKey }`} notes={(notes.length > 0) ? notes : undefined}>
                            <Box pl={2} pt={5} pb={5} bgcolor={theme.palette[key][subKey]} color={theme.palette.getContrastText(theme.palette[key][subKey])}>
                              <Typography variant={'caption'}>
                                {`${ theme.palette[key][subKey] }`}
                              </Typography>
                            </Box>
                          </PatternLibraryCard>
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
              <Box key={key} pl={2}>
                <Typography variant={'h4'}>{`${ key }`}</Typography>
                <Grid container direction="row" justify="flex-start" alignItems="stretch">
                  <Grid item xs={12} sm={4} md={3}>
                    <PatternLibraryCard title={`${ key }`}>
                      <Box pl={2} pt={5} pb={5} bgcolor={theme.palette[key]} color={theme.palette.getContrastText(theme.palette[key])}>
                        <Typography variant={'caption'}>
                          {`${ theme.palette[key] }`}
                        </Typography>
                      </Box>
                    </PatternLibraryCard>
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

/*
    <Grid item key={`${ key }.${ subKey }`} xs={12} sm={3} md={2}>
    <Box pl={2} bgcolor={theme.palette[key][subKey]} border={1} borderColor='#e0e0e0' color={theme.palette.getContrastText(theme.palette[key][subKey])}>
      <Typography variant={'caption'}>
        {`${ key }.${ subKey }`}<br></br>{`${ theme.palette[key][subKey] }`}
      </Typography>
    </Box>
  </Grid>
*/
