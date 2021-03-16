import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

import { OnrrLogoImg } from '../../images'
import { Typography } from '@material-ui/core'
import Link from '../../Link'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.toolbarBackground.main,
    marginTop: theme.spacing(3),
    '@media print': {
      backgroundColor: theme.palette.toolbarBackground.main,
      '-webkit-print-color-adjust': 'exact'
    }
  },
}))
/**
 * This banner is used for the Monthly Snapshot on the fact sheet page
 */
const SnapshotBanner = () => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Box className={classes.root} displayPrint="block">
      <Grid container>
        <Grid item xs={6}>
          <Box ml={1}>
            <Grid container alignItems="center">
              <Box component='span' mr={1} mt={'5px'}>
                <OnrrLogoImg style={{ height: '50px' }}/>
              </Box>
              <Box component='span'>
                <Box style={{ fontSize: '0.7rem', lineHeight: '0.7rem', color: 'white' }}>
                  U.S. Department of the Interior
                </Box>
                <Box style={{ fontSize: '1rem', lineHeight: '1rem', fontWeight: '600', color: 'white', width: '150px', marginTop: '5px' }}>
                  Natural Resources Revenue Data
                </Box>
              </Box>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={12}>
              <Box m={1} mr={2} style={{ fontSize: '1.1rem', lineHeight: '1.1rem', color: 'white', textAlign: 'end' }}>
                Monthly Snapshot
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box style={{ fontSize: '0.9rem', lineHeight: '0.9rem', color: 'white', textAlign: 'end' }} mb={1} mr={2}>
                View interactive charts at <Link href={'https://revenuedata.doi.gov/'} style={{ color: 'white' }}>revenuedata.doi.gov</Link>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SnapshotBanner

/*
ArchiveBanner.Preview = {
  group: 'Informational',
  demos: [
    {
      title: 'Example',
      code: '<ArchiveBanner />',
    }
  ]
}
*/
