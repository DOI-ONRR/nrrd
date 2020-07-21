import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import utils from '../../../../js/utils'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

const LOCATION_TOTAL_QUERY = gql`
  query NationwideFederal($locations: [String!], $year: Int!, $commodity: String!) {
    fiscal_production_summary(where: {
      state_or_area: {_in: $locations, _neq: ""}, 
      fiscal_year: {_eq: $year},
      commodity: {_eq: $commodity}
      }) {
      fiscal_year
      state_or_area
      sum
      unit_abbr
      commodity
    }
  }
`

const ProductionLocationTotal = props => {
  const { locations } = props
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const commodity = filterState[DFC.COMMODITY]

  const { loading, error, data } = useQuery(LOCATION_TOTAL_QUERY, {
    variables: { locations: locations, year: year, commodity: commodity }
  })

  if (loading) return ''
  if (error) return `Error loading revenue data table ${ error.message }`

  if (
    data &&
    data.fiscal_production_summary.length > 0) {
    const locationData = data.fiscal_production_summary
    let total
    if (locationData.length === 1) {
      total = locationData[0].sum
    }
    else {
      total = locationData.reduce((acc, val) => acc.sum + val.sum)
    }
    return (
      <>
        { utils.formatToCommaInt(total) }
      </>
    )
  }
  else {
    return null
  }
}

export default ProductionLocationTotal
