import React from 'react'
import utils from '../../../js/utils'

import {
  Box,
  Container,
  Grid
} from '@material-ui/core'

const Company = ({ title, ...props }) => {
  return (
    <Container>
      <Grid container>
        <Grid item md={12}>
          <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
            <Box component="h3" color="secondary.dark" id={utils.formatToSlug(title)}>{title}</Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Company
