import React, { useContext } from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import * as d3 from 'd3'

import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import CONSTANTS from '../../../../js/constants'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box
} from '@material-ui/core'

import Sparkline from '../../../data-viz/Sparkline'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: 150,
  },
}))

const APOLLO_QUERY = gql`
  query RevenueDetailTrends($state: String!, $period: String!, $year: Int!) {
    revenue_summary(
      where: { location: { _eq: $state }, period: {_eq: $period} },
      order_by: { year: asc, location: asc }
    ) {
      year
      location
      total
      commodity
    }
    period(where: {period: {_ilike: $period }}) {
      fiscal_year
      period_date
    }
  }
`

const RevenueDetailTrends = props => {
  const classes = useStyles()
  const { state: filterState } = useContext(DataFilterContext)
  const year = parseInt(filterState[DFC.YEAR])
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR
  const state = props.fipsCode

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: state, period: CONSTANTS.FISCAL_YEAR, year: year }
  })

  const closeCard = item => {
    props.closeCard(props.fips_code)
  }

  if (loading) return ''

  if (error) return `Error! ${ error.message }`

  const dataSet = (period === 'Fiscal Year') ? `FY ${ year }` : `CY ${ year }`
  const dataKey = dataSet + '-' + state
  let sparkData = []
  let sparkMin
  let sparkMax
  let highlightIndex = 0
  let periodData
  let fiscalData
  let locationTotalData
  let locData

  if (data) {
    periodData = data.period

    // set min and max trend years
    sparkMin = periodData.reduce((min, p) => parseInt(periodData[0].period_date.substring(0, 4)) < min ? parseInt(periodData[0].period_date.substring(0, 4)) : min, parseInt(periodData[0].period_date.substring(0, 4)))
    sparkMax = periodData.reduce((max, p) => parseInt(periodData[0].period_date.substring(0, 4)) > max ? parseInt(periodData[0].period_date.substring(0, 4)) : max, parseInt(periodData[periodData.length - 1].period_date.substring(0, 4)))

    console.debug('sparkMin', sparkMin, periodData)
    fiscalData = d3.nest()
      .key(k => k.year)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(data.revenue_summary)
      .map(d => [parseInt(d.key), d.value])

    // map sparkline data to period fiscal years, if there is no year we set the year and set the sum to 0
    sparkData = periodData.map((item, i) => {
      const y = parseInt(item.period_date.substr(0, 4))
      const sum = fiscalData.find(x => x[0] === y)
      return ([
        y,
        sum ? sum[1] : 0
      ])
    })

    console.log('sparkData: ', sparkData)

    // sparkline index
    highlightIndex = sparkData.findIndex(
      x => x[0] === year
    )
    locData = sparkData[highlightIndex][1]
  }

  return (
    <>
      <Box textAlign="center" className={classes.root} key={props.key}>
        <Box component="h2" mt={0} mb={0}>{utils.formatToDollarInt(locData)}</Box>
        <Box component="span" mb={4}>{year && <span>{dataSet} revenue</span>}</Box>
        {sparkData.length > 1 && (
          <Box mt={4}>
            <Sparkline
              key={'RDT' + dataKey}
              data={sparkData}
              highlightIndex={highlightIndex}
            />
            Revenue trend ({sparkMin} - {sparkMax})
          </Box>
        )}
      </Box>
    </>
  )
}

export default RevenueDetailTrends
