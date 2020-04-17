import gql from 'graphql-tag'
import {
  LAND_CATEGORY,
  LAND_CLASS,
  OFFSHORE_REGION,
  US_STATE,
  PERIOD,
  FISCAL_YEAR,
  CALENDAR_YEAR,
  COMMODITY
} from '../../constants'

/**
 * The file contains all queries related to revenue data filters.
 * Please note to alias the option queries with 'options' and 'option' since this is
 * used to retrieve that data for the components
 */

const GRAPHQL_VIEW = 'data_filter_production_options'

const VARIABLE_LIST = ''.concat(
  '$landClass: String,',
  '$landCategory: String,',
  '$offshoreRegion: [String!],',
  '$usState: [String!],',
  '$county: [String!],',
  '$commodity: [String!],',
  '$fiscalYear: [Int!],'
)

const LAND_CATEGORY_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_class: {_eq: $landClass},
      land_category: {_neq: ""},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $usState},
      county: {_in: $county},
      commodity: {_in: $commodity},
      fiscal_year: {_in: $fiscalYear}
    },
    distinct_on: land_category,
    order_by: {land_category: asc}
  ) {
    option:land_category
  }`

const LAND_CLASS_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_class: {_neq: ""},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $usState},
      county: {_in: $county},
      commodity: {_in: $commodity},
      fiscal_year: {_in: $fiscalYear}
    },
    distinct_on: land_class,
    order_by: {land_class: asc}
  ) {
    option:land_class
  }`

const US_STATE_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_neq: ""},
      county: {_in: $county},
      commodity: {_in: $commodity},
      fiscal_year: {_in: $fiscalYear}
    },
    distinct_on: state,
    order_by: {state: asc}
  ) {
    option:state
  }`

const OFFSHORE_REGION_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_neq: ""},
      state: {_in: $usState},
      county: {_in: $county},
      commodity: {_in: $commodity},
      fiscal_year: {_in: $fiscalYear}
    },
    distinct_on: offshore_region,
    order_by: {offshore_region: asc}
  ) {
    option:offshore_region
  }`

const COMMODITY_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $usState},
      county: {_in: $county},
      commodity: {_neq: ""},
      fiscal_year: {_in: $fiscalYear}
    },
    distinct_on: commodity,
    order_by: {commodity: asc}
  ) {
    option:commodity
  }`

const FISCAL_YEAR_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $usState},
      county: {_in: $county},
      commodity: {_in: $commodity},
      period: {_eq: $period},
      fiscal_year: {_neq: 0}
    },
    distinct_on: fiscal_year,
    order_by: {fiscal_year: asc}
  ) {
    option:fiscal_year
  }`

const CALENDAR_YEAR_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $usState},
      county: {_in: $county},
      commodity: {_in: $commodity},
      period: {_eq: $period},
      calendar_year: {_neq: 0}
    },
    distinct_on: calendar_year,
    order_by: {calendar_year: asc}
  ) {
    option:calendar_year
  }`

const PERIOD_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $usState},
      county: {_in: $county},
      commodity: {_in: $commodity},
      period: {_neq: "Monthly"}
    },
    distinct_on: period,
    order_by: {period: asc}
  ) {
    option:period
  }`

const PRODUCTION_QUERIES = {
  [LAND_CATEGORY]: gql`query GetLandCategoryOptionsProduction(${ VARIABLE_LIST }){${ LAND_CATEGORY_OPTIONS_QUERY }}`,
  [LAND_CLASS]: gql`query GetLandClassOptionsProduction(${ VARIABLE_LIST }){${ LAND_CLASS_OPTIONS_QUERY }}`,
  [US_STATE]: gql`query GetUsStateOptionsProduction(${ VARIABLE_LIST }){${ US_STATE_OPTIONS_QUERY }}`,
  [OFFSHORE_REGION]: gql`query GetOffshoreRegionOptionsProduction(${ VARIABLE_LIST }){${ OFFSHORE_REGION_OPTIONS_QUERY }}`,
  [COMMODITY]: gql`query GetCommodityOptionsProduction(${ VARIABLE_LIST }){${ COMMODITY_OPTIONS_QUERY }}`,
  [FISCAL_YEAR]: gql`query GetFiscalYearOptionsProduction(${ VARIABLE_LIST }){${ FISCAL_YEAR_OPTIONS_QUERY }}`,
  [CALENDAR_YEAR]: gql`query GetCalendarYearOptionsProduction(${ VARIABLE_LIST }){${ CALENDAR_YEAR_OPTIONS_QUERY }}`,
  [PERIOD]: gql`query GetPeriodOptionsProduction(${ VARIABLE_LIST }){${ PERIOD_OPTIONS_QUERY }}`
}

export default PRODUCTION_QUERIES
