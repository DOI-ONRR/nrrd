import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Map from '../../../data-viz/Map'
import * as d3 from 'd3'
// import { StoreContext } from '../../../../store'
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

const REVENUE_QUERY = gql`
  query FiscalCommodityRevenue($year: Int!, $commodities: [String!]) {
    revenue_commodity_summary(where: {state_or_area: {_nin: ["Nationwide Federal", ""]}, fiscal_year: { _eq: $year}, commodity: {_in: $commodities }}) {
      commodity
      fiscal_year
      state_or_area
      total
    }

  }
`

const RevenueCountyMap = props => {
  console.log('RevenueCountyMap props', props)
  const classes = useStyles()
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)

  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  const commodities = (filterState[DFC.COMMODITIES]) ? filterState[DFC.COMMODITIES] : undefined

  const { loading, error, data } = useQuery(REVENUE_QUERY, {
    variables: { year: year, commodities: commodities }
  })
  const mapFeatures = 'counties-geo'
  let mapData = [[]]
  const onZoomEnd = event => {
    console.debug('Event : ', event)
  }
  const state = props.state
  const showCountyContent = state === CONSTANTS.NATIONWIDE_FEDERAL || state === CONSTANTS.NATIVE_AMERICAN
  if (loading) {}
  if (error) return `Error! ${ error.message }`
  if (data) {
    mapData = data.revenue_commodity_summary.map((item, i) => [
      item.state_or_area,
      item.total
    ])
    mapData = d3.nest()
      .key(k => k.state_or_area)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(data.revenue_commodity_summary)
      .map(d => [d.key, d.value])
  }

  return (
    <>
      {mapData &&
       <Box className={classes.root}>
         {!showCountyContent &&
         <>
           <Box component="h4" fontWeight="bold" mb={2}>Revenue by county</Box>
           <Map
             key={`county_map_${ props.abbr }`}
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

export default RevenueCountyMap
