import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

import PrintIcon from '@material-ui/icons/Print'
import IconButton from '@material-ui/core/IconButton'
import { Button } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
  },
  printButton: {
    backgroundColor: theme.palette.toolbarBackground.main,
    fontSize: '1rem',
    lineHeight: '1rem',
    color: 'white',
    textAlign: 'end',
    '@media print': {
      display: 'none'
    }
  },
  dataPublished: {
    fontSize: '1rem',
    lineHeight: '1rem',
    textAlign: 'end',
    marginTop: '1rem',
    marginBottom: '1rem',
    fontStyle: 'italic'
  }
}))
/**
 * This banner is used for the Monthly Snapshot on the fact sheet page
 */
const FactSheetBanner = () => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Box className={classes.root} displayPrint="block">
      <Grid container>
        <Grid item xs={12}>
          <Box style={{ fontSize: '1rem' }}>
            U.S. Department of the Interior, Natural Resources Revenue Data
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box>
            <Grid container alignItems="center">
              <Box component='span'>
                <Box style={{ fontSize: '2.25rem', fontWeight: '600', marginTop: '0.5rem' }}>
                  Monthly Fact Sheet
                </Box>
              </Box>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={4} style={{ textAlign: 'right' }}>
          <Grid container>
            <Grid item xs={12}>
              <Button variant="contained" className={classes.printButton} m={1} onClick={() => window.print()}>
                <IconButton size="small" color='inherit' aria-label="print" component="span" style={{ marginRight: '5px' }}>
                  <PrintIcon />
                </IconButton>
                Print Fact Sheet
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box className={classes.dataPublished}>
                Data published February 2025
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FactSheetBanner
