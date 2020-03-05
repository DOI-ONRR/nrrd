import gql from 'graphql-tag'

export const DATA_TYPE = 'dataType'
export const LAND_CLASS = 'landClass'
export const LAND_CATEGORY = 'landCategory'
export const OFFSHORE_REGION = 'offshoreRegion'
export const OFFSHORE_REGIONS = 'offshoreRegions'
export const US_STATE = 'state'
export const US_STATES = 'usStates'
export const COUNTY = 'county'
export const COUNTIES = 'counties'
export const COMMODITY = 'commodity'
export const COMMODITIES = 'commodities'
export const REVENUE_TYPE = 'revenueType'
export const REVENUE_TYPES = 'revenueTypes'
export const FISCAL_YEAR = 'fiscalYear'
export const FISCAL_YEARS = 'fiscalYears'

export const LAND_CLASS_OPTIONS = 'landClassOptions'
export const LAND_CATEGORY_OPTIONS = 'landCategoryOptions'
export const OFFSHORE_REGION_OPTIONS = 'offshoreRegionOptions'
export const US_STATE_OPTIONS = 'usStateOptions'
export const COUNTY_OPTIONS = 'countyOptions'
export const COMMODITY_OPTIONS = 'commodityOptions'
export const REVENUE_TYPE_OPTIONS = 'revenueTypeOptions'
export const FISCAL_YEAR_OPTIONS = 'fiscalYearOptions'

export const ALL_DATA_FILTER_VARS = state => ({
  variables: {
    [LAND_CLASS]: state[LAND_CLASS],
    [LAND_CATEGORY]: state[LAND_CATEGORY],
    [OFFSHORE_REGIONS]: state[OFFSHORE_REGIONS] && state[OFFSHORE_REGIONS].split(','),
    [US_STATES]: state[US_STATES] && state[US_STATES].split(','),
    [COUNTIES]: state[COUNTIES] && state[COUNTIES].split(','),
    [COMMODITIES]: state[COMMODITIES] && state[COMMODITIES].split(','),
    [REVENUE_TYPE]: state[REVENUE_TYPE],
    [FISCAL_YEARS]: state[FISCAL_YEARS] && state[FISCAL_YEARS].split(',').map(year => parseInt(year)),
  }
})

export const variableListDefined = ''.concat(
  '$landClass: String,',
  '$landCategory: String,',
  '$offshoreRegions: [String!],',
  '$usStates: [String!],',
  '$counties: [String!],',
  '$commodities: [String!],',
  '$revenueType: String,',
  '$fiscalYears: [Int!],'
)

const QUERY_LAND_CLASS_OPTIONS = `
landClassOptions:data_filter_revenue_options(
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
  landClass:land_class
}`
const QUERY_LAND_CATEGORY_OPTIONS = `
landCategoryOptions:data_filter_revenue_options(
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
  landCategory:land_category
}`
const QUERY_OFFSHORE_REGION_OPTIONS = `
offshoreRegionOptions:data_filter_revenue_options(
  where: {
    land_class: {_eq: $landClass},
    land_category: {_eq: $landCategory},
    offshore_region: {_neq: ""},
    state: {_in: $usStates},
    county: {_in: $counties},
    commodity: {_in: $commodities},
    revenue_type: {_eq: $revenueType},
    fiscal_year: {_in: $fiscalYears}
  },
  distinct_on: offshore_region,
  order_by: {offshore_region: asc}
) {
  offshoreRegion:offshore_region
}`
const QUERY_US_STATE_OPTIONS = `
usStateOptions:data_filter_revenue_options(
  where: {
    land_class: {_eq: $landClass},
    land_category: {_eq: $landCategory},
    offshore_region: {_in: $offshoreRegions},
    state: {_neq: ""},
    county: {_in: $counties},
    commodity: {_in: $commodities},
    revenue_type: {_eq: $revenueType},
    fiscal_year: {_in: $fiscalYears}
  },
  distinct_on: state,
  order_by: {state: asc}
) {
  state
}`
const QUERY_REVENUE_TYPE_OPTIONS = `
revenueTypeOptions:data_filter_revenue_options(
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
  revenueType:revenue_type
}`
const QUERY_COMMODITY_OPTIONS = `
commodityOptions:data_filter_revenue_options(
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
  commodity
}`
const QUERY_FISCAL_YEAR_OPTIONS = `
fiscalYearOptions:data_filter_revenue_options(
  where: {
    land_class: {_eq: $landClass},
    land_category: {_eq: $landCategory},
    offshore_region: {_in: $offshoreRegions},
    state: {_in: $usStates},
    county: {_in: $counties},
    commodity: {_in: $commodities},
    revenue_type: {_eq: $revenueType},
    fiscal_year: {_gte: 1900}
  },
  distinct_on: fiscal_year,
  order_by: {fiscal_year: asc}
) {
  fiscalYear:fiscal_year
}`

export const GET_DF_REVENUE_LOCATION_OPTIONS = gql`
query GetDfRevenueLocationOptions(${ variableListDefined })
{
  ${ QUERY_LAND_CLASS_OPTIONS }
  ${ QUERY_LAND_CATEGORY_OPTIONS }
  ${ QUERY_OFFSHORE_REGION_OPTIONS }
  ${ QUERY_US_STATE_OPTIONS }
  ${ QUERY_REVENUE_TYPE_OPTIONS }
  ${ QUERY_COMMODITY_OPTIONS }
  ${ QUERY_FISCAL_YEAR_OPTIONS }
}`

export const GET_DF_REVENUE_LAND_CLASS_OPTIONS = gql`
query GetDfRevenueLandClassOptions(${ variableListDefined })
{
  ${ QUERY_LAND_CLASS_OPTIONS }
}`
export const GET_DF_REVENUE_LAND_CATEGORY_OPTIONS = gql`
query GetDfRevenueLandCategoryOptions(${ variableListDefined })
{
  ${ QUERY_LAND_CATEGORY_OPTIONS }
}`

export const GET_DF_REVENUE_OFFSHORE_REGION_OPTIONS = gql`
query GetDfRevenueLandCategoryOptions(${ variableListDefined })
{
  ${ QUERY_OFFSHORE_REGION_OPTIONS }
}`

export const GET_DF_REVENUE_US_STATES_OPTIONS = gql`
query GetDfRevenueUsStateOptions(${ variableListDefined })
{
  ${ QUERY_US_STATE_OPTIONS }
}`

export const GET_DF_REVENUE_COUNTY_OPTIONS = gql`
query GetDfRevenueCountyOptions(${ variableListDefined })
{
  countyOptions:data_filter_revenue_options(
    where: {
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegions},
      state: {_in: $usStates},
      county: {_neq: ""},
      commodity: {_in: $commodities},
      revenue_type: {_eq: $revenueType},
      fiscal_year: {_in: $fiscalYears}
    },
  ) {
    county
  }
}`

export const GET_DF_REVENUE_COMMODITY_OPTIONS = gql`
query GetDfRevenueLandCategoryOptions(${ variableListDefined })
{
  ${ QUERY_COMMODITY_OPTIONS }
}`

export const GET_DF_REVENUE_REVENUE_TYPE_OPTIONS = gql`
query GetDfRevenueRevenueTypeOptions(${ variableListDefined })
{
  ${ QUERY_REVENUE_TYPE_OPTIONS }
}`

export const GET_DF_REVENUE_FISCAL_YEAR_OPTIONS = gql`
query GetDfRevenueFiscalYearOptions(${ variableListDefined })
{
  ${ QUERY_FISCAL_YEAR_OPTIONS }
}`
