import gql from 'graphql-tag'
import {
  LAND_CATEGORY,
  COMMODITIES,
  LAND_CLASS,
  OFFSHORE_REGIONS,
  US_STATES,
  PERIOD
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
  '$offshoreRegions: [String!],',
  '$usStates: [String!],',
  '$counties: [String!],',
  '$commodities: [String!],',
  '$fiscalYears: [Int!],'
)

const LAND_CATEGORY_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_class: {_eq: $landClass},
      land_category: {_neq: ""},
      offshore_region: {_in: $offshoreRegions},
      state: {_in: $usStates},
      county: {_in: $counties},
      commodity: {_in: $commodities},
      fiscal_year: {_in: $fiscalYears}
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
      offshore_region: {_in: $offshoreRegions},
      state: {_in: $usStates},
      county: {_in: $counties},
      commodity: {_in: $commodities},
      revenue_type: {_eq: $revenueType},
      fiscal_year: {_in: $fiscalYears}
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
      offshore_region: {_in: $offshoreRegions},
      state: {_neq: ""},
      county: {_in: $counties},
      commodity: {_in: $commodities},
      fiscal_year: {_in: $fiscalYears}
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
      state: {_in: $usStates},
      county: {_in: $counties},
      commodity: {_in: $commodities},
      fiscal_year: {_in: $fiscalYears}
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
      offshore_region: {_in: $offshoreRegions},
      state: {_in: $usStates},
      county: {_in: $counties},
      commodity: {_neq: ""},
      fiscal_year: {_in: $fiscalYears}
    },
    distinct_on: commodity,
    order_by: {commodity: asc}
  ) {
    option:commodity
  }`

const PERIOD_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegions},
      state: {_in: $usStates},
      county: {_in: $counties},
      commodity: {_in: $commodities},
      revenue_type: {_eq: $revenueType},
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
  [US_STATES]: gql`query GetUsStateOptionsProduction(${ VARIABLE_LIST }){${ US_STATE_OPTIONS_QUERY }}`,
  [OFFSHORE_REGIONS]: gql`query GetOffshoreRegionOptionsProduction(${ VARIABLE_LIST }){${ OFFSHORE_REGION_OPTIONS_QUERY }}`,
  [COMMODITIES]: gql`query GetCommodityOptionsProduction(${ VARIABLE_LIST }){${ COMMODITY_OPTIONS_QUERY }}`,
  [PERIOD]: gql`query GetPeriodOptionsProduction(${ VARIABLE_LIST }){${ PERIOD_OPTIONS_QUERY }}`
}

export default PRODUCTION_QUERIES
