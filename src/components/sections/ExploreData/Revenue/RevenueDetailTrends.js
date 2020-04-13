import React, { useContext } from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'

import CONSTANTS from '../../../../js/constants'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box
} from '@material-ui/core'

import Sparkline from '../../../data-viz/Sparkline'

const useStyles = makeStyles(theme => ({
  boxTopSection: {
    minHeight: 150,
  },
}))

const APOLLO_QUERY = gql`
  query RevenueDetailTrends($state: String!, $period: String!, $year: Int!) {
    fiscal_revenue_summary(
      where: { state_or_area: { _eq: $state } }
      order_by: { fiscal_year: asc, state_or_area: asc }
    ) {
      fiscal_year
      state_or_area
      sum
      distinct_commodities
    }
    # location total
    locationTotal:fiscal_revenue_summary(where: {state_or_area: {_eq: $state}, fiscal_year: {_eq: $year}}) {
      fiscal_year
      state_or_area
      sum
    }
    period(where: {period: {_ilike: $period }}) {
      fiscal_year
    }
  }
`

const RevenueDetailTrends = props => {
  const classes = useStyles()
  const { state } = useContext(StoreContext)
  const year = state.year

  const stateAbbr = ((props.abbr.length > 2) &&
    (props.abbr !== 'Nationwide Federal' || props.abbr !== 'Native American')) ? props.abbr : props.state

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: stateAbbr, period: CONSTANTS.FISCAL_YEAR, year: year }
  })

  const closeCard = item => {
    props.closeCard(props.fips)
  }

  if (loading) return 'Loading...'

  if (error) return `Error! ${ error.message }`

  const dataSet = `FY ${ year }`

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

    locationTotalData = data.locationTotal
    locData = locationTotalData.find(item => item.state_or_area === stateAbbr)
  }

  return (
    <>
      <Box textAlign="center" className={classes.boxTopSection} key={props.key}>
        <Box component="h2" mt={0} mb={0}>{locData && utils.formatToDollarInt(locData.sum)}</Box>
        <Box component="span" mb={4}>{year && <span>{dataSet} revenue</span>}</Box>
        {sparkData.length > 1 && (
          <Box mt={4}>
            <Sparkline
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
