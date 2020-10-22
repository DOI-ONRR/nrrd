import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import utils from '../../../../js/utils'
import * as d3 from 'd3'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

const LOCATION_TOTAL_QUERY = gql`
  query NationwideFederal($location: [String!], $year: Int!, $period: String!) {
    disbursement_summary(where: {fiscal_year: {_eq: $year}, state_or_area: {_in: $location}}) {
      fiscal_year
      state_or_area
      sum
    }
  }
`

const DisbursementLocationTotal = props => {
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR

  const { loading, error, data } = useQuery(LOCATION_TOTAL_QUERY, {
    variables: { location: ['NF', 'NA'], year: year, period }
  })

  if (loading) return ''
  if (error) return `Error loading revenue data table ${ error.message }`
  let nationwideSummary = []
  let nativeSummary = []

  if (data) {
    const groupedLocationData = utils.groupBy(data.disbursement_summary, 'state_or_area')

    if (groupedLocationData[DFC.NATIONWIDE_FEDERAL_FIPS] && groupedLocationData[DFC.NATIONWIDE_FEDERAL_FIPS].length > 0) {
      nationwideSummary = d3.nest()
        .key(k => k.state_or_area)
        .rollup(v => d3.sum(v, i => i.sum))
        .entries(groupedLocationData.NF)
        .map(d => {
          return ({ location_name: d.key, total: d.value })
        })
    }
    else {
      nationwideSummary = [{ location: DFC.NATIONWIDE_FEDERAL_FIPS, total: 0 }]
    }

    if (groupedLocationData[DFC.NATIVE_AMERICAN_FIPS] && groupedLocationData[DFC.NATIVE_AMERICAN_FIPS].length > 0) {
      nativeSummary = d3.nest()
        .key(k => k.state_or_area)
        .rollup(v => d3.sum(v, i => i.sum))
        .entries(groupedLocationData.NA)
        .map(d => {
          return ({ location_name: d.key, total: d.value })
        })
    }
    else {
      nativeSummary.total = [{ location: DFC.NATIVE_AMERICAN_FIPS, total: 0 }]
    }

    return (
      <>
        After collecting revenue from natural resource extraction, the Office of Natural Resources Revenue (ONRR) distributes that money to different agencies,
        funds, and local governments for public use. This process is called "disbursement." <strong>In {period.toLowerCase()} {year},
        ONRR disbursed {utils.formatToDollarInt(nationwideSummary[0].total)} from federal sources and {utils.formatToDollarInt(nativeSummary[0].total)} from Native American sources for a total of {utils.formatToDollarInt(nationwideSummary[0].total + nativeSummary[0].total)}</strong>.
      </>
    )
  }
}

export default DisbursementLocationTotal

DisbursementLocationTotal.propTypes = {
  location: PropTypes.array
}
