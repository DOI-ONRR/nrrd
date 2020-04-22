import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { StoreContext } from '../../../store'
import utils from '../../../js/utils'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const LOCATION_TOTAL_QUERY = gql`
  query NationwideFederal($stateOrArea: String!, $year: Int!) {
    fiscal_revenue_summary(where: {state_or_area: {_eq: $stateOrArea, _neq: ""}, fiscal_year: {_eq: $year}}) {
      fiscal_year
      state_or_area
      sum
    }
  }
`

const LocationTotal = props => {
  const { location } = props
  const { state } = useContext(DataFilterContext)
  const year = state[DFC.YEAR]

  const { loading, error, data } = useQuery(LOCATION_TOTAL_QUERY, {
    variables: { stateOrArea: location, year: year }
  })

  if (loading) return ''
  if (error) return `Error loading revenue data table ${ error.message }`

  if (data) {
    return (
      <>
        { data.fiscal_revenue_summary.length > 0 && utils.formatToDollarInt(data.fiscal_revenue_summary[0].sum) }
      </>
    )
  }
}

export default LocationTotal
