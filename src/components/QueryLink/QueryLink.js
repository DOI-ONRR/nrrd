import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { DataFilterContext } from '../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../constants'

import Link from '../../components/Link'

import {
  Box
} from '@material-ui/core'

import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: '1rem',
  }
}))

const QueryLink = props => {
  // console.log('QueryLink props: ', props)
  const classes = useStyles()
  const { state: filterState } = useContext(DataFilterContext)
  // console.log('filterState: ', filterState)
  const year = filterState[DFC.YEAR]
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.FISCAL_YEAR_LABEL
  const state = props.fipsCode
  const dataType = filterState.dataType
  const commodity = filterState.commodity

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

    const params = {
      [DFC.DATA_TYPE]: dataType,
      [DFC.PERIOD]: period,
      [periodParam]: yearRange,
      [DFC.GROUP_BY]: (fipsCode && fipsCode.length === 5) ? DFC.COUNTY : props.groupBy
    }

    const queryString = Object.keys(params).map(key => `${ key }=${ params[key] }`).join('&')
    const productString = commodity ? encodeURIComponent(commodity) : encodeURIComponent('Oil (bbl)')

    // check dataType
    switch (dataType) {
    case DFC.REVENUE:
      sharedParams = commodity ? `/${ baseSegment }/?${ queryString }&commodity=${ commodity }` : `/${ baseSegment }/?${ queryString }`
      break
    case DFC.DISBURSEMENTS:
      sharedParams = `/${ baseSegment }/?${ queryString }`
      break
    case DFC.PRODUCTION:
      sharedParams = `/${ baseSegment }/?${ queryString }&product=${ productString }`
      break
    default:
      sharedParams = `/${ baseSegment }`
      break
    }

    // State
    if (fipsCode && fipsCode.length === 2) {
      // Nationwide Federal
      if (fipsCode === DFC.NATIONWIDE_FEDERAL_FIPS) {
        const revenueLandTypeString = encodeURIComponent('Federal - not tied to a lease,Federal Offshore,Federal Onshore')
        const disbursementString = encodeURIComponent('Historic Preservation Fund,Land and Water Conservation Fund,Other,Reclamation,State and local governments,U.S. Treasury')
        const productionLandTypeString = encodeURIComponent('Federal - not tied to a lease,Federal Offshore,Federal Onshore,Mixed Exploratory')

        switch (dataType) {
        case DFC.REVENUE:
          queryLink = `${ sharedParams }&landType=${ revenueLandTypeString }`
          break
        case DFC.DISBURSEMENT:
          queryLink = `${ sharedParams }&recipient=${ disbursementString }`
          break
        case DFC.PRODUCTION:
          queryLink = `${ sharedParams }&landType=${ productionLandTypeString }&groupBySticky=product`
          break
        default:
          queryLink = `${ sharedParams }`
          break
        }
      }

      // Native American
      else if (fipsCode === DFC.NATIVE_AMERICAN_FIPS) {
        queryLink = `${ sharedParams }&landType=${ DFC.NATIVE_AMERICAN }`
      }

      else {
        queryLink = `${ sharedParams }&stateOffshoreName=${ locationName }`
      }
    }

    // Offshore
    if (fipsCode && fipsCode.length === 3) {
      queryLink = `${ sharedParams }&stateOffshoreName=${ locationName }`
    }

    // County
    if (fipsCode && fipsCode.length === 5) {
      queryLink = `${ sharedParams }&stateOffshoreName=${ locationName }`
    }

    // non card links
    if (!fipsCode) {
      queryLink = `${ sharedParams }`
    }

    return queryLink
  }

  return (
    <>
      <Box mt={3} className={classes.root}>
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
