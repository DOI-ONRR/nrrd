import React from 'react'

import {
  Box,
  Container,
  Grid
} from '@material-ui/core'

const Company = props => {
  return (
    <Container>
      <Grid container>
        <Grid item md={12}>
          <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
            <Box component="h3" color="secondary.dark" id="national-revenue-summary">Revenue by company</Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Company
