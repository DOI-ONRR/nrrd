import React from 'react'
import PropTypes from 'prop-types'

import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

import {
  Box
} from '@material-ui/core'

const LocationName = ({ location }) => {
  console.log('LocationName: ', location)
  const fips = location.fipsCode
  return (
    <>
      { (fips === DFC.NATIONWIDE_FEDERAL_FIPS || fips === DFC.NATIVE_AMERICAN_FIPS) &&
        <Box component="span">{location.locationName}</Box>
      }
      {/* State */}
      { (fips && fips.length === 2) &&
        <Box component="span">{location.name}</Box>
      }
      {/* County */}
      { (fips && fips.length === 5) &&
        <>
          {(location.county) &&
            <Box component="span">{location.county} {DFC.COUNTY_CAPITALIZED}</Box>
          }
          {(location.county === '') &&
            <Box component="span">{location.locationName}</Box>
          }
        </>
      }
      {/* Offshore */}
      { (fips && fips.length === 3) &&
        <Box component="span">{location.locationName}</Box>
      }
    </>
  )
}

export default LocationName

/**
 * @param {object} location
 */

LocationName.propTypes = {
  location: PropTypes.object.isRequired
}
