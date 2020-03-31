import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { StoreContext } from '../../../store'

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
  const { format, stateOrArea } = props
  const { state } = useContext(StoreContext)
  const year = state.year

  const { loading, error, data } = useQuery(LOCATION_TOTAL_QUERY, {
    variables: { stateOrArea, year }
  })

  if (loading) return ''
  if (error) return `Error loading revenue data table ${ error.message }`

  if (data) {
    return (
      <>
        { data.fiscal_revenue_summary.length > 0 ? format(data.fiscal_revenue_summary[0].sum) : format(0) }
      </>
    )
  }
}

export default LocationTotal

LocationTotal.propTypes = {
  format: PropTypes.func,
  stateOrArea: PropTypes.string.isRequired
}
