import gql from 'graphql-tag'
import {
  LAND_CATEGORY,
  COMMODITIES,
  LAND_CLASS,
  REVENUE_TYPE,
  US_STATES,
  OFFSHORE_REGIONS,
  PERIOD,
  FISCAL_YEARS,
  CALENDAR_YEARS
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
  '$period: String,',
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
      period: {_eq: $period},
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
      period: {_eq: $period},
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
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYears}
    },
    distinct_on: revenue_type,
    order_by: {revenue_type: asc}
  ) {
    option:revenue_type
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
      revenue_type: {_eq: $revenueType},
      period: {_eq: $period},
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
      revenue_type: {_eq: $revenueType},
      period: {_eq: $period},
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
      revenue_type: {_eq: $revenueType},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYears}
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
      offshore_region: {_in: $offshoreRegions},
      state: {_in: $usStates},
      county: {_in: $counties},
      commodity: {_in: $commodities},
      revenue_type: {_eq: $revenueType},
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
      offshore_region: {_in: $offshoreRegions},
      state: {_in: $usStates},
      county: {_in: $counties},
      commodity: {_in: $commodities},
      revenue_type: {_eq: $revenueType},
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

const REVENUE_QUERIES = {
  [LAND_CATEGORY]: gql`query GetLandCategoryOptionsRevenue(${ VARIABLE_LIST }){${ LAND_CATEGORY_OPTIONS_QUERY }}`,
  [LAND_CLASS]: gql`query GetLandClassOptionsRevenue(${ VARIABLE_LIST }){${ LAND_CLASS_OPTIONS_QUERY }}`,
  [REVENUE_TYPE]: gql`query GetRevenueTypeOptionsRevenue(${ VARIABLE_LIST }){${ REVENUE_TYPE_OPTIONS_QUERY }}`,
  [US_STATES]: gql`query GetUsStateOptionsRevenue(${ VARIABLE_LIST }){${ US_STATE_OPTIONS_QUERY }}`,
  [OFFSHORE_REGIONS]: gql`query GetOffshoreRegionOptionsRevenue(${ VARIABLE_LIST }){${ OFFSHORE_REGION_OPTIONS_QUERY }}`,
  [PERIOD]: gql`query GetPeriodOptionsRevenue(${ VARIABLE_LIST }){${ PERIOD_OPTIONS_QUERY }}`,
  [FISCAL_YEARS]: gql`query GetFiscalYearOptionsRevenue(${ VARIABLE_LIST }){${ FISCAL_YEAR_OPTIONS_QUERY }}`,
  [CALENDAR_YEARS]: gql`query GetCalendarYearOptionsRevenue(${ VARIABLE_LIST }){${ CALENDAR_YEAR_OPTIONS_QUERY }}`,
  [COMMODITIES]: gql`query GetCommodityOptionsRevenue(${ VARIABLE_LIST }){${ COMMODITY_OPTIONS_QUERY }}`
}

export default REVENUE_QUERIES
