import React from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { ThemeProvider } from '@material-ui/core/styles'

import PatternLibraryCard from '../PatternLibraryCard'
import CodeBlock from '../CodeBlock'
import theme from '../../../js/mui/theme'

const TypographyDisplay = () => {
  console.log(theme)

  const TypographyNotesDisplay = ({ themeKey }) => {
    return (
      <Box>
        {
          Object.keys(theme.typography[themeKey]).map(subKey => {
            return (
              <Box>
                <Typography color={'primary'} component={'span'}>{`${ subKey }: `}</Typography>
                <Typography component={'span'}>{`${ theme.typography[themeKey][subKey] }`}</Typography>
              </Box>
            )
          })
        }
      </Box>
    )
  }

  const TypographyContextDisplay = ({ themeKey }) => {
    return (
      <CodeBlock key={`code-block-${ themeKey }`} live={true}>
        {`<Typography variant={'${ themeKey }'}>Example text</Typography>`}
      </CodeBlock>
    )
  }

  return (
    <Grid container direction="row" justify="flex-start" alignItems="stretch" spacing={2}>
      {
        Object.keys(theme.typography).map(key => {
          if (theme.typography[key] && typeof theme.typography[key] === 'object') {
            return (
              <Grid item key={key} xs={12} sm={4} md={3}>
                <PatternLibraryCard
                  title={`${ key }`}
                  notes={<TypographyNotesDisplay themeKey={key} />}
                  contexts={<TypographyContextDisplay themeKey={key} />}>
                  <Box border={1} borderColor={'#ccc'}>
                    <ThemeProvider theme={theme}>
                      <Typography variant={key}>
                        {key}
                      </Typography>
                    </ThemeProvider>
                  </Box>
                </PatternLibraryCard>
              </Grid>
            )
          }
        })
      }
    </Grid>
  )
}

export default TypographyDisplay

/*
                        <Grid item key={`${ key }.${ subKey }`} xs={12} sm={4} md={3}>
                          <PatternLibraryCard
                            title={`${ key }.${ subKey }`}
                            notes={(notes.length > 0) ? notes : undefined}
                            contexts={contexts}>
                            <Box pl={2} pt={5} pb={5} bgcolor={theme.palette[key][subKey]} color={theme.palette.getContrastText(theme.palette[key][subKey])}>
                              <Typography variant={'caption'}>
                                {`HEX: ${ hexColor }`}<br></br>{`RGB: ${ rgbColor }`}
                              </Typography>
                            </Box>
                          </PatternLibraryCard>
                        </Grid>

                              <Grid key={`${ key }_${ subKey }`} item xs={12}>
                                <Typography color={'primary'} component={'span'}>{`${ subKey }: `}</Typography>
                                <Typography component={'span'}>{`${ theme.typography[key][subKey] }`}</Typography>
                              </Grid>
                        */
