import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import * as d3 from 'd3'
import Map from '../../../data-viz/Map'

import { StoreContext } from '../../../../store'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

const APOLLO_QUERY = gql`
  query FiscalProduction($year: Int!, $commodity: String!) {
    fiscal_production_summary(where: {state_or_area: {_nin: ["Nationwide Federal", ""]}, fiscal_year: { _eq: $year }, commodity: {_eq: $commodity}}) {
      fiscal_year
      state_or_area
      unit_abbr
      sum
      
    }
  }
`

export default props => {
  const { state: filterState } = useContext(DataFilterContext)

  const commodity = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  const year = filterState[DFC.YEAR]
  const dataSet = 'FY ' + year
  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { year, commodity }
  })

  let mapData = [[]]
  let unit=''
  
  if (loading) {}
  if (error) return `Error! ${ error.message }`
  if (data) {
    mapData = data.fiscal_production_summary.map((item, i) => [
      item.state_or_area,
      item.sum
    ])
    unit = data.fiscal_production_summary[0].unit_abbr
  }

  return (
    <>
      {mapData &&
        <> <Map
          key={'PM' + dataSet }
          mapFeatures={props.mapFeatures}
          mapJsonObject={props.mapJsonObject}
          mapData={mapData}
          minColor={props.minColor}
          maxColor={props.maxColor}
          mapZoom={props.mapZoom}
          mapX={props.mapX}
       mapY={props.mapY}
       mapUnits={unit}
          onZoomEnd={props.onZoomEnd}
          onClick={props.onClick}
          handleMapSnackbar={props.handleMapSnackbar}
          handleMapSnackbarClose={props.handleMapSnackbarClose}
          mapFormat={ d => {
            if (isNaN(d)) {
              return ''
            }
            else {
              return d3.format(',.0f')(d) + ' ' + unit
            }
          }
          }
        />
        </>
      }
    </>
  )
}
