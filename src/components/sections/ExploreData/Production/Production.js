import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { StoreContext } from '../../../../store'

import CONSTANTS from '../../../../js/constants'

const PRODUCTION_QUERY = gql`
  query FiscalProduction($year: Int!, $period: String!, $state: [String!]) {
    fiscal_disbursement_summary(where: {state_or_area: {_nin: ["Nationwide Federal", ""]}, fiscal_year: { _eq: $year }}) {
      fiscal_year
      state_or_area
      sum
    }
    # period query
    period(where: {period: {_ilike: $period }}) {
      fiscal_year
    }
  }
`

export default props => {
  const { state } = useContext(StoreContext)
  const dataType = state.dataType
  const year = state.year

  const { loading, error, data } = useQuery(PRODUCTION_QUERY, {
    variables: { year, period: CONSTANTS.FISCAL_YEAR }
  })

  let mapData = [[]]
  let periodData

  if (loading) {}
  if (error) return `Error! ${ error.message }`

  if (data) {
    mapData = data.fiscal_disbursement_summary.map((item, i) => [
      item.state_or_area,
      item.sum
    ])
    periodData = data.period
  }

  // Pass children props
  const children = React.Children.map(props.children, child => {
    return React.cloneElement(child, {
      exploreDataProps: props.exploreDataProps,
      mapData: mapData,
      periodData: periodData,
    })
  })

  return (
    (dataType === CONSTANTS.PRODUCTION) ? <>{children}</> : null
  )
}
