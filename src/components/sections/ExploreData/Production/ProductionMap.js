import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Map from '../../../data-viz/Map'

import { StoreContext } from '../../../../store'

const APOLLO_QUERY = gql`
  query FiscalProduction($year: Int!, $commodity: String!) {
    fiscal_production_summary(where: {state_or_area: {_nin: ["Nationwide Federal", ""]}, fiscal_year: { _eq: $year }, commodity: {_eq: $commodity}}) {
      fiscal_year
      state_or_area
      sum
      
    }
  }
`

export default props => {
  const { state } = useContext(StoreContext)

  const year = state.year
  const commodity=state.commodity
  console.debug("STATE", state)
  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { year, commodity }
  })

  let mapData = [[]]

  if (loading) {}
  if (error) return `Error! ${ error.message }`
  if (data) {
    mapData = data.fiscal_production_summary.map((item, i) => [
      item.state_or_area,
      item.sum
    ])
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
