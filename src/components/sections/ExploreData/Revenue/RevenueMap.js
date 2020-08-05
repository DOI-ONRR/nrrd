import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Map from '../../../data-viz/Map'
import * as d3 from 'd3'
import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import CONSTANTS from '../../../../js/constants'

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

  const { loading, error, data } = useQuery(REVENUE_QUERY, {
    variables: { year: year, commodities: commodities, period: period }
  })

  let mapData = [[]]
  const onZoomEnd = event => {
    console.debug('Event : ', event)
  }
  if (loading) {}
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
          <Map key={`RMAP${ year }`}
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
            handleMapSnackbarClose={props.handleMapSnackbarClose} />
        </>
      }
    </>
  )
}
