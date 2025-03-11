import React, { useContext } from 'react'
import { useQuery, gql } from '@apollo/client'
import * as d3 from 'd3'
import utils from '../../../../js/utils'

import Map from '../../../data-viz/Map'

import { DataFilterContext } from '../../../../stores/data-filter-store'

const DISBURSEMENT_QUERY = gql`
  query FiscalDisbursement($year: Int!, $period: String!, $location: String!) {
    disbursement_summary(where: {state_or_area: {_nin: ["Nationwide Federal", ""]}, fiscal_year: { _eq: $year }, location_type: { _eq: $location}}) {
      fiscal_year
      state_or_area
      sum
    }

    # period query
    period(where: {period: {_ilike: $period }}, order_by: {fiscal_year: asc}) {
      fiscal_year
    }
  }
`

export default props => {
  const { state: filterState } = useContext(DataFilterContext)

  const {
    year,
    mapLevel,
    period
  } = filterState

  const { data, loading, error } = useQuery(DISBURSEMENT_QUERY, {
    variables: {
      year,
      period: period || filterState.explore_data_filter_default.period,
      location: mapLevel || filterState.explore_data_filter_default.mapLevel
    },
  })

  const dataSet = 'FY ' + year
  let mapData = [[]]

  if (loading) return 'Loading ...'

  if (error) return `Error! ${ error.message }`
  if (data) {
    mapData = d3.nest()
      .key(k => k.state_or_area)
      .rollup(v => d3.sum(v, i => i.sum))
      .entries(data.disbursement_summary)
      .map(d => [d.key, d.value])
  }

  return (
    <>
      {mapData &&
       <>
         <Map
           key={`DM${ dataSet }${ props.width }`}
           mapFeatures={props.mapFeatures}
           mapJsonObject={props.mapJsonObject}
           mapData={mapData}
           minColor={props.minColor}
           maxColor={props.maxColor}
           mapZoom={props.mapZoom}
           mapX={props.mapX}
           mapY={props.mapY}
           onZoomEnd={props.onZoomEnd}
           legendFormat={utils.formatToSigFig_Dollar}
           onClick={props.onClick}
           width={props.width}
         />
       </>
      }
    </>
  )
}
