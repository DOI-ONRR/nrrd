import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Map from '../../../data-viz/Map'

import { StoreContext } from '../../../../store'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

const APOLLO_QUERY = gql`
  query FiscalDisbursements($year: Int!) {
    fiscal_disbursement_summary(where: {state_or_area: {_nin: ["Nationwide Federal", ""]}, fiscal_year: { _eq: $year }}) {
      fiscal_year
      state_or_area
      sum
    }
  }
`

export default props => {
  const { state } = useContext(DataFilterContext)

  const year = state[DFC.YEAR]

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { year }
  })

  let mapData = [[]]

  if (loading) {}
  if (error) return `Error! ${ error.message }`
  if (data) {
    mapData = data.fiscal_disbursement_summary.map((item, i) => [
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
