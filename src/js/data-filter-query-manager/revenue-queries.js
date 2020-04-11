import gql from 'graphql-tag'
import {
  LAND_CATEGORY,
  COMMODITIES,
  LAND_CLASS,
  REVENUE_TYPE,
  OFFSHORE_REGION,
  REVENUE_TYPES
} from '../../constants'

/**
 * The file contains all queries related to revenue data filters.
 * Please note to alias the option queries with 'options' and 'option' since this is
 * used to retrieve that data for the components
 */

const GRAPHQL_VIEW = 'data_filter_revenue_options'

const VARIABLE_LIST = ''.concat(
  '$landClass: String,',
  '$landCategory: String,',
  '$offshoreRegions: [String!],',
  '$usStates: [String!],',
  '$counties: [String!],',
  '$commodities: [String!],',
  '$revenueType: String,',
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
      revenue_type: {_eq: $revenueType},
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

const REVENUE_TYPE_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegions},
      state: {_in: $usStates},
      county: {_in: $counties},
      commodity: {_in: $commodities},
      revenue_type: {_neq: ""},
      fiscal_year: {_in: $fiscalYears}
    },
    distinct_on: revenue_type,
    order_by: {revenue_type: asc}
  ) {
    option:revenue_type
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
      revenue_type: {_eq: $revenueType},
      fiscal_year: {_in: $fiscalYears}
    },
    distinct_on: commodity,
    order_by: {commodity: asc}
  ) {
    option:commodity
  }`

const REVENUE_QUERIES = {
  [LAND_CATEGORY]: gql`query GetLandCategoryOptionsRevenue(${ VARIABLE_LIST }){${ LAND_CATEGORY_OPTIONS_QUERY }}`,
  [LAND_CLASS]: gql`query GetLandClassOptionsRevenue(${ VARIABLE_LIST }){${ LAND_CLASS_OPTIONS_QUERY }}`,
  [REVENUE_TYPE]: gql`query GetRevenueTypeOptionsRevenue(${ VARIABLE_LIST }){${ REVENUE_TYPE_OPTIONS_QUERY }}`,
  [COMMODITIES]: gql`query GetCommodityOptionsRevenue(${ VARIABLE_LIST }){${ COMMODITY_OPTIONS_QUERY }}`
}

export default REVENUE_QUERIES
