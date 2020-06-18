import React, { useContext } from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

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
import * as d3 from 'd3'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: 150,
  },
}))

const APOLLO_QUERY = gql`
  query RevenueDetailTrends($state: String!, $commodity: String!, $period: String!, $year: Int!) {
    fiscal_production_summary(
      where: { state_or_area: { _eq: $state }, commodity: {_eq: $commodity}  }
      order_by: { fiscal_year: asc, state_or_area: asc }
    ) {
      fiscal_year
      state_or_area
      sum
    }
    # location total
    locationTotal:fiscal_production_summary(where: {state_or_area: {_eq: $state}, commodity: {_eq: $commodity} , fiscal_year: {_eq: $year}}) {
      fiscal_year
      state_or_area
      sum
    }
    period(where: {period: {_ilike: $period }}) {
      fiscal_year
    }
  }
`

const ProductionDetailTrends = props => {
  const classes = useStyles()
  const name = props.name
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]

  const commodity = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  const stateAbbr = ((props.abbr.length > 2) &&
    (props.abbr !== 'Nationwide Federal' || props.abbr !== 'Native American')) ? props.abbr : props.state

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: stateAbbr, commodity: commodity, period: CONSTANTS.FISCAL_YEAR, year: year }
  })

  if (loading) return ''

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
    
    
    fiscalData = d3.nest()
      .key(k => k.fiscal_year)
      .rollup(v => d3.sum(v, i => i.sum))
      .entries(data.fiscal_production_summary.filter(row => row.state_or_area === stateAbbr)).map(item => [parseInt(item.key), item.value])
    
    /*console.debug ("FD ", fD)
      fiscalData = data.fiscal_production_summary.map((item, i) => [
      item.fiscal_year,
      item.sum
    ]) 
    console.debug ("FisD ", fiscalData)
    */ 
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
    locData = locationTotalData.length > 0 ? locationTotalData.map(item => item.sum).reduce((prev, next) => prev + next) : 0
  }
  if (data && data.fiscal_production_summary && data.fiscal_production_summary.length > 0) {
    return (
      <>
        <Box textAlign="center" className={classes.root} key={props.key}>
          <Box component="h2" mt={0} mb={0}>{utils.formatToCommaInt(locData)}</Box>
          <Box component="span" mb={4}>{year && <span>{dataSet} production</span>}</Box>
          {sparkData.length > 1 && (
            <Box mt={4}>
              <Sparkline
                key={'PDT' + dataSet + '_' + commodity }
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
          <Box>{ name + ' has not produced any ' + commodity + ' since ' + sparkMin + '.'} </Box>
        </Box>
      </>)
  }
}
export default ProductionDetailTrends
