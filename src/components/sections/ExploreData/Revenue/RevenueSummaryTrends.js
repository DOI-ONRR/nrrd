import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

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
    fiscal_revenue_summary(
      where: { state_or_area: { _eq: $state } }
      order_by: { fiscal_year: asc, state_or_area: asc }
    ) {
      fiscal_year
      state_or_area
      sum
      distinct_commodities
    }

    period(where: {period: {_ilike: $period }}) {
      fiscal_year
    }
  }
`

const RevenueSummaryTrends = props => {
  console.log('RevenueSummaryTrends props: ', props)
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const dataSet = 'FY ' + year

  const state = (props.fipsCode === '99' || props.fipsCode === '999') ? props.name : props.fipsCode

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: state, period: CONSTANTS.FISCAL_YEAR }
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
    data.fiscal_revenue_summary.length > 0
  ) {
    periodData = data.period

    // set min and max trend years
    sparkMin = periodData.reduce((min, p) => p.fiscal_year < min ? p.fiscal_year : min, periodData[0].fiscal_year)
    sparkMax = periodData.reduce((max, p) => p.fiscal_year > max ? p.fiscal_year : max, periodData[periodData.length - 1].fiscal_year)

    fiscalData = data.fiscal_revenue_summary.map((item, i) => [
      item.fiscal_year,
      item.sum
    ])

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

    row = data.fiscal_revenue_summary.length > 1 && data.fiscal_revenue_summary[data.fiscal_revenue_summary.findIndex(x => x.fiscal_year === year)]

    total = row ? row.sum : 0

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
