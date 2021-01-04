import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {
  isEdge,
  isChromium
} from 'react-device-detect'

import Map from '../../../data-viz/Map'
import * as d3 from 'd3'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

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

const PRODUCTION_QUERY = gql`
  query ProductionCountyMap($year: Int!, $product: String!, $state: String!, $period: String!) {
    production_summary(
      where: {
        location_type: {_eq: "County"},
        location: {_neq: "null"},
        state: {_eq: $state},
        year: { _eq: $year},
        product: {_eq: $product },
        period: { _eq: $period }
      }) {
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

const ProductionCountyMap = props => {
  const classes = useStyles()
  const { state: filterState } = useContext(DataFilterContext)

  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR
  const dataSet = (period === DFC.PERIOD_FISCAL_YEAR) ? 'FY ' + year : 'CY ' + year
  const product = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'

  const {
    fipsCode,
    regionType,
    minColor,
    maxColor
  } = props

  let locationType
  switch (regionType) {
  case DFC.STATE:
    locationType = DFC.STATE
    break
  case DFC.COUNTY_CAPITALIZED:
    locationType = DFC.COUNTY_CAPITALIZED
    break
  case DFC.OFFSHORE_CAPITALIZED:
    locationType = DFC.OFFSHORE_CAPITALIZED
    break
  default:
    locationType = DFC.COUNTY_CAPITALIZED
    break
  }

  const { loading, error, data } = useQuery(PRODUCTION_QUERY, {
    variables: { year: year, product: product, state: fipsCode, period: period },
    skip: fipsCode === DFC.NATIVE_AMERICAN_FIPS || locationType === ''
  })
  const mapFeatures = 'counties-geo'
  let mapData = [[]]

  if (loading) {}
  if (error) return `Error! ${ error.message }`
    if (data && data.production_summary.length > 0) {
	const clone = JSON.parse(JSON.stringify(mapCounties))
	const myReg = new RegExp('^' + STATE_FIPS_MAP[fipsCode] + '[0-9]{3}$')
	const tmp = clone.objects['counties-geo'].geometries.filter(obj => obj.id.match(myReg))
	clone.objects['counties-geo'].geometries = tmp	
	mapData = d3.nest()
      .key(k => k.location.padStart(5, 0))
      .rollup(v => d3.sum(v, i => i.total))
      .entries(data.production_summary)
      .map(d => [d.key, d.value])

    return (
      <>
        {mapData &&
       <Box className={classes.root}>
         {(locationType === DFC.COUNTY_CAPITALIZED || locationType === DFC.STATE) &&
         <>
           <Box component="h4" fontWeight="bold" mb={2}>Production by county</Box>
           <Map
             key={'PCM' + dataSet + '_' + fipsCode }
             mapFeatures={mapFeatures}
             mapJsonObject={clone}
             mapData={mapData}
             minColor={minColor}
             maxColor={maxColor}
             zoomTo={fipsCode}
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
