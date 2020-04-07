import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import utils from '../../../js/utils'
import { StoreContext } from '../../../store'

const APOLLO_QUERY = gql`
  query FiscalRevenue($year: Int!) {
    # location total query
    locationTotal:fiscal_revenue_summary(where: {state_or_area: {_neq: ""}, fiscal_year: {_eq: $year}}) {
      fiscal_year
      state_or_area
      sum
    }
  }
`

const LocationTotal = ({ location }) => {
  const { state } = useContext(StoreContext)
  const year = state.year
  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { year }
  })

  let locationTotalData
  let locData

  if (loading) {}
  if (error) return `Error! ${ error.message }`

  if (data) {
    locationTotalData = data.locationTotal
    locData = locationTotalData.find(item => item.state_or_area === location)
  }

  return (
    <>
      {locData &&
        utils.formatToDollarInt(locData.sum)
      }
    </>
  )
}

export default LocationTotal
