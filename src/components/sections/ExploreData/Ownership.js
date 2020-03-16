import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box
} from '@material-ui/core'

// utility functions
import utils from '../../../js/utils'

const APOLLO_QUERY = gql`
  query LandStats($state: String!) {
    land_stats(where: { location: { _eq: $state } }) {
      federal_acres
      federal_percent
      location
      total_acres
    }
  }
`

const LandPercent = props => {
  const location = (props.stateAbbr === 'Nationwide Federal') ? 'National' : props.stateAbbr

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: location }
  })

  if (loading) return ''
  if (error) return `Error loading revenue data table ${ error.message }`

  if (data) {
    const landStats = data.land_stats[0]
    return (
      <Box>{utils.round(landStats.federal_percent, 1)}% federal</Box>
    )
  }
}

export default LandPercent

LandPercent.propTypes = {
  stateAbbr: PropTypes.string.isRequired
}
