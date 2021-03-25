import React from 'react'
import PropTypes from 'prop-types'

import { useStaticQuery, graphql } from 'gatsby'

import utils from '../../../js/utils'

const FederalLandPercentage = props => {
  const data = useStaticQuery(graphql`
    query FederalLandStatsQuery {
      onrr {
        land_stats {
          federal_acres
          federal_percent
          location
          total_acres
        }
      }
    }
  `)

  const {
    stateOrArea
  } = props

  const landStatsData = data.onrr.land_stats
  const loc = stateOrArea === 'NF' ? 'National' : stateOrArea
  const landStat = landStatsData.find(item => item.location === loc)

  return (
    <>
      { landStat ? `${ utils.round(landStat.federal_percent, 1) }%` : '' }
    </>
  )
}

export default FederalLandPercentage

FederalLandPercentage.propTypes = {
  stateOrArea: PropTypes.string,
}
