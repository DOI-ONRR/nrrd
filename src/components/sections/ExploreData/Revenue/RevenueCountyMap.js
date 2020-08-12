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
import { makeStyles } from '@material-ui/core/styles'
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
      width: '100%',
      overflow: 'hidden',
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
  query FiscalCommodityRevenue($year: Int!, $commodities: [String!], $period: String!) {
    revenue_summary(
      where: {location: {_nin: ["Nationwide Federal", ""]}, year: { _eq: $year}, commodity: {_in: $commodities }, period: { _eq: $period} }
    ) {
      commodity
      year
      location
      total
    }
  }
`

const RevenueCountyMap = props => {
  // console.log('RevenueCountyMap props: ', props)
  const classes = useStyles()
  const { state: filterState } = useContext(DataFilterContext)

  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  const commodities = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY].split(',') : undefined
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : 'Fiscal Year'
  const { loading, error, data } = useQuery(REVENUE_QUERY, {
    variables: { year: year, commodities: commodities, period: period }
  })
  const mapFeatures = 'counties-geo'
  let mapData = [[]]
    const fipsCode = props.fipsCode

  const showCountyContent = fipsCode === DFC.NATIONWIDE_FEDERAL_FIPS || fipsCode === DFC.NATIVE_AMERICAN_FIPS || props.regionType === 'County' || props.regionType === 'Offshore'

  if (loading) {}
  if (error) return `Error! ${ error.message }`
  if (data) {
    /* mapData = data.revenue_summary.map((item, i) => [
      item.location,
      item.total
    ])
   */
    mapData = d3.nest()
      .key(k => k.location)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(data.revenue_summary)
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
             key={`county_map_${ props.name }_${ year }`}
             mapFeatures={mapFeatures}
             mapJsonObject={mapCounties}
             mapData={mapData}
             minColor={props.minColor}
             maxColor={props.maxColor}
             zoomTo={props.fipsCode}
           />
         </>
         }
       </Box>
      }
    </>
  )
}

export default RevenueCountyMap
