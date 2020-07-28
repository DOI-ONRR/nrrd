import React, { useContext } from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import utils from '../../../../js/utils'
// import { StoreContext } from '../../../../store'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

// import CONSTANTS from '../../../../js/constants'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box
} from '@material-ui/core'

import Sparkline from '../../../data-viz/Sparkline'
import * as d3 from 'd3'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: 150,
  },
}))

const APOLLO_QUERY = gql`
  query ProductionDetailTrends($state: String!, $product: String!, $period: String!, $year: Int!) {
    production_summary(
      where: { location: { _eq: $state }, product: {_eq: $product}, period: {_eq: $period}  }
      order_by: { year: asc, location: asc }
    ) {
      year
      location
      unit_abbr
      total
    }
    # location total
    locationTotal: production_summary(where: {location: {_eq: $state}, product: {_eq: $product} , year: {_eq: $year}, period: {_eq: $period} }) {
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

const ProductionDetailTrends = props => {
  const classes = useStyles()
  const name = props.name
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR
  const product = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  const state = props.fipsCode

  console.log('ProductionDetailTrends state, product, period, year: ', state, product, period, year)

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: state, product: product, period: period, year: year }
  })

  if (loading) return ''

  if (error) return `Error! ${ error.message }`

  const dataSet = (period === DFC.PERIOD_FISCAL_YEAR) ? `FY ${ year }` : `CY ${ year }`

  let sparkData = []
  let sparkMin
  let sparkMax
  let highlightIndex = 0
  let periodData
  let fiscalData
  let locationTotalData
  let locData
  let unit = ''
  if (data && data.production_summary.length > 0) {
    periodData = data.period
    // set min and max trend years
    sparkMin = periodData.reduce((min, p) => p.year < min ? p.year : min, parseInt(periodData[0].period_date.substring(0, 4)))
    sparkMax = periodData.reduce((max, p) => p.year > max ? p.year : max, parseInt(periodData[periodData.length - 1].period_date.substring(0, 4)))
    unit = data.production_summary[0].unit_abbr

    fiscalData = d3.nest()
      .key(k => k.year)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(data.production_summary)
      .map(d => [parseInt(d.key), d.value])

    /* console.debug ("FD ", fD)
      fiscalData = data.fiscal_production_summary.map((item, i) => [
      item.fiscal_year,
      item.sum
    ])
    console.debug ("FisD ", fiscalData)
    */
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
    highlightIndex = sparkData.findIndex(
      x => x[0] === year
    )

    locationTotalData = data.locationTotal
    locData = locationTotalData.length > 0 ? locationTotalData.map(item => item.total).reduce((prev, next) => prev + next) : 0
  }
  if (data && data.production_summary && data.production_summary.length > 0) {
    return (
      <>
        <Box textAlign="center" className={classes.root} key={props.key}>
          <Box component="h2" mt={0} mb={0} style={{ whiteSpace: 'nowrap' }} >{utils.formatToCommaInt(locData) + ' ' + unit}</Box>
          <Box component="span" mb={4}>{year && <span>{dataSet} production</span>}</Box>
          {sparkData.length > 1 && (
            <Box mt={4}>
              <Sparkline
                key={'PDT' + dataSet + '_' + product }
                data={sparkData}
                highlightIndex={highlightIndex}
              />
              Production trend ({sparkMin} - {sparkMax})
            </Box>
          )}
        </Box>
      </>
    )
  }
  else {
    return (
      <>
        <Box textAlign="center" className={classes.root} key={props.key}>
          <Box>{`${ name } has not produced any ${ product } since ${ sparkMin || 2003 }.`}</Box>
        </Box>
      </>)
  }
}
export default ProductionDetailTrends
