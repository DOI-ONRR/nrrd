import gql from 'graphql-tag'
import {
  LAND_TYPE,
  LAND_CATEGORY,
  COMMODITY,
  LAND_CLASS,
  REVENUE_TYPE,
  US_STATE,
  OFFSHORE_REGION,
  PERIOD,
  FISCAL_YEAR,
  CALENDAR_YEAR,
  COUNTY
} from '../../constants'

/**
 * The file contains all queries related to revenue data filters.
 * Please note to alias the option queries with 'options' and 'option' since this is
 * used to retrieve that data for the components
 */

const GRAPHQL_VIEW = 'data_filter_revenue_options'

const VARIABLE_LIST = ''.concat(
  '$landType: [String!],',
  '$landClass: String,',
  '$landCategory: String,',
  '$offshoreRegion: [String!],',
  '$state: [String!],',
  '$county: [String!],',
  '$commodity: [String!],',
  '$revenueType: [String!],',
  '$period: String,',
  '$fiscalYear: [Int!],',
  '$calendarYear: [Int!],'
)

const LAND_TYPE_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_type: {_neq: ""},
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $state},
      county: {_in: $county},
      commodity: {_in: $commodity},
      revenue_type: {_in: $revenueType},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear}
    },
    distinct_on: land_type,
    order_by: {land_type: asc}
  ) {
    option:land_type
  }`

const LAND_CATEGORY_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_type: {_in: $landType},
      land_class: {_eq: $landClass},
      land_category: {_neq: ""},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $state},
      county: {_in: $county},
      commodity: {_in: $commodity},
      revenue_type: {_in: $revenueType},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear}
    },
    distinct_on: land_category,
    order_by: {land_category: asc}
  ) {
    option:land_category
  }`

const LAND_CLASS_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_type: {_in: $landType},
      land_class: {_neq: ""},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $state},
      county: {_in: $county},
      commodity: {_in: $commodity},
      revenue_type: {_in: $revenueType},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear}
    },
    distinct_on: land_class,
    order_by: {land_class: asc}
  ) {
    option:land_class
  }`

const REVENUE_TYPE_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_type: {_in: $landType},
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $state},
      county: {_in: $county},
      commodity: {_in: $commodity},
      revenue_type: {_neq: ""},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear}
    },
    distinct_on: revenue_type,
    order_by: {revenue_type: asc}
  ) {
    option:revenue_type
  }`

const US_STATE_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_type: {_in: $landType},
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_neq: ""},
      county: {_in: $county},
      commodity: {_in: $commodity},
      revenue_type: {_in: $revenueType},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear}
    },
    distinct_on: state,
    order_by: {state: asc}
  ) {
    option:state
  }`

const COUNTY_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_type: {_in: $landType},
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $state},
      county: {_neq: ""},
      commodity: {_in: $commodity},
      revenue_type: {_in: $revenueType},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear}
    },
    distinct_on: county,
    order_by: {county: asc}
  ) {
    value:county
    option:county
  }`

const OFFSHORE_REGION_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_type: {_in: $landType},
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_neq: ""},
      state: {_in: $state},
      county: {_in: $county},
      commodity: {_in: $commodity},
      revenue_type: {_in: $revenueType},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear}
    },
    distinct_on: offshore_region,
    order_by: {offshore_region: asc}
  ) {
    option:offshore_region
  }`

const COMMODITY_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_type: {_in: $landType},
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $state},
      county: {_in: $county},
      commodity: {_neq: ""},
      revenue_type: {_in: $revenueType},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear}
    },
    distinct_on: commodity_order,
    order_by: {commodity_order: asc}
  ) {
    option:commodity
  }`

const FISCAL_YEAR_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      land_type: {_in: $landType},
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $state},
      county: {_in: $county},
      commodity: {_in: $commodity},
      revenue_type: {_in: $revenueType},
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
      land_type: {_in: $landType},
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $state},
      county: {_in: $county},
      commodity: {_in: $commodity},
      revenue_type: {_in: $revenueType},
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
      land_type: {_in: $landType},
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $state},
      county: {_in: $county},
      commodity: {_in: $commodity},
      revenue_type: {_in: $revenueType}
    },
    distinct_on: period,
    order_by: {period: asc}
  ) {
    option:period
  }`

const REVENUE_QUERIES = {
  [LAND_TYPE]: gql`query GetLandTypeOptionsRevenue(${ VARIABLE_LIST }){${ LAND_TYPE_OPTIONS_QUERY }}`,
  [LAND_CATEGORY]: gql`query GetLandCategoryOptionsRevenue(${ VARIABLE_LIST }){${ LAND_CATEGORY_OPTIONS_QUERY }}`,
  [LAND_CLASS]: gql`query GetLandClassOptionsRevenue(${ VARIABLE_LIST }){${ LAND_CLASS_OPTIONS_QUERY }}`,
  [REVENUE_TYPE]: gql`query GetRevenueTypeOptionsRevenue(${ VARIABLE_LIST }){${ REVENUE_TYPE_OPTIONS_QUERY }}`,
  [US_STATE]: gql`query GetUsStateOptionsRevenue(${ VARIABLE_LIST }){${ US_STATE_OPTIONS_QUERY }}`,
  [OFFSHORE_REGION]: gql`query GetOffshoreRegionOptionsRevenue(${ VARIABLE_LIST }){${ OFFSHORE_REGION_OPTIONS_QUERY }}`,
  [PERIOD]: gql`query GetPeriodOptionsRevenue(${ VARIABLE_LIST }){${ PERIOD_OPTIONS_QUERY }}`,
  [FISCAL_YEAR]: gql`query GetFiscalYearOptionsRevenue(${ VARIABLE_LIST }){${ FISCAL_YEAR_OPTIONS_QUERY }}`,
  [CALENDAR_YEAR]: gql`query GetCalendarYearOptionsRevenue(${ VARIABLE_LIST }){${ CALENDAR_YEAR_OPTIONS_QUERY }}`,
  [COMMODITY]: gql`query GetCommodityOptionsRevenue(${ VARIABLE_LIST }){${ COMMODITY_OPTIONS_QUERY }}`,
  [COUNTY]: gql`query GetCountyOptionsRevenue(${ VARIABLE_LIST }){${ COUNTY_OPTIONS_QUERY }}`,
}

export default REVENUE_QUERIES
