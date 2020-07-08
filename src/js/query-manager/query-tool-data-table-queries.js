
import {
  REVENUE,
  PRODUCTION,
  DISBURSEMENT,
  LOCATION_NAME,
  LAND_TYPE,
  REGION_TYPE,
  DISTRICT_TYPE,
  OFFSHORE_REGION,
  US_STATE,
  COUNTY,
  COMMODITY,
  REVENUE_TYPE,
  PERIOD,
  RECIPIENT,
  SOURCE,
  SINGLE,
  MULTI,
  ALL_REVENUE_YEARS,
  DATA_TYPE
} from '../../constants'
import gql from 'graphql-tag'

// Helper functions for using a vraibel config to create the vairable list and values
import { getDataFilterVariableValues, getDataFilterVariableList } from './index'

/**
 * This file defines the queries used for the data table for the query tool.
 */

// STEP 1: Define all the queries needed
const REVENUE_QUERY = allRevenueYears => `
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

const PRODUCTION_QUERY = allRevenueYears => `
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

const DISBURSEMENT_QUERY = allRevenueYears => `
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

// STEP 2: Define the function to get the variables for the query. A variable config plus helper functions can be used

// This is a simple data filter variable config that specifies whihc variables are used by the query and the type
const VARIABLE_CONFIGS = {
  [REVENUE]: [
    { [LAND_TYPE]: MULTI },
    { [OFFSHORE_REGION]: MULTI },
    { [US_STATE]: MULTI },
    { [COUNTY]: MULTI },
    { [COMMODITY]: MULTI },
    { [REVENUE_TYPE]: MULTI },
    { [PERIOD]: SINGLE },
  ],
  [PRODUCTION]: [
    { [LAND_TYPE]: MULTI },
    { [OFFSHORE_REGION]: MULTI },
    { [US_STATE]: MULTI },
    { [COUNTY]: MULTI },
    { [COMMODITY]: MULTI },
    { [PERIOD]: SINGLE },
  ],
  [DISBURSEMENT]: [
    { [RECIPIENT]: MULTI },
    { [SOURCE]: MULTI },
    { [US_STATE]: MULTI },
    { [COUNTY]: MULTI },
    { [PERIOD]: SINGLE },
  ],
}
export const getVariables = (state, options) => getDataFilterVariableValues(state, VARIABLE_CONFIGS[state[DATA_TYPE]])

// STEP 3: Define the functions to return the proper query based of the state
/**
 * Get the queries based on data type and the data filter option
 */
export const getQuery = (state, options) => QUERIES[state[DATA_TYPE]](state, options)
const QUERIES = {
  [REVENUE]: (state, options) =>
    gql`query GetDataTableRevenue(${ getDataFilterVariableList(state, VARIABLE_CONFIGS[state[DATA_TYPE]]) }){${ REVENUE_QUERY(ALL_REVENUE_YEARS) }}`,
  [PRODUCTION]: (state, options) =>
    gql`query GetDataTableProduction(${ getDataFilterVariableList(state, VARIABLE_CONFIGS[state[DATA_TYPE]]) }){${ PRODUCTION_QUERY(ALL_REVENUE_YEARS) }}`,
  [DISBURSEMENT]: (state, options) =>
    gql`query GetDataTableProduction(${ getDataFilterVariableList(state, VARIABLE_CONFIGS[state[DATA_TYPE]]) }){${ DISBURSEMENT_QUERY(ALL_REVENUE_YEARS) }}`,
}

