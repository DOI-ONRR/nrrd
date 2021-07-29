import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Map from '../../../data-viz/Map'
import * as d3 from 'd3'
import { useInView } from 'react-intersection-observer'

import {
  isEdge,
  isChromium
} from 'react-device-detect'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'
import QueryLink from '../../../../components/QueryLink'

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
    height: '250px',
    '& .mapContainer > .legendWrap': {
      display: 'none', // quick fix for now, will want to disable most map features for smaller maps
    },
    '& .mapContainer svg': {
      pointerEvents: 'none',
      '& path': {
        strokeWidth: (isEdge && !isChromium) ? '0.15px' : '1px',
      },
    },
  }
}))

const REVENUE_QUERY = gql`
  query FiscalCommodityRevenue($location: String!, $year: Int!, $commodities: [String!], $period: String!) {
    revenue_summary(
      where: {location: {_ilike: $location}, year: { _eq: $year}, commodity: {_in: $commodities }, period: { _eq: $period} }
    ) {
      commodity
      year
      location
      total
    }
  }
`
const STATE_FIPS_MAP =
      {
        AK: '02',
        AL: '01',
        AR: '05',
        AS: '60',
        AZ: '04',
        CA: '06',
        CO: '08',
        CT: '09',
        DC: '11',
        DE: '10',
        FL: '12',
        GA: '13',
        GU: '66',
        HI: '15',
        IA: '19',
        ID: '16',
        IL: '17',
        IN: '18',
        KS: '20',
        KY: '21',
        LA: '22',
        MA: '25',
        MD: '24',
        ME: '23',
        MI: '26',
        MN: '27',
        MO: '29',
        MS: '28',
        MT: '30',
        NC: '37',
        ND: '38',
        NE: '31',
        NH: '33',
        NJ: '34',
        NM: '35',
        NV: '32',
        NY: '36',
        OH: '39',
        OK: '40',
        OR: '41',
        PA: '42',
        PR: '72',
        RI: '44',
        SC: '45',
        SD: '46',
        TN: '47',
        TX: '48',
        UT: '49',
        VA: '51',
        VI: '78',
        VT: '50',
        WA: '53',
        WI: '55',
        WV: '54',
        WY: '56'
      }

const RevenueCountyMap = props => {
  // console.log('RevenueCountyMap props: ', props)
  const classes = useStyles()
  const { state: filterState } = useContext(DataFilterContext)

  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  const commodities = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY].split(',') : undefined
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : 'Fiscal Year'
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true
  })

  const fipsCode = props.fipsCode
  const skipQuery = fipsCode === DFC.NATIONWIDE_FEDERAL_FIPS ||
			      fipsCode === DFC.NATIVE_AMERICAN_FIPS ||
			      props.regionType === 'County' || props.regionType === 'Offshore' || !inView
  const location = STATE_FIPS_MAP[fipsCode] + '%'
  const { loading, error, data } = useQuery(REVENUE_QUERY, {
    variables: { location: location, year: year, commodities: commodities, period: period },
    skip: skipQuery
  })
  const mapFeatures = 'counties-geo'
  let mapData = [[]]

  if (loading) {}
  if (error) return `Error! ${ error.message }`
  if (data) {
    /* mapData = data.revenue_summary.map((item, i) => [
	   item.location,
	   item.total
	   ])
	 */
    const clone = JSON.parse(JSON.stringify(mapCounties))
    const myReg = new RegExp('^' + STATE_FIPS_MAP[fipsCode] + '[0-9]{3}$')
    const tmp = clone.objects['counties-geo'].geometries.filter(obj => obj.id.match(myReg))
    clone.objects['counties-geo'].geometries = tmp
    mapData = d3.nest()
		    .key(k => k.location)
		    .rollup(v => d3.sum(v, i => i.total))
		    .entries(data.revenue_summary)
		    .map(d => [d.key, d.value])

    return (
      <>
        <Box className={classes.root} ref={ref} >
          <Box component="h4" fontWeight="bold" mb={2}>Revenue by county</Box>
          <Map
            key={`county_map_${ props.name }_${ year }`}
            mapFeatures={mapFeatures}
            mapJsonObject={clone}
            mapData={mapData}
            minColor={props.minColor}
            maxColor={props.maxColor}
            zoomTo={props.fipsCode}
	          disableMapControls={true}
          />
	      </Box>
        <QueryLink
          groupBy={DFC.COUNTY}
          landType="Federal - not tied to a lease,Federal Offshore,Federal Onshore"
          linkType="FilterTable"
          breakoutBy={DFC.REVENUE_TYPE}
          {...props}>
          Query revenue by county
        </QueryLink>
      </>
    )
  }
  else {
    return (
	    <Box className={classes.root} ref={ref}>
	    </Box>

    )
  }
}

export default RevenueCountyMap
