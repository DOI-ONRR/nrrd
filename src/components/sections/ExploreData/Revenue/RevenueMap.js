import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Map from '../../../data-viz/Map'
import * as d3 from 'd3'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import CONSTANTS from '../../../../js/constants'

const REVENUE_QUERY = gql`
  query FiscalCommodityRevenue($year: Int!, $commodities: [String!]) {
    revenue_commodity_summary(where: {state_or_area: {_nin: ["Nationwide Federal", ""]}, fiscal_year: { _eq: $year}, commodity: {_in: $commodities }}) {
      commodity
      fiscal_year
      state_or_area
      total
    }

  }
`

export default props => {
  const { state: filterState } = useContext(DataFilterContext)

  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  const commodities = (filterState[DFC.COMMODITIES]) ? filterState[DFC.COMMODITIES] : undefined

  const { loading, error, data } = useQuery(REVENUE_QUERY, {
    variables: { year: year, commodities: commodities }
  })

  let mapData = [[]]

  if (loading) {}
  if (error) return `Error! ${ error.message }`
  if (data) {
    mapData = data.revenue_commodity_summary.map((item, i) => [
      item.state_or_area,
      item.total
    ])
    mapData = d3.nest()
      .key( k => k.state_or_area)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(data.revenue_commodity_summary)
      .map( d => [d.key, d.value])

  }

  return (
    <>
      {mapData &&
        <> <Map
          mapFeatures={props.mapFeatures}
          mapJsonObject={props.mapJsonObject}
          mapData={mapData}
          minColor={props.minColor}
          maxColor={props.maxColor}
          mapZoom={props.mapK}
          mapX={props.mapX}
          mapY={props.mapY}
          onZoomEnd={props.onZoomEnd}
          onClick={props.onClick}
          handleMapSnackbar={props.handleMapSnackbar}
          handleMapSnackbarClose={props.handleMapSnackbarClose}
        />
        </>
      }
    </>
  )
}
