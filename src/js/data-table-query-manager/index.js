
import {
  REVENUE,
  PRODUCTION,
  DISBURSEMENT,
  LOCATION_NAME,
  LAND_TYPE,
  G1,
  G2,
  G3,
  REGION_TYPE,
  DISTRICT_TYPE,
  OFFSHORE_REGION,
  US_STATE,
  COUNTY,
  COMMODITY,
  REVENUE_TYPE,
  PERIOD,
  ZERO_OPTIONS,
  RECIPIENT,
  SOURCE
} from '../../constants'
import gql from 'graphql-tag'

const allRevenueYears = `
y2003
y2004
y2005
y2006
y2007
y2008
y2009
y2010
y2011
y2012
y2013
y2014
y2015
y2016
y2017
y2018
y2019`

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
      [LAND_TYPE]: (state[LAND_TYPE] === ZERO_OPTIONS || !state[LAND_TYPE]) ? undefined : state[LAND_TYPE].split(','),
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
      [LAND_TYPE]: (state[LAND_TYPE] === ZERO_OPTIONS || !state[LAND_TYPE]) ? undefined : state[LAND_TYPE].split(','),
      [OFFSHORE_REGION]: (state[OFFSHORE_REGION] === ZERO_OPTIONS || !state[OFFSHORE_REGION]) ? undefined : state[OFFSHORE_REGION].split(','),
      [US_STATE]: (state[US_STATE] === ZERO_OPTIONS || !state[US_STATE]) ? undefined : state[US_STATE].split(','),
      [COUNTY]: (state[COUNTY] === ZERO_OPTIONS || !state[COUNTY]) ? undefined : state[COUNTY].split(','),
      [COMMODITY]: (state[COMMODITY] === ZERO_OPTIONS || !state[COMMODITY]) ? undefined : state[COMMODITY].split(','),
      [G1]: state[G1],
      [G2]: state[G2],
      [G3]: state[G3],
      [PERIOD]: (state[PERIOD] === ZERO_OPTIONS) ? undefined : state[PERIOD],
    }
  }),
  [DISBURSEMENT]: state => ({
    variables: {
      [RECIPIENT]: (state[RECIPIENT] === ZERO_OPTIONS || !state[RECIPIENT]) ? undefined : state[RECIPIENT].split(','),
      [SOURCE]: (state[SOURCE] === ZERO_OPTIONS || !state[SOURCE]) ? undefined : state[SOURCE].split(','),
      [US_STATE]: (state[US_STATE] === ZERO_OPTIONS || !state[US_STATE]) ? undefined : state[US_STATE].split(','),
      [COUNTY]: (state[COUNTY] === ZERO_OPTIONS || !state[COUNTY]) ? undefined : state[COUNTY].split(','),
      [G1]: state[G1],
      [G2]: state[G2],
      [G3]: state[G3],
      [PERIOD]: (state[PERIOD] === ZERO_OPTIONS) ? undefined : state[PERIOD],
    }
  })
}

const VARIABLE_LIST_REVENUE = ''.concat(
  '$landType: [String!],',
  '$landCategory: String,',
  '$offshoreRegion: [String!],',
  '$state: [String!],',
  '$county: [String!],',
  '$commodity: [String!],',
  '$revenueType: [String!],',
  '$period: String,'

)
const VARIABLE_LIST_PRODUCTION = ''.concat(
  '$landType: [String!],',
  '$landClass: String,',
  '$landCategory: String,',
  '$offshoreRegion: [String!],',
  '$state: [String!],',
  '$county: [String!],',
  '$commodity: [String!],',
  '$period: String,',
  '$g1: String,',
  '$g2: String,',
  '$g3: String,'
)
const VARIABLE_LIST_DISBURSEMENT = ''.concat(
  '$recipient: [String!],',
  '$source: [String!],',
  '$state: [String!],',
  '$county: [String!],',
  '$period: String,',
  '$g1: String,',
  '$g2: String,',
  '$g3: String,'
)

const REVENUE_QUERY = `
  results:query_tool_revenue_data(
    where: {
      state: {_in: $state},
      county: {_in: $county},
      land_type: {_in: $landType},
      offshore_region: {_in: $offshoreRegion},
      commodity: {_in: $commodity},
      revenue_type: {_in: $revenueType},
      period: {_eq: $period},
    }) {
    ${ LOCATION_NAME }: location_name  
    ${ LAND_TYPE }: land_type
    ${ REGION_TYPE }: region_type
    ${ DISTRICT_TYPE }: district_type
    ${ OFFSHORE_REGION }: offshore_region,
    ${ US_STATE }: state_name
    ${ COUNTY }: county_name
    ${ REVENUE_TYPE }: revenue_type
    ${ COMMODITY }: commodity
    ${ allRevenueYears }
  }`

const PRODUCTION_QUERY = `
  results:query_tool_production_data(
    where: {
      land_type: {_in: $landType},
      offshore_region: {_in: $offshoreRegion},
      state: {_in: $state},
      county: {_in: $county},
      commodity: {_in: $commodity},
      period: {_eq: $period},
    }) {
    ${ LOCATION_NAME }: location_name  
    ${ LAND_TYPE }: land_type
    ${ REGION_TYPE }: region_type
    ${ DISTRICT_TYPE }: district_type
    ${ OFFSHORE_REGION }: offshore_region
    ${ US_STATE }: state_name
    ${ COUNTY }: county_name
    ${ COMMODITY }: commodity
    ${ allRevenueYears }
  }`

const DISBURSEMENT_QUERY = `
  results:query_tool_disbursement_data(
    where: {
      recipient: {_in: $recipient},
      source: {_in: $source},
      state: {_in: $state},
      county: {_in: $county},
      period: {_eq: $period},
    }) {
    ${ RECIPIENT }: recipient
    ${ SOURCE }: source
    ${ US_STATE }: state_name
    ${ COUNTY }: county_name
    ${ allRevenueYears }
  }`
/**
 * Get the queries based on data type and the data filter option
 */
const QUERIES = {
  [REVENUE]: gql`query GetDataTableRevenue(${ VARIABLE_LIST_REVENUE }){${ REVENUE_QUERY }}`,
  [PRODUCTION]: gql`query GetDataTableProduction(${ VARIABLE_LIST_PRODUCTION }){${ PRODUCTION_QUERY }}`,
  [DISBURSEMENT]: gql`query GetDataTableProduction(${ VARIABLE_LIST_DISBURSEMENT }){${ DISBURSEMENT_QUERY }}`,
}
