import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { StoreContext } from '../../../store'
import utils from '../../../js/utils'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const LOCATION_TOTAL_QUERY = gql`
  query NationwideFederal($locations: [String!], $year: Int!) {
    fiscal_revenue_summary(where: {state_or_area: {_in: $locations, _neq: ""}, fiscal_year: {_eq: $year}}) {
      fiscal_year
      state_or_area
      sum
    }
  }
`

const LocationTotal = props => {
  // console.log('LocationTotal props: ', props)
  const { locations } = props
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]

  const { loading, error, data } = useQuery(LOCATION_TOTAL_QUERY, {
    variables: { locations: locations, year: year }
  })

  if (loading) return ''
  if (error) return `Error loading revenue data table ${ error.message }`

  if (
    data &&
    data.fiscal_revenue_summary.length > 0
  ) {
    const locationData = data.fiscal_revenue_summary

    let total
    if (locationData.length === 1) {
      total = locationData[0].sum
    }
    else {
      total = locationData.reduce((acc, val) => acc.sum + val.sum)
    }
    return (
      <>
        {utils.formatToDollarInt(total)}
      </>
    )
  }
  else {
    return null
  }
}

export default LocationTotal

LocationTotal.propTypes = {
  locations: PropTypes.array
}
