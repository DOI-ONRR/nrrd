import React from 'react'
import PropTypes from 'prop-types'

import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

import {
  Box
} from '@material-ui/core'

const LocationName = ({ location }) => {
  return (
    <>
      { (location.fipsCode === DFC.NATIONWIDE_FEDERAL_FIPS || location.fipsCode === DFC.NATIVE_AMERICAN_FIPS) &&
        <Box component="span">{location.locationName}</Box>
      }
      { location.regionType === DFC.STATE &&
        <Box component="span">{location.name}</Box>
      }
      { location.regionType === DFC.COUNTY_CAPITALIZED &&
        <Box component="span">{location.county} {DFC.COUNTY_CAPITALIZED}</Box>
      }
      { location.regionType === DFC.OFFSHORE_CAPITALIZED &&
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
