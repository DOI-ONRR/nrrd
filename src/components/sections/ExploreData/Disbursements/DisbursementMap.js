import React, { useState, useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import * as d3 from 'd3'
import utils from '../../../../js/utils'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Container,
  Grid,
  Box,
  useMediaQuery
} from '@material-ui/core'

import Map from '../../../data-viz/Map'

// import { StoreContext } from '../../../../store'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import CONSTANTS from '../../../../js/constants'

const DISBURSEMENT_QUERY = gql`
  query FiscalDisbursement($year: Int!, $period: String!, $location: String!) {
    disbursement_summary(where: {state_or_area: {_nin: ["Nationwide Federal", ""]}, fiscal_year: { _eq: $year }, location_type: { _eq: $location}}) {
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

  const {
    year,
    mapLevel,
    period
  } = filterState

  const { loading, error, data } = useQuery(DISBURSEMENT_QUERY, {
    variables: { year: year, period: period, location: mapLevel }
  })
  const dataSet = 'FY ' + year
  let mapData = [[]]

  if (loading) {}
  if (error) return `Error! ${ error.message }`
  if (data) {
    // console.log('DisbursementMap data: ', data)
    /* mapData = data.fiscal_disbursement_summary.map((item, i) => [
      item.state_or_area,
      item.sum
      ]) */
    // console.log(data)
    mapData = d3.nest()
      .key(k => k.state_or_area)
      .rollup(v => d3.sum(v, i => i.sum))
      .entries(data.disbursement_summary)
      .map(d => [d.key, d.value])
  }

  // console.debug("Map props", props)
  return (
    <>
      {mapData &&
       <> <Map
         key={'DM' + dataSet }
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
       />
       </>
      }
    </>
  )
}
