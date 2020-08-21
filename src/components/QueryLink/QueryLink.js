import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { DataFilterContext } from '../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../constants'

import Link from '../../components/Link'

import {
  Box
} from '@material-ui/core'

const QueryLink = props => {
  console.log('QueryLink props: ', props)
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.FISCAL_YEAR_LABEL
  const state = props.fipsCode
  const dataType = filterState.dataType

  let locationName = props.locationName

  if (state && state.length === 3) {
    locationName = `${ props.regionType } ${ props.locationName }`
  }

  if (state && state.length === 5) {
    locationName = props.name
  }

  // get year range from selected year
  const getYearRange = (start, end) => {
    return new Array(end - start + 1).fill().map((_, idx) => start + idx)
  }

  const periodParam = (period === DFC.FISCAL_YEAR_LABEL) ? DFC.FISCAL_YEAR : DFC.CALENDAR_YEAR

  const yearRange = getYearRange((parseInt(year) - 5), parseInt(year))

  // Get query url
  const getQueryUrl = (baseSegment, fipsCode) => {
    let sharedParams
    let queryLink

    // check dataType
    switch (dataType) {
    case DFC.REVENUE:
      sharedParams = `/${ baseSegment }/?dataType=${ dataType }&period=${ period }&${ periodParam }=${ yearRange }`
      break
    case DFC.DISBURSEMENT:
      sharedParams = `/${ baseSegment }/?dataType=${ dataType }&period=${ period }&${ periodParam }=${ yearRange }`
      break
    case DFC.PRODUCTION:
      sharedParams = `/${ baseSegment }/?dataType=${ dataType }&period=${ period }&${ periodParam }=${ yearRange }&commodity=${ DFC.OIL }`
      break
    default:
      sharedParams = `/${ baseSegment }`
      break
    }

    // State
    if (fipsCode && fipsCode.length === 2) {
      // Nationwide Federal
      if (fipsCode === DFC.NATIONWIDE_FEDERAL_FIPS) {
        switch (dataType) {
        case DFC.REVENUE:
          queryLink = `${ sharedParams }&groupBy=${ props.groupBy }&landType=Federal - not tied to a lease,Federal Offshore,Federal Onshore`
          break
        case DFC.DISBURSEMENT:
          queryLink = `${ sharedParams }&groupBy=${ props.groupBy }&recipient=Historic Preservation Fund,Land and Water Conservation Fund,Other,Reclamation,State and local governments,U.S. Treasury`
          break
        case DFC.PRODUCTION:
          queryLink = `${ sharedParams }&groupBy=${ props.groupBy }&landType=${ DFC.NATIVE_AMERICAN }`
          break
        default:
          queryLink = `${ sharedParams }&groupBy=${ props.groupBy }`
          break
        }
      }

      // Native American
      else if (fipsCode === DFC.NATIVE_AMERICAN_FIPS) {
        queryLink = `${ sharedParams }&groupBy=${ props.groupBy }&landType=${ DFC.NATIVE_AMERICAN }`
      }

      else {
        queryLink = `${ sharedParams }&groupBy=${ props.groupBy }&stateOffshoreName=${ locationName }`
      }
    }

    // Offshore
    if (fipsCode && fipsCode.length === 3) {
      queryLink = `${ sharedParams }&groupBy=${ props.groupBy }&stateOffshoreName=${ locationName }`
    }

    // County
    if (fipsCode && fipsCode.length === 5) {
      queryLink = `${ sharedParams }&groupBy=${ DFC.COUNTY }&stateOffshoreName=${ locationName }`
    }

    // non card links
    if (!fipsCode) {
      queryLink = `${ sharedParams }&groupBy=${ props.groupBy }`
    }

    return queryLink
  }

  return (
    <>
      <Box mt={3}>
        <Link href={getQueryUrl('query-data', state)} linkType={props.linkType}>
          { props.children }
        </Link>
      </Box>
    </>
  )
}

export default QueryLink

QueryLink.propTypes = {
  // groupBy
  groupBy: PropTypes.string.isRequired,
  // linkType - icon used with link
  linkType: PropTypes.string
}
