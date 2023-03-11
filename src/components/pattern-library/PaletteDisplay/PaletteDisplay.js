import React from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import PatternLibraryCard from '../PatternLibraryCard'

import CodeBlock from '../CodeBlock'
import theme from '../../../js/mui/theme'

const PaletteContextDisplay = ({ colorKey, key1, subKey }) => {
  const contrastColor = (subKey)
    ? theme.palette.getContrastText(theme.palette[key1][subKey])
    : theme.palette.getContrastText(theme.palette[key1])

  return (
    <CodeBlock key={`code-block-${ colorKey }`} live={true} title={colorKey}>
      {`<Box color={'${ colorKey }'} bgcolor={'${ contrastColor }'} p={2}>
        Text color with contrasting color background.
      </Box>`}
    </CodeBlock>
  )
}

const PaletteDisplay = ({ children }) => {
  const content = (Array.isArray(children)) ? children : [children]

  const getNotes = (key, subKey) => content.filter(child => (child?.props.noteKeys?.includes(key) || child?.props.noteKeys?.includes(`${ key }.${ subKey }`)))

  const hexToRgb = hex => {
    let hexColor = hex
    if (hexColor.length === 4) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      hexColor = hexColor.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
    }
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor)
    return result
      ? `rgb(${ parseInt(result[1], 16) }, ${ parseInt(result[2], 16) }, ${ parseInt(result[3], 16) })`
      : 'No Conversion Available'
  }

  const rgbToHex = rgbString => {
    const matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/
    const colors = matchColors.exec(rgbString)

    return (colors)
      ? '#' + ((1 << 24) + (parseInt(colors[1]) << 16) + (parseInt(colors[2]) << 8) + parseInt(colors[3])).toString(16).slice(1)
      : 'No Conversion Available'
  }

  return (
    <>
      {
        Object.keys(theme.palette).map(key => {
          if (theme.palette[key] && typeof theme.palette[key] === 'object') {
            return (
              <Box key={key} pl={2}>
                <Typography variant={'h4'}>{`${ key }`}</Typography>
                <Grid container direction="row" justifyContent="flex-start" alignItems="stretch" spacing={2}>
                  {Object.keys(theme.palette[key]).map(subKey => {
                    if (typeof theme.palette[key][subKey] === 'string') {
                      const hexColor = (theme.palette[key][subKey].charAt(0) === '#')
                        ? theme.palette[key][subKey]
                        : rgbToHex(theme.palette[key][subKey])
                      const rgbColor = (theme.palette[key][subKey].charAt(0) === '#')
                        ? hexToRgb(theme.palette[key][subKey])
                        : theme.palette[key][subKey]
                      const notes = getNotes(key, subKey)
                      const contexts = <PaletteContextDisplay colorKey={`${ key }.${ subKey }`} key1={key} subKey={subKey}/>
                      return (
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
                      )
                    }
                  })}
                </Grid>
              </Box>
            )
          }
          else if (typeof theme.palette[key] === 'string' && theme.palette[key] !== 'light') {
            const notes = getNotes(key)
            const contexts = <PaletteContextDisplay colorKey={`${ key }`} key1={key}/>
            return (
              <Box key={key} pl={2}>
                <Typography variant={'h4'}>{`${ key }`}</Typography>
                <Grid container direction="row" justifyContent="flex-start" alignItems="stretch">
                  <Grid item xs={12} sm={4} md={3}>
                    <PatternLibraryCard
                      title={`${ key }`}
                      notes={(notes.length > 0) ? notes : undefined}
                      contexts={contexts}>
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
