import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import * as d3 from 'd3'
import Map from '../../../data-viz/Map'

import { StoreContext } from '../../../../store'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

const APOLLO_QUERY = gql`
  query FiscalProduction($year: Int!, $commodity: String!, $period: String!) {
    production_summary(where: {location: {_nin: ["Nationwide Federal", ""]}, year: { _eq: $year }, product: {_eq: $commodity}, period: { _eq: $period} }) {
      year
      location
      unit_abbr
      total
      
    }
  }
`

export default props => {
  const { state: filterState } = useContext(DataFilterContext)

  const commodity = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : 'Fiscal Year'
  const year = filterState[DFC.YEAR]
  const dataSet = 'FY ' + year
  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { year, commodity, period }
  })

  let mapData = [[]]
  let unit=''
  
  if (loading) {}
  if (error) return `Error! ${ error.message }`
  if (data && data.production_summary.length > 0) {
    mapData = data.production_summary.map((item, i) => [
      item.location,
      item.total
    ])
    unit = data.production_summary[0].unit_abbr
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
