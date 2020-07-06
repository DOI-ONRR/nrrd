import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { StoreContext } from '../../../store'
import utils from '../../../js/utils'
import * as d3 from 'd3'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const LOCATION_TOTAL_QUERY = gql`
  query NationwideFederal($location: String!, $year: Int!, $period: String!) {
   revenue_summary  (
          where: {location_type: {_eq: $location}, year: { _eq: $year }, location_name: {_neq: ""}, period: {_eq: $period } }
    ) {
      location_name
      year
      location
      total
  }
}
`

const LocationTotal = props => {
  const { location } = props
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : 'Fiscal Year'
  const { loading, error, data } = useQuery(LOCATION_TOTAL_QUERY, {
    variables: {location: location, year: year, period }
  })

  if (loading) return ''
  if (error) return `Error loading revenue data table ${ error.message }`
  let totalSummary = []
  if (data) {
    totalSummary = d3.nest()
      .key(k => k.location_name)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(data.revenue_summary)
      .map(d => {return ( { location_name: d.key, total: d.value } ) })
      return (
        <>
        <strong>In {period.toLowerCase()} {year}, ONRR collected a total of { totalSummary[0].length > 0 && utils.formatToDollarInt(totalSummary[0].total) } in revenue from federal sources.</strong>  
        </>
    )
  }
  
}


export default LocationTotal
