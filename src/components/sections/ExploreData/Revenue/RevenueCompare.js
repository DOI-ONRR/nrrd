import React from 'react'

import utils from '../../../../js/utils'

import LocationTotal from '../LocationTotal'
import PageScrollTo from '../../../navigation/PageScrollTo'
import CompareCards from '../CompareCards'

import {
  Box,
  Container,
  Grid,
  Typography
} from '@material-ui/core'

export default props => {

  const {
    cards,
    cardMenuItems,
    closeCard,
    dataType,
    onLink,
    year
  } = props

  return (
    <Container>
      <Grid container>
        <Grid item md={12}>
          <Box mb={1} color="secondary.main" borderBottom={5}>
            <Box component="h2" color="secondary.dark">Revenue</Box>
          </Box>
          <Typography variant="body1">
            When companies extract natural resources on federal lands and waters, they pay royalties, rents, bonuses, and other fees, much like they would to any landowner. <strong>In fiscal year {year}, ONRR collected a total of <LocationTotal stateOrArea="Nationwide Federal" format={d => utils.formatToDollarInt(d)} /> in revenue.</strong>
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={12}>
          <Box mt={4} mb={2}>
            <PageScrollTo
              dataType={dataType} />
          </Box>
        </Grid>
      </Grid>

      <CompareCards
        cards={cards}
        cardMenuItems={cardMenuItems}
        closeCard={closeCard}
        onLink={onLink} />
    </Container>
  )
}
