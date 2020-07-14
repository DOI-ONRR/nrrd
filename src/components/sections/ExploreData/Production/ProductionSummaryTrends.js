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

import { StoreContext } from '../../../../store'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import utils from '../../../../js/utils'
import CONSTANTS from '../../../../js/constants'

const APOLLO_QUERY = gql`
  query ProductionSummaryTrend($state: String!, $commodity: String!, $period: String!) {
    fiscal_production_summary(
      where: { state_or_area: { _eq: $state }, commodity: {_eq: $commodity} }
      order_by: { fiscal_year: asc, state_or_area: asc }
    ) {
      fiscal_year
      state_or_area
      unit_abbr
      sum
    
    }

    period(where: {period: {_ilike: $period }}) {
      fiscal_year
    }
  }
`

const ProductionSummaryTrends = props => {
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const dataSet = 'FY ' + year
  const commodity = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  const state = props.abbr
  const key = dataSet + '_' + commodity + '_' + state

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: props.abbr, commodity: commodity, period: CONSTANTS.FISCAL_YEAR }
  })
  const name = props.name
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
    sparkMin = periodData.reduce((min, p) => p.fiscal_year < min ? p.fiscal_year : min, periodData[0].fiscal_year)
    sparkMax = periodData.reduce((max, p) => p.fiscal_year > max ? p.fiscal_year : max, periodData[periodData.length - 1].fiscal_year)

  }
  let unit=''
  if (
    data &&
    data.fiscal_production_summary.length > 0
  ) {
    unit = data.fiscal_production_summary[0].unit_abbr
    fiscalData = data.fiscal_production_summary.map((item, i) => [
      item.fiscal_year,
      item.sum
    ])
    fiscalData = d3.nest()
      .key(k => k.fiscal_year)
      .rollup(v => d3.sum(v, i => i.sum))
      .entries(data.fiscal_production_summary.filter(row => row.state_or_area === state)).map(item => [parseInt(item.key), item.value])
    // map sparkline data to period fiscal years, if there is no year we set the year and set the sum to 0
    sparkData = periodData.map((item, i) => {
      const sum = fiscalData.find(x => x[0] === item.fiscal_year)
      return ([
        item.fiscal_year,
        sum ? sum[1] : 0
      ])
    })
    // sparkline index
    highlightIndex = sparkData.findIndex(
      x => x[0] === year
    )

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
                {sparkData  && (
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
              <Box>{year}</Box>
        <Box style={{whiteSpace: 'nowrap'}}>
        {utils.formatToCommaInt(Math.floor(total), 3) + ' ' + unit }
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
          <Grid item xs={6}>
            <Typography variant="caption">
              <Box>{ name + ' has not produced any ' + commodity + ' since ' + sparkMin + '.'} </Box>
            </Typography>
          </Grid>
        </Grid>
      </>)
  }
}

export default ProductionSummaryTrends
