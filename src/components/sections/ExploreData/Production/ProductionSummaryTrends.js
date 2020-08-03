import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import * as d3 from 'd3'
import {
  Box,
  Grid,
  Typography
} from '@material-ui/core'

import Sparkline from '../../../data-viz/Sparkline'
import LocationName from '../LocationName'

import { StoreContext } from '../../../../store'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import utils from '../../../../js/utils'
import CONSTANTS from '../../../../js/constants'

const APOLLO_QUERY = gql`
  query ProductionSummaryTrend($state: String!, $product: String!, $period: String!) {
    production_summary(
      where: { location: { _eq: $state }, product: {_eq: $product}, period: {_eq: $period }}
      order_by: { year: asc, total: asc }
    ) {
      year
      location
      unit_abbr
      total
    
    }

    period(where: {period: {_ilike: $period }}) {
      fiscal_year
      period_date
    }
  }
`

const ProductionSummaryTrends = props => {
  // console.log('ProductionSummaryTrends: ', props)
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR
  const dataSet = (period === DFC.PERIOD_FISCAL_YEAR) ? 'FY ' + year : 'CY ' + year
  const product = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  const state = props.fipsCode
  const key = `${ dataSet }_${ product }_${ state }`

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: state, product: product, period: period }
  })
  const name = props.locationName
  const nativeAmerican = props.fipsCode === DFC.NATIVE_AMERICAN_FIPS
  const location = {
    county: props.county,
    districtType: props.districtType,
    fipsCode: props.fipsCode,
    name: props.name,
    regionType: props.regionType,
    locationName: props.locationName
  }

  let sparkData = []
  let sparkMin
  let sparkMax
  let periodData
  let fiscalData
  let highlightIndex = 0
  let row
  let total = 0

  if (loading) {
    return (
      <Grid container>
        <Typography style={{ fontSize: '.8rem' }}>
        Loading....{' '}
        </Typography>
      </Grid>
    )
  }

  if (error) return `Error! ${ error.message }`
  if (data && data.period) {
    periodData = data.period
    // set min and max trend years
    sparkMin = periodData.reduce((min, p) => p.year < min ? p.year : min, parseInt(periodData[0].period_date.substring(0, 4)))
    sparkMax = periodData.reduce((max, p) => p.year > max ? p.year : max, parseInt(periodData[periodData.length - 1].period_date.substring(0, 4)))
  }
  let unit = ''
  if (
    data &&
    data.production_summary.length > 0
  ) {
    unit = data.production_summary[0].unit_abbr
    fiscalData = data.production_summary.map((item, i) => [
      item.fiscal_year,
      item.sum
    ])
    fiscalData = d3.nest()
      .key(k => k.year)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(data.production_summary)
      .map(d => [parseInt(d.key), d.value])

    // map sparkline data to period fiscal years, if there is no year we set the year and set the sum to 0
    sparkData = periodData.map((item, i) => {
      const y = parseInt(item.period_date.substr(0, 4))
      const total = fiscalData.find(x => x[0] === y)

      return ([
        y,
        total ? total[1] : 0
      ])
    })

    // sparkline index
    highlightIndex = sparkData.findIndex((x, i) => x[0] === parseInt(year))

    total = sparkData[highlightIndex][1]

    return (
      <>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="caption">
              <Box>Trend</Box>
              <Box>({sparkMin} - {sparkMax})</Box>
            </Typography>
            {sparkData.length > 1 &&
              <Box component="span">
                {sparkData && (
                  <Sparkline
                    key={'PST' + key }
                    data={sparkData}
                    highlightIndex={highlightIndex}
                  />
                )}
              </Box>
            }
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Typography variant="caption">
              <Box>{dataSet}</Box>
              <Box>
                {utils.formatToCommaInt(Math.floor(total), 3)} ({unit})
              </Box>
            </Typography>
          </Grid>
        </Grid>
      </>
    )
  }
  else {
    return (
      <>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="caption">
              <Box><LocationName location={location} /> {`${ nativeAmerican ? 'land' : '' } has not produced any ${ product } since ${ sparkMin }.`} </Box>
            </Typography>
          </Grid>
        </Grid>
      </>)
  }
}

export default ProductionSummaryTrends
