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
  query RevenueSummaryTrend($state: String!, $period: String!) {
    revenue_summary(
      where: { location: { _eq: $state }, period: {_eq: $period} }
      order_by: { year: asc, location: asc }
    ) {
      year
      location
      total      
      commodity
    }

    period(where: {period: {_ilike: $period }}) {
      fiscal_year
    }
  }
`

const RevenueSummaryTrends = props => {
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
   const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : 'Fiscal Year'
  const dataSet = (period === 'Fiscal Year') ? 'FY ' + year : 'CY ' + year
  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: props.abbr, period: period }
  })

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

    // set min and max trend years
    sparkMin = periodData.reduce((min, p) => p.year < min ? p.year : min, periodData[0].fiscal_year)
    sparkMax = periodData.reduce((max, p) => p.year > max ? p.year : max, periodData[periodData.length - 1].fiscal_year)
    console.debug("WTH: ", data.revenue_summary)    
    fiscalData = data.revenue_summary.map((item, i) => [
      item.year,
      item.total
    ])

    // map sparkline data to period fiscal years, if there is no year we set the year and set the sum to 0
    sparkData = periodData.map((item, i) => {
      const sum = fiscalData.find(x => x[0] === item.fiscal_year)
      return ([
        item.fiscal_year,
        total ? total[1] : 0
      ])
    })

    // sparkline index
    highlightIndex = sparkData.findIndex(
      x => x[0] === year
    )

    row = data.revenue_summary.length > 1 && data.revenue_summary[data.revenue_summary.findIndex(x => x.year === year)]

    total = row ? row.total : 0

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
              <Box>{year}</Box>
              <Box>
                {utils.formatToSigFig_Dollar(Math.floor(total), 3)}
              </Box>
            </Typography>
          </Grid>
        </Grid>
      </>
    )
  }
  else {
    return 'This location has no revenue.'
  }
}

export default RevenueSummaryTrends
