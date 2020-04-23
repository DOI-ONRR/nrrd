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

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import CONSTANTS from '../../../../js/constants'

const DISBURSEMENT_QUERY = gql`
  query FiscalDisbursement($year: Int!, $period: String!) {
    fiscal_disbursement_summary(where: {state_or_area: {_nin: ["Nationwide Federal", ""]}, fiscal_year: { _eq: $year }}) {
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
  const { state: filterState } = useContext(DataFilterContext)


  const year = filterState[DFC.YEAR]

  const { loading, error, data } = useQuery(DISBURSEMENT_QUERY, {
    variables: { year, period: CONSTANTS.FISCAL_YEAR }
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

  // console.debug("Map props", props)
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
        />
        </>
      }
    </>
  )
}
