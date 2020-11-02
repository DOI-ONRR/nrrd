import React from 'react'

import { makeStyles, ThemeProvider, useTheme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import ListSubheader from '@material-ui/core/ListSubheader'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info'

import theme from '../../../js/mui/theme'

import * as Images from '../../images'

const useStyles = makeStyles(theme => ({
  gridList: {
    width: '100%',
    height: 450,
    border: '1px solid #e0e0e0',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  titleBar: {
    height: '50px',
    backgroundColor: 'rgba(96, 136, 168, 0.7)',
  },
}))

const IconographyDisplay = () => {
  const patternLibraryTheme = useTheme()
  const classes = useStyles(patternLibraryTheme)

  return (
    <Box m={2} p={1}>
      <Grid container>
        <Grid item xs={12}>
          <GridList cellHeight={180} className={classes.gridList} cols={5}>
            {Object.keys(Images).map(key => {
              const ImageComponent = Images[key]
              return (
                <GridListTile key={key}>
                  <ThemeProvider theme={theme}>
                    <ImageComponent />
                  </ThemeProvider>
                  <GridListTileBar
                    subtitle={key}
                    className={classes.titleBar}
                  />
                </GridListTile>
              )
            })}
          </GridList>
        </Grid>
      </Grid>
    </Box>
  )
}

export default IconographyDisplay
