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

  const isCounty = state && state.length === 5
  const isNativeAmerican = state && state === DFC.NATIVE_AMERICAN_FIPS
  const isNationwideFederal = state && state === DFC.NATIONWIDE_FEDERAL_FIPS
  const isState = state && state.length === 2 && !isNativeAmerican && !isNationwideFederal
  const isOffshore = state && state.length === 3

  let locationName = props.locationName

  if (isOffshore) {
    locationName = `${ props.regionType } ${ props.locationName }`
  }

  if (isCounty) {
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
    // Parameter mapping
    const params = {
      [DFC.DATA_TYPE]: dataType,
      [DFC.PERIOD]: period,
      [periodParam]: yearRange,
      [DFC.GROUP_BY]: props[DFC.GROUP_BY] || DFC.COUNTY,
      [DFC.COMMODITY]: (dataType === DFC.REVENUE) ? (commodity || undefined) : undefined,
      [DFC.RECIPIENT]: props[DFC.RECIPIENT] || undefined,
      [DFC.PRODUCT]: (dataType === DFC.PRODUCTION) ? (commodity || 'Oil (bbl)') : undefined,
      [DFC.LAND_TYPE]: props[DFC.LAND_TYPE] || undefined,
      [DFC.STATE_OFFSHORE_NAME]: (isState || isCounty || isOffshore) ? locationName : undefined,
      [DFC.US_STATE_NAME]: (isState || isCounty || isOffshore) ? locationName : undefined,
    }

    const queryArr = []
    Object.keys(params).map(key => {
      // encode url
      if (params[key] !== undefined) queryArr.push(`${ key }=${ params[key] }`)
    })

    const queryString = queryArr.join('&')

    const queryLink = `/${ baseSegment }?${ queryString }`

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
