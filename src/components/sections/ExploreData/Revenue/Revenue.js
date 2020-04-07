import React, { useContext, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { StoreContext } from '../../../../store'

import CONSTANTS from '../../../../js/constants'

const REVENUE_QUERY = gql`
  query FiscalRevenue($year: Int!, $period: String!, $state: [String!]) {
    fiscal_revenue_summary(where: {state_or_area: {_nin: ["Nationwide Federal", ""]}, fiscal_year: { _eq: $year }}) {
      fiscal_year
      state_or_area
      sum
    }
    distinct_locations(where: {location: {_neq: ""}}) {
      location
      location_id
      sort_order
    }
    # land stats
    land_stats {
      federal_acres
      federal_percent
      location
      total_acres
    }
    # location total query
    locationTotal:fiscal_revenue_summary(where: {state_or_area: {_neq: ""}, fiscal_year: {_eq: $year}}) {
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
  // const cards = state.cards
  // const stateOrArea = state.stateOrArea

  const { loading, error, data } = useQuery(REVENUE_QUERY, {
    variables: { year, period: CONSTANTS.FISCAL_YEAR }
  })

  let mapData = [[]]
  let children

  // let distinctLocationsData
  let landStatsData
  let locationTotalData
  // let nationalRevenueSummaryData
  let periodData

  if (loading) {}
  if (error) return `Error! ${ error.message }`

  if (data) {
    mapData = data.fiscal_revenue_summary.map((item, i) => [
      item.state_or_area,
      item.sum
    ])

    // distinctLocationsData = data.distinct_locations
    landStatsData = data.land_stats
    locationTotalData = data.locationTotal
    // nationalRevenueSummaryData = data.nationalRevenueSummary
    periodData = data.period

    // Pass children props
    children = React.Children.map(props.children, child => {
      return React.cloneElement(child, {
        // distinctLocationsData: distinctLocationsData,
        exploreDataProps: props.exploreDataProps,
        landStatsData: landStatsData,
        locationTotalData: locationTotalData,
        // nationalRevenueSummaryData: nationalRevenueSummaryData,
        mapData: mapData,
        periodData: periodData,
      })
    })
  }

  return (
    (dataType === CONSTANTS.REVENUE) ? <>{children}</> : null
  )
}
