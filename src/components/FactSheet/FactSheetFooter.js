import React from 'react'
import { Box, Link, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { OnrrLogoImg } from '../images'

const useStyles = makeStyles({
  root: {
    marginBottom: '2rem',
    fontSize: '1rem'
  }
})

const FactSheetFooter = () => {
  const classes = useStyles()
  return (
    <Grid container spacing={2}>
      <Grid item xs={'auto'}>
        <OnrrLogoImg width='50px'/>
      </Grid>
      <Grid item xs>
        <Box className={classes.root}>
          This Open Data, Design, and Development (ODDD) team is part of the Department of Interior's (DOI) Office of Natural Resources Revenue (ONRR).
          Visit <Link href='https://www.revenuedata.doi.gov'>revenuedata.doi.gov</Link> to access interactive charts and query data.
        </Box>
      </Grid>
    </Grid>
  )
}

export default FactSheetFooter
