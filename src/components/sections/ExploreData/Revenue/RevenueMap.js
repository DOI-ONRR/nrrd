import React, { useContext } from 'react'
import { useQuery, gql } from 'urql'

import Map from '../../../data-viz/Map'
import * as d3 from 'd3'
import utils from '../../../../js/utils'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

const REVENUE_QUERY = gql`
  query MapRevenue($year: Int!, $commodities: [String!], $location: [String!], $period: String!) {
    revenue_summary(where: {location: {_nin: ["Nationwide Federal", ""]}, year: { _eq: $year}, commodity: {_in: $commodities }, period: { _eq: $period}}) {
      commodity
      year
      location
      total
    }
  }
`

export default props => {
  const { state: filterState } = useContext(DataFilterContext)

  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  const commodities = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY].split(',') : undefined
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : 'Fiscal Year'

  const [result, _reexecuteQuery] = useQuery({
    query: REVENUE_QUERY,
    variables: { 
      year: year, 
      commodities: commodities, 
      period: period 
    }
  });

  const { data, fetching, error } = result;

  let mapData = [[]]

  if (fetching) {}
  if (error) return `Error! ${ error.message }`
  if (data) {
    mapData = data.revenue_summary.map((item, i) => [
      item.location,
      item.total
    ])
    mapData = d3.nest()
      .key(k => k.location)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(data.revenue_summary)
      .map(d => [d.key, d.value])
  }

  return (
    <>
      {mapData &&
        <>
          <Map key={`RMAP${ year }${ props.width }`}
            mapFeatures={props.mapFeatures}
            mapJsonObject={props.mapJsonObject}
            mapData={mapData}
            minColor={props.minColor}
            maxColor={props.maxColor}
            mapZoom={props.mapZoom}
            mapX={props.mapX}
            mapY={props.mapY}
            onZoomEnd={props.onZoomEnd}
            onClick={props.onClick}
            legendFormat={utils.formatToSigFig_Dollar}
            handleMapSnackbar={props.handleMapSnackbar}
            handleMapSnackbarClose={props.handleMapSnackbarClose}
            width={props.width}
          />
        </>
      }
    </>
  )
}
