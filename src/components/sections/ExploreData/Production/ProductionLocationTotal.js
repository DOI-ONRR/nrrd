import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useQuery, gql } from 'urql'

import utils from '../../../../js/utils'
import * as d3 from 'd3'
import { useInView } from 'react-intersection-observer'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

const LOCATION_TOTAL_QUERY = gql`
  query NationwideFederal($location: [String!], $year: Int!, $period: String!, $product: String!) {
    production_summary(where: {
      year: {_eq: $year},
      location: {_in: $location},
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
      location
    }
  }
`

const ProductionLocationTotal = props => {
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR
  const product = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true
  })
  
  const [result, _reexecuteQuery] = useQuery({
    query: LOCATION_TOTAL_QUERY,
    variables: { 
      location: [DFC.NATIONWIDE_FEDERAL_FIPS, DFC.NATIVE_AMERICAN_FIPS], 
      year: year, 
      period: period, 
      product: product 
    },
    pause: inView === false,
  });

  const { data, fetching, error } = result;

  if (fetching) return ''
  if (error) return `Error loading revenue data table ${ error.message }`
  let nationwideSummary = []
  let nativeSummary = []
  const productName = product

  if (data) {
    const groupedLocationData = utils.groupBy(data.production_summary, 'location')

    if (groupedLocationData[DFC.NATIONWIDE_FEDERAL_FIPS] && groupedLocationData[DFC.NATIONWIDE_FEDERAL_FIPS].length > 0) {
      nationwideSummary = d3.nest()
        .key(k => k.location)
        .rollup(v => d3.sum(v, i => i.total))
        .entries(groupedLocationData[DFC.NATIONWIDE_FEDERAL_FIPS])
        .map(d => {
          return ({ location: d.key, total: d.value })
        })
    }
    else {
      nationwideSummary = [{ location: DFC.NATIONWIDE_FEDERAL_FIPS, total: 0 }]
    }

    if (groupedLocationData[DFC.NATIVE_AMERICAN_FIPS] && groupedLocationData[DFC.NATIVE_AMERICAN_FIPS].length > 0) {
      nativeSummary = d3.nest()
        .key(k => k.location)
        .rollup(v => d3.sum(v, i => i.total))
        .entries(groupedLocationData[DFC.NATIVE_AMERICAN_FIPS])
        .map(d => {
          return ({ location: d.key, total: d.value })
        })
    }
    else {
      nativeSummary.total = [{ location: DFC.NATIVE_AMERICAN_FIPS, total: 0 }]
    }

    const unit = groupedLocationData[DFC.NATIONWIDE_FEDERAL_FIPS] ? groupedLocationData[DFC.NATIONWIDE_FEDERAL_FIPS][0].unit_abbr : 'units'
    const product = groupedLocationData[DFC.NATIONWIDE_FEDERAL_FIPS] ? groupedLocationData[DFC.NATIONWIDE_FEDERAL_FIPS][0].commodity : productName
    const nativeTotal = nativeSummary.length > 0 ? nativeSummary[0].total : 0

    return (
      <div ref={ref}>
        The Office of Natural Resources Revenue (ONRR) collects detailed data about the volume of mineral and energy commodities companies
        produce from federal and Native American lands and waters. <strong>For {period.toLowerCase()} {year}, companies reported to ONRR
        that they produced {utils.formatToCommaInt(nationwideSummary[0].total)} {unit} of {product.toLowerCase()} from federal sources and
        {` ${ utils.formatToCommaInt(nativeTotal) }`} {unit} of {product.toLowerCase()} from Native American sources for a total of
        {` ${ utils.formatToCommaInt(nationwideSummary[0].total + nativeTotal) }`} {unit} of {product.toLowerCase()}.</strong>
      </div>
    )
  }
  else {
    return (
	  <div ref={ref}>
	  </div>

    )
  }
}

export default ProductionLocationTotal

ProductionLocationTotal.propTypes = {
  location: PropTypes.array
}
