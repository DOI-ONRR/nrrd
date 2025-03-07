import React, { useContext } from 'react'
import { useQuery, gql } from '@apollo/client'
import * as d3 from 'd3'

import {
  Box,
  Grid,
  Typography
} from '@material-ui/core'

import Sparkline from '../../../data-viz/Sparkline'
import LocationName from '../LocationName'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import utils from '../../../../js/utils'

const QUERY = gql`
  query RevenueSummaryTrend($state: String!, $period: String!, $commodities: [String!]) {
    revenue_summary(
      where: { location: { _eq: $state }, period: {_eq: $period}, commodity: {_in: $commodities} },
      order_by: { year: asc, location: asc }
    ) {
      year
      location
      total      
      commodity
    }
    period(where: {period: {_ilike: $period }}, order_by: { period_date: asc } ) {
      fiscal_year
      period_date
    }
  }
`

const RevenueSummaryTrends = props => {
  // console.log('RevenueSummaryTrends props: ', props)
  const { state: filterState } = useContext(DataFilterContext)
  const {
    year,
    periodAllYears
  } = filterState
  const minYear = periodAllYears[0]
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : 'Fiscal Year'
  const state = props.fipsCode
  const dataSet = (period === 'Fiscal Year') ? 'FY ' + year : 'CY ' + year

  const commodities = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY].split(',') : undefined
  let commodityText = 'revenue'
  if (commodities && commodities.length === 1) {
    commodityText = commodities[0].toLowerCase() + ' revenue'
  }
  else if (commodities && commodities.length > 1) {
    commodityText = 'revenue from the selected commodities'
  }

  const { data, loading, error } = useQuery(QUERY, {
    variables: { 
      state: state, 
      period: period, 
      commodities: commodities
    },
  });

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

  if (
    data &&
    data.revenue_summary.length > 0
  ) {
    periodData = data.period
    // console.debug('PERIODDATA', periodData)
    // set min and max trend years
    sparkMin = periodData.reduce((min, p) => p.year < min ? p.year : min, parseInt(periodData[0].period_date.substring(0, 4)))
    sparkMax = periodData.reduce((max, p) => p.year > max ? p.year : max, parseInt(periodData[periodData.length - 1].period_date.substring(0, 4)))
    // console.debug('WTH: ', data.revenue_summary)
    fiscalData = d3.nest()
      .key(k => k.year)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(data.revenue_summary)
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
    // console.debug('wth: ', fiscalData, sparkData)
    // sparkline index
    highlightIndex = sparkData.findIndex(
      x => x[0] === parseInt(year)
    )

    row = fiscalData.length > 0 && fiscalData[fiscalData.findIndex(x => x[0] === parseInt(year))]
    total = row ? row[1] : 0

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
                    key={'RST' + dataSet }
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
                {utils.formatToDollarInt(total)}
              </Box>
            </Typography>
          </Grid>
        </Grid>
      </>
    )
  }
  else {
    return (<span><LocationName location={location} /> did not have {commodityText} from { minYear } to { year }.</span>)
  }
}

export default RevenueSummaryTrends
