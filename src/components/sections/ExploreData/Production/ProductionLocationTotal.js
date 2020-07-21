import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import utils from '../../../../js/utils'
import * as d3 from 'd3'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'
import CONSTANTS from '../../../../js/constants'

const LOCATION_TOTAL_QUERY = gql`
  query NationwideFederal($location: [String!], $year: Int!, $period: String!, $product: String!) {
    production_summary(where: {
      year: {_eq: $year},
      location_name: {_in: $location},
      period: {_eq: $period},
      product: {_eq: $product}
      }) {
      location_name
      period
      total
      unit_abbr
      year
      commodity
      product
    }
  }
`

const ProductionLocationTotal = props => {
  const { location } = props
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR
  const product = filterState[DFC.COMMODITY]

  console.log('ProductionLocationTotal queryVars: ', location, year, period, product)

  const { loading, error, data } = useQuery(LOCATION_TOTAL_QUERY, {
    variables: { location: [CONSTANTS.NATIONWIDE_FEDERAL, CONSTANTS.NATIVE_AMERICAN], year: year, period: period, product: product }
  })

  if (loading) return ''
  if (error) return `Error loading revenue data table ${ error.message }`
  let nationwideSummary = []
  let nativeSummary = []

  if (data) {
    // console.log('ProductionLocationTotal data: ', data)
    const groupedLocationData = utils.groupBy(data.production_summary, 'location_name')

    nationwideSummary = d3.nest()
      .key(k => k.location_name)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(groupedLocationData[CONSTANTS.NATIONWIDE_FEDERAL])
      .map(d => {
        return ({ location_name: d.key, total: d.value })
      })

    if (groupedLocationData[CONSTANTS.NATIVE_AMERICAN]) {
      nativeSummary = d3.nest()
        .key(k => k.location_name)
        .rollup(v => d3.sum(v, i => i.total))
        .entries(groupedLocationData[CONSTANTS.NATIVE_AMERICAN])
        .map(d => {
          console.log('d: ', d)
          return ({ location_name: d.key, total: d.value })
        })
    }

    const unit = groupedLocationData[CONSTANTS.NATIONWIDE_FEDERAL][0].unit_abbr
    const product = groupedLocationData[CONSTANTS.NATIONWIDE_FEDERAL][0].commodity
    const nativeTotal = nativeSummary.length > 0 ? nativeSummary[0].total : 0

    return (
      <>
        The Office of Natural Resources Revenue (ONRR) collects detailed data about the volume of mineral and energy commodities companies produce from federal and Native American lands and waters. <strong>For {period.toLowerCase()} {year}, companies reported to ONRR that they produced {utils.formatToCommaInt(nationwideSummary[0].total)} {unit} of {product.toLowerCase()} from federal sources and {utils.formatToCommaInt(nativeTotal)} {unit} of {product.toLowerCase()} from Native American sources for a total of {utils.formatToCommaInt(nationwideSummary[0].total + nativeTotal)} {unit} of {product}.</strong>
      </>
    )
  }
}

export default ProductionLocationTotal

ProductionLocationTotal.propTypes = {
  location: PropTypes.array
}
