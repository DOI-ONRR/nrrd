import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { StoreContext } from '../../../../store'

import CONSTANTS from '../../../../js/constants'

const REVENUE_QUERY = gql`
  query FiscalRevenue($year: Int!, $period: String!) {
    fiscal_revenue_summary(where: {state_or_area: {_nin: ["Nationwide Federal", ""]}, fiscal_year: { _eq: $year }}) {
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

  const year = state.year
  const dataType = state.dataType

  const { loading, error, data } = useQuery(REVENUE_QUERY, {
    variables: { year, period: CONSTANTS.FISCAL_YEAR }
  })

  let mapData = [[]]
  let children
  let periodData

  if (loading) {}
  if (error) return `Error! ${ error.message }`

  if (data) {
    mapData = data.fiscal_revenue_summary.map((item, i) => [
      item.state_or_area,
      item.sum
    ])

    periodData = data.period

    // Pass children props
    children = React.Children.map(props.children, child => {
      return React.cloneElement(child, {
        exploreDataProps: props.exploreDataProps,
        mapData: mapData,
        periodData: periodData
      })
    })
  }

  return (
    (dataType === CONSTANTS.REVENUE) ? <>{children}</> : null
  )
}
