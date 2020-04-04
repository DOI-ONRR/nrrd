import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { StoreContext } from '../../../../store'

import CONSTANTS from '../../../../js/constants'

const REVENUE_QUERY = gql`
  query FiscalRevenue($year: Int!, $period: String!, $locations: [String!]) {
    fiscal_revenue_summary(where: {state_or_area: {_nin: ["Nationwide Federal", ""]}, fiscal_year: { _eq: $year }}) {
      fiscal_year
      state_or_area
      sum
    }
    fiscal_revenue_type_class_summary(order_by: {class_order: asc}, where: {year: {_eq: $year}}) {
      revenue_type
      sum
      year
      land_class
      class_order
    }
    distinct_locations(where: {location: {_neq: ""}}) {
      location
      location_id
      sort_order
    }
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
    # detail cards queries
    detailCardRevenueSummary: fiscal_revenue_summary(
      where: { state_or_area: { _in: $locations } }
      order_by: { fiscal_year: asc, state_or_area: asc }
    ) {
      fiscal_year
      state_or_area
      sum
      distinct_commodities
    }

    detailCardRevenueCommoditySummary: revenue_commodity_summary(
      where: { fiscal_year: { _eq: $year }, state_or_area: { _in: $locations } }
      order_by: { fiscal_year: asc, total: desc }
    ) {
      fiscal_year
      commodity
      state_or_area
      total
    }

    detailCardRevenueTypeSummary: revenue_type_summary(
      where: { fiscal_year: { _eq: $year }, state_or_area: { _in: $locations } }
      order_by: { fiscal_year: asc, total: desc }
    ) {
      fiscal_year
      revenue_type
      state_or_area
      total
    }

    # summary card queries
    summaryCardFiscalRevenueSummary: fiscal_revenue_summary(
      where: { state_or_area: { _in: $locations } }
      order_by: { fiscal_year: asc, state_or_area: asc }
    ) {
      fiscal_year
      state_or_area
      sum
      distinct_commodities
    }

    summaryCardRevenueCommoditySummary: revenue_commodity_summary(
      limit: 3
      where: { fiscal_year: { _eq: $year }, state_or_area: { _in: $locations } }
      order_by: { fiscal_year: asc, total: desc }
    ) {
      fiscal_year
      commodity
      state_or_area
      total
    }

    summaryCardCommoditySparkdata: revenue_commodity_summary(
      where: { state_or_area: { _in: $locations } }
      order_by: { fiscal_year: asc }
    ) {
      fiscal_year
      commodity
      total
      state_or_area
    }
  }
`
export default props => {
  console.log('Revenue props: ', props)
  const { state } = useContext(StoreContext)

  const year = state.year
  const cards = state.cards

  const activeLocations = []
  cards.forEach(item => {
    activeLocations.push(item.abbr)
  })

  const { loading, error, data } = useQuery(REVENUE_QUERY, {
    variables: { year, period: CONSTANTS.FISCAL_YEAR, locations: activeLocations }
  })

  let mapData = [[]]
  let children
  let detailCardRevenueSummaryData
  let detailCardRevenueCommoditySummaryData
  let detailCardRevenueTypeSummaryData
  let distinctLocationsData
  let landStatsData
  let locationTotalData
  let periodData
  let summaryCardFiscalRevenueSummaryData
  let summaryCardRevenueCommoditySummaryData
  let summaryCardCommoditySparkdataData
  let summaryData
  let isLoading = false


  if (loading) { isLoading = true }
  if (error) return `Error! ${ error.message }`

  if (data) {
    mapData = data.fiscal_revenue_summary.map((item, i) => [
      item.state_or_area,
      item.sum
    ])

    detailCardRevenueSummaryData = data.detailCardRevenueSummary
    detailCardRevenueCommoditySummaryData = data.detailCardRevenueCommoditySummary
    detailCardRevenueTypeSummaryData = data.detailCardRevenueTypeSummary
    distinctLocationsData = data.distinct_locations
    landStatsData = data.land_stats
    locationTotalData = data.locationTotal
    periodData = data.period
    summaryCardFiscalRevenueSummaryData = data.summaryCardFiscalRevenueSummary
    summaryCardRevenueCommoditySummaryData = data.summaryCardRevenueCommoditySummary
    summaryCardCommoditySparkdataData = data.summaryCardCommoditySparkdata
    summaryData = data.fiscal_revenue_type_class_summary

    console.log('periodData: ', periodData)

    // Pass children props
    children = React.Children.map(props.children, child => {
      return React.cloneElement(child, {
        detailCardRevenueSummaryData: detailCardRevenueSummaryData,
        detailCardRevenueCommoditySummaryData: detailCardRevenueCommoditySummaryData,
        detailCardRevenueTypeSummaryData: detailCardRevenueTypeSummaryData,
        distinctLocationsData: distinctLocationsData,
        exploreDataProps: props.exploreDataProps,
        isLoading: isLoading,
        landStatsData: landStatsData,
        locationTotalData: locationTotalData,
        mapData: mapData,
        periodData: periodData,
        summaryCardFiscalRevenueSummaryData: summaryCardFiscalRevenueSummaryData,
        summaryCardRevenueCommoditySummaryData: summaryCardRevenueCommoditySummaryData,
        summaryCardCommoditySparkdataData: summaryCardCommoditySparkdataData,
        summaryData: summaryData
      })
    })

    React.Children.forEach(children, element => {
      if (!React.isValidElement(element)) return
      console.log('child element: ', element)
    })
  }

  return (
    <>
      {children}
    </>
  )
}
