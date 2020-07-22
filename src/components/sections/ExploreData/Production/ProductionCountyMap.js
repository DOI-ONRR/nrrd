import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Map from '../../../data-viz/Map'
import * as d3 from 'd3'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import CONSTANTS from '../../../../js/constants'
import mapCounties from '../counties.json'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Box
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'top',
    '& .mapContainer': {
      height: 100,
      width: 245,
    },
    '& .mapContainer > .legend': {
      display: 'none', // quick fix for now, will want to disable most map features for smaller maps
    },
    '& .mapContainer svg': {
      pointerEvents: 'none',
    }
  }
}))

const PRODUCTION_QUERY = gql`
  query ProductionCountyMap($year: Int!, $product: String!, $state: String!, $period: String!) {
    production_summary(where: {location_type: {_eq: "County"}, state: {_eq: $state}, year: { _eq: $year}, product: {_eq: $product }, period: { _eq: $period }}) {
      year
      location
      total
    }

  }
`

const ProductionCountyMap = props => {
  const classes = useStyles()
  const { state: filterState } = useContext(DataFilterContext)

  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : 'Fiscal Year'
  const dataSet = (period === 'Fiscal Year') ? 'FY ' + year : 'CY ' + year
  const product = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  let state = ''
  let location = 'County'
  if (props.abbr && props.abbr.length === 2) {
    location = 'County'
    state = props.abbr
  }
  else if (props.abbr && props.abbr.length === 5) {
    location = ''
    state = ''
  }
  else {
    location = 'State'
    state = ''
  }

  const { loading, error, data } = useQuery(PRODUCTION_QUERY, {
    variables: { year: year, product: product, state: state, period: period },
    skip: props.state === CONSTANTS.NATIVE_AMERICAN || location === ''
  })
  const mapFeatures = 'counties-geo'
  let mapData = [[]]
  const onZoomEnd = event => {

  }
  const showCountyContent = state === CONSTANTS.NATIONWIDE_FEDERAL || state === CONSTANTS.NATIVE_AMERICAN || props.fips.length === 5 || props.fips.length === 3
  if (loading) {}
  if (error) return `Error! ${ error.message }`
  if (data) {
    mapData = d3.nest()
      .key(k => k.location.padStart(5, 0))
      .rollup(v => d3.sum(v, i => i.total))
      .entries(data.production_summary)
      .map(d => [d.key, d.value])

    return (
      <>
        {mapData &&
       <Box className={classes.root}>
         {!showCountyContent &&
         <>
           <Box component="h4" fontWeight="bold" mb={2}>Production by county</Box>
           <Map
             key={'PCM' + dataSet + '_' + props.abbr }
             mapFeatures={mapFeatures}
             mapJsonObject={mapCounties}
             mapData={mapData}
             minColor={props.minColor}
             maxColor={props.maxColor}
             zoomTo={props.abbr}
           />
         </>
         }
       </Box>
        }
      </>
    )
  }
  else {
    return <Box className={classes.root} />
  }
}

export default ProductionCountyMap
