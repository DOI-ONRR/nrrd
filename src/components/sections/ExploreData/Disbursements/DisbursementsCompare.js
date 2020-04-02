import React, { useContext } from 'react'

import { StoreContext } from '../../../../store'
import utils from '../../../../js/utils'

import LocationTotal from '../LocationTotal'
import PageScrollTo from '../../../navigation/PageScrollTo'
import CompareCards from '../CompareCards'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Container,
  Grid,
  Typography
} from '@material-ui/core'

export default ({ closeCard, onLink, cardMenuItems }) => {
  const { state, dispatch } = useContext(StoreContext)
  const year = state.year
  const cards = state.cards

  const dataType = state.dataType

  return (
    <Container>
      <Grid container>
        <Grid item md={12}>
          <Box mb={1} color="secondary.main" borderBottom={5}>
            <Box component="h2" color="secondary.dark">Disbursements</Box>
          </Box>
          <Typography variant="body1">
            When companies extract natural resources on federal lands and waters, they pay royalties, rents, bonuses, and other fees, much like they would to any landowner. <strong>In fiscal year {year}, ONRR collected a total of <LocationTotal stateOrArea="Nationwide Federal" format={d => utils.formatToDollarInt(d)} /> in disbursements.</strong>
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={12}>
          <Box mt={4} mb={2}>
            {/* <PageScrollTo
              dataType={dataType} /> */}
          </Box>
        </Grid>
      </Grid>

      {/* <CompareCards
        cards={cards}
        closeCard={closeCard}
        onLink={onLink}
        cardMenuItems={cardMenuItems} /> */}
    </Container>
  )
}
