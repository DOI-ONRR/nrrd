import React, { useState, useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Container,
  Grid,
  Box,
  useMediaQuery
} from '@material-ui/core'

import Map from '../../../data-viz/Map'

import { StoreContext } from '../../../../store'

import mapCounties from '../counties.json'
import mapStates from '../states.json'
import mapCountiesOffshore from '../counties-offshore.json'
import mapStatesOffshore from '../states-offshore.json'

import CONSTANTS from '../../../../js/constants'

const REVENUE_QUERY = gql`
  query FiscalRevenue($year: Int!, $period: String!) {
    fiscal_revenue_summary(where: {state_or_area: {_nin: ["Nationwide Federal", ""]}, fiscal_year: { _eq: $year }}) {
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

  // const [mapX, setMapX] = useState()
  // const [mapY, setMapY] = useState()
  // const [mapK, setMapK] = useState(0.25)

  // let x = mapX
  // let y = mapY
  // let k = mapK

  const year = state.year

  const { loading, error, data } = useQuery(REVENUE_QUERY, {
    variables: { year, period: CONSTANTS.FISCAL_YEAR }
  })

  let mapData = [[]]

  if (loading) {}
  if (error) return `Error! ${ error.message }`
  if (data) {
    mapData = data.fiscal_revenue_summary.map((item, i) => [
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
