
import {
  REVENUE,
  PRODUCTION,
  DISBURSEMENTS,
  LAND_CLASS,
  LAND_CATEGORY,
  OFFSHORE_REGION,
  US_STATE,
  COUNTY,
  COMMODITY,
  REVENUE_TYPE,
  PERIOD,
  ZERO_OPTIONS
} from '../../constants'
import gql from 'graphql-tag'

const allRevenueYears = `
y2020
y2019
y2018
y2017
y2016
y2015
y2014
y2013
y2012
y2011
y2010
y2009
y2008
y2007
y2006
y2005
y2004
y2003`

/**
 * This object provides various methods for quering the data filters
 */
const DataTableQueryManager = {
  getQuery: state => {
    const query = QUERIES[state.dataType]
    if (query === undefined) {
      throw new Error(`For data type: '${ state.dataType }', no query was found.`)
    }
    return query
  },
  getVariables: state => {
    const vars = VARIABLES[state.dataType](state)
    if (vars === undefined) {
      throw new Error(`For data type: '${ state.dataType }' no variables were found.`)
    }
    return vars
  }
}

export default DataTableQueryManager

/**
 * Set the variable filters for the query based on the state.
 * The state comes from the DataFilterProvider
 */
const VARIABLES = {
  [REVENUE]: state => ({
    variables: {
      [LAND_CLASS]: (state[LAND_CLASS] === ZERO_OPTIONS) ? undefined : state[LAND_CLASS],
      [LAND_CATEGORY]: (state[LAND_CATEGORY] === ZERO_OPTIONS) ? undefined : state[LAND_CATEGORY],
      [OFFSHORE_REGION]: (state[OFFSHORE_REGION] === ZERO_OPTIONS || !state[OFFSHORE_REGION]) ? undefined : state[OFFSHORE_REGION].split(','),
      [US_STATE]: (state[US_STATE] === ZERO_OPTIONS || !state[US_STATE]) ? undefined : state[US_STATE].split(','),
      [COUNTY]: (state[COUNTY] === ZERO_OPTIONS || !state[COUNTY]) ? undefined : state[COUNTY].split(','),
      [COMMODITY]: (state[COMMODITY] === ZERO_OPTIONS || !state[COMMODITY]) ? undefined : state[COMMODITY].split(','),
      [REVENUE_TYPE]: (state[REVENUE_TYPE] === ZERO_OPTIONS || !state[REVENUE_TYPE]) ? undefined : state[REVENUE_TYPE].split(','),
      [PERIOD]: (state[PERIOD] === ZERO_OPTIONS) ? undefined : state[PERIOD],
    }
  }),
  [PRODUCTION]: state => ({
    variables: {
      [LAND_CLASS]: (state[LAND_CLASS] === ZERO_OPTIONS) ? undefined : state[LAND_CLASS],
      [LAND_CATEGORY]: (state[LAND_CATEGORY] === ZERO_OPTIONS) ? undefined : state[LAND_CATEGORY],
      [OFFSHORE_REGION]: (state[OFFSHORE_REGION] === ZERO_OPTIONS || !state[OFFSHORE_REGION]) ? undefined : state[OFFSHORE_REGION].split(','),
      [US_STATE]: (state[US_STATE] === ZERO_OPTIONS || !state[US_STATE]) ? undefined : state[US_STATE].split(','),
      [COUNTY]: (state[COUNTY] === ZERO_OPTIONS || !state[COUNTY]) ? undefined : state[COUNTY].split(','),
      [COMMODITY]: (state[COMMODITY] === ZERO_OPTIONS || !state[COMMODITY]) ? undefined : state[COMMODITY].split(','),
      [PERIOD]: (state[PERIOD] === ZERO_OPTIONS) ? undefined : state[PERIOD],
    }
  })
}

const VARIABLE_LIST_REVENUE = ''.concat(
  '$landClass: String,',
  '$landCategory: String,',
  '$offshoreRegion: [String!],',
  '$usState: [String!],',
  '$county: [String!],',
  '$commodity: [String!],',
  '$revenueType: [String!],',
  '$period: String,'
)
const VARIABLE_LIST_PRODUCTION = ''.concat(
  '$landClass: String,',
  '$landCategory: String,',
  '$offshoreRegion: [String!],',
  '$usState: [String!],',
  '$county: [String!],',
  '$commodity: [String!],',
  '$period: String,'
)

const REVENUE_QUERY = `
  results:query_tool_data(
    limit: 50,
    where: {
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $usState},
      county: {_in: $county},
      commodity: {_in: $commodity},
      revenue_type: {_in: $revenueType},
      period: {_eq: $period},
    }) {
    ${ LAND_CLASS }: land_class  
    ${ LAND_CATEGORY }: land_category
    ${ OFFSHORE_REGION }: offshore_region
    ${ US_STATE }: state
    ${ COUNTY }: county
    ${ REVENUE_TYPE }: revenue_type
    ${ COMMODITY }: commodity
    ${ allRevenueYears }
  }`

const PRODUCTION_QUERY = `
  results:query_tool_production_data(
    limit: 50,
    where: {
      land_class: {_eq: $landClass},
      land_category: {_eq: $landCategory},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $usState},
      county: {_in: $county},
      commodity: {_in: $commodity},
      period: {_eq: $period},
    }) {
    ${ LAND_CLASS }: land_class  
    ${ LAND_CATEGORY }: land_category
    ${ OFFSHORE_REGION }: offshore_region
    ${ US_STATE }: state
    ${ COUNTY }: county
    ${ COMMODITY }: commodity
    ${ allRevenueYears }
  }`

/**
 * Get the queries based on data type and the data filter option
 */
const QUERIES = {
  [REVENUE]: gql`query GetDataTableRevenue(${ VARIABLE_LIST_REVENUE }){${ REVENUE_QUERY }}`,
  [PRODUCTION]: gql`query GetDataTableProduction(${ VARIABLE_LIST_PRODUCTION }){${ PRODUCTION_QUERY }}`,
}
