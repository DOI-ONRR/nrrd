
import {
  REVENUE,
  PRODUCTION,
  DISBURSEMENT,
  LAND_TYPE,
  OFFSHORE_REGION,
  US_STATE,
  US_STATE_NAME,
  COUNTY,
  COUNTY_NAME,
  COMMODITY,
  PRODUCT,
  REVENUE_TYPE,
  PERIOD,
  RECIPIENT,
  SOURCE,
  SINGLE_STR,
  MULTI_STR,
  MULTI_INT,
  ALL_REVENUE_YEARS,
  DATA_TYPE,
  STATE_OFFSHORE_NAME,
  FISCAL_YEAR,
  CALENDAR_YEAR,
  LOCAL_RECIPIENT
} from '../../constants'
import gql from 'graphql-tag'

// Helper functions for using a variable config to create the vairable list and values
import {
  getDataFilterVariableValues,
  getDataFilterVariableList,
  getDataFilterWhereClauses,
  DATA_FILTER_KEY_TO_DB_COLUMNS as DB_COLS
} from './index'

/**
 * This file defines the queries used for the data table for the query tool.
 */

// STEP 1: Define all the queries needed
const REVENUE_QUERY = variableConfig => {
  const whereClause = getDataFilterWhereClauses(variableConfig)
  return (
    `results:query_tool_revenue_data(
      where: {
        ${ whereClause }
      }) {
      ${ REVENUE_TYPE }: ${ DB_COLS[REVENUE_TYPE] }
      ${ COMMODITY }: ${ DB_COLS[COMMODITY] }
      ${ LAND_TYPE }: ${ DB_COLS[LAND_TYPE] }
      ${ STATE_OFFSHORE_NAME }: ${ DB_COLS[STATE_OFFSHORE_NAME] }
      ${ COUNTY }: ${ DB_COLS[COUNTY_NAME] }
      ${ ALL_REVENUE_YEARS }
    }
    counts:query_tool_revenue_data_aggregate (
      where: {
        ${ whereClause }
      }
      ) {
      aggregate {
        ${ COMMODITY }:count(columns: ${ DB_COLS[COMMODITY] }, distinct: true)
        ${ COUNTY }:count(columns: ${ DB_COLS[COUNTY_NAME] }, distinct: true)
        ${ LAND_TYPE }:count(columns: ${ DB_COLS[LAND_TYPE] }, distinct: true)
        ${ STATE_OFFSHORE_NAME }:count(columns: ${ DB_COLS[STATE_OFFSHORE_NAME] }, distinct: true)
        ${ REVENUE_TYPE }:count(columns: ${ DB_COLS[REVENUE_TYPE] }, distinct: true)
      }
    }`
  )
}

const PRODUCTION_QUERY = variableConfig => {
  const whereClause = getDataFilterWhereClauses(variableConfig)
  return (`
  results:query_tool_production_data(
    where: {
      ${ whereClause }
    }) {
    ${ PRODUCT }: ${ DB_COLS[PRODUCT] }
    ${ LAND_TYPE }: ${ DB_COLS[LAND_TYPE] }
    ${ STATE_OFFSHORE_NAME }: ${ DB_COLS[STATE_OFFSHORE_NAME] }
    ${ COUNTY }: ${ DB_COLS[COUNTY] }
    ${ ALL_REVENUE_YEARS }
  }
  counts:query_tool_production_data_aggregate (
    where: {
      ${ whereClause }
    }
    ) {
    aggregate {
      ${ PRODUCT }:count(columns: ${ DB_COLS[PRODUCT] }, distinct: true)
      ${ COUNTY }:count(columns: ${ DB_COLS[COUNTY_NAME] }, distinct: true)
      ${ LAND_TYPE }:count(columns: ${ DB_COLS[LAND_TYPE] }, distinct: true)
      ${ STATE_OFFSHORE_NAME }:count(columns: ${ DB_COLS[STATE_OFFSHORE_NAME] }, distinct: true)
    }
  }`)
}

const DISBURSEMENT_QUERY = variableConfig => {
  const whereClause = getDataFilterWhereClauses(variableConfig)
  return (`
  results:query_tool_disbursement_data(
    where: {
      ${ whereClause }
    }) {
    ${ RECIPIENT }: ${ DB_COLS[RECIPIENT] }
    ${ SOURCE }: ${ DB_COLS[SOURCE] }
    ${ US_STATE }: ${ DB_COLS[US_STATE_NAME] }
    ${ LOCAL_RECIPIENT }: ${ DB_COLS[LOCAL_RECIPIENT] }
    ${ ALL_REVENUE_YEARS }
  }
  counts:query_tool_disbursement_data_aggregate (
    where: {
      ${ whereClause }
    }
    ) {
    aggregate {
      ${ RECIPIENT }:count(columns: ${ DB_COLS[RECIPIENT] }, distinct: true)
      ${ SOURCE }:count(columns: ${ DB_COLS[SOURCE] }, distinct: true)
      ${ US_STATE }:count(columns: ${ DB_COLS[US_STATE_NAME] }, distinct: true)
      ${ LOCAL_RECIPIENT }:count(columns: ${ DB_COLS[LOCAL_RECIPIENT] }, distinct: true)
    }
  }`)
}

// STEP 2: Define the function to get the variables for the query. A variable config plus helper functions can be used

// This is a simple data filter variable config that specifies which variables are used by the query and the type
const VARIABLE_CONFIGS = {
  [REVENUE]: [
    { [LAND_TYPE]: MULTI_STR },
    { [COUNTY]: MULTI_STR },
    { [COMMODITY]: MULTI_STR },
    { [REVENUE_TYPE]: MULTI_STR },
    { [STATE_OFFSHORE_NAME]: MULTI_STR },
    { [PERIOD]: SINGLE_STR },
    { [FISCAL_YEAR]: MULTI_INT },
    { [CALENDAR_YEAR]: MULTI_INT }
  ],
  [PRODUCTION]: [
    { [LAND_TYPE]: MULTI_STR },
    { [OFFSHORE_REGION]: MULTI_STR },
    { [US_STATE]: MULTI_STR },
    { [COUNTY]: MULTI_STR },
    { [COMMODITY]: MULTI_STR },
    { [PRODUCT]: MULTI_STR },
    { [STATE_OFFSHORE_NAME]: MULTI_STR },
    { [PERIOD]: SINGLE_STR },
    { [FISCAL_YEAR]: MULTI_INT },
    { [CALENDAR_YEAR]: MULTI_INT }
  ],
  [DISBURSEMENT]: [
    { [RECIPIENT]: MULTI_STR },
    { [SOURCE]: MULTI_STR },
    { [US_STATE_NAME]: MULTI_STR },
    { [LOCAL_RECIPIENT]: MULTI_STR },
    { [PERIOD]: SINGLE_STR },
    { [FISCAL_YEAR]: MULTI_INT },
    { [CALENDAR_YEAR]: MULTI_INT }
  ],
}

export const getVariables = (state, options) =>
  getDataFilterVariableValues(state, VARIABLE_CONFIGS[state[DATA_TYPE]])

// STEP 3: Define the functions to return the proper query based of the state
/**
 * Get the queries based on data type and the data filter option
 */
export const getQuery = (state, options) => QUERIES[state[DATA_TYPE]](state, options)
const QUERIES = {
  [REVENUE]: (state, options) =>
    gql`query GetDataTableRevenue
      (${ getDataFilterVariableList(state, VARIABLE_CONFIGS[state[DATA_TYPE]]) })
      {${ REVENUE_QUERY(VARIABLE_CONFIGS[state[DATA_TYPE]]) }}`,
  [PRODUCTION]: (state, options) =>
    gql`query GetDataTableProduction
      (${ getDataFilterVariableList(state, VARIABLE_CONFIGS[state[DATA_TYPE]]) })
      {${ PRODUCTION_QUERY(VARIABLE_CONFIGS[state[DATA_TYPE]]) }}`,
  [DISBURSEMENT]: (state, options) =>
    gql`query GetDataTableDisbursement
      (${ getDataFilterVariableList(state, VARIABLE_CONFIGS[state[DATA_TYPE]]) })
      {${ DISBURSEMENT_QUERY(VARIABLE_CONFIGS[state[DATA_TYPE]]) }}`,
}

/*

    ${ REVENUE_TYPE }:query_tool_revenue_data(
      where: {
        ${ getDataFilterWhereClauses(variableConfig, [REVENUE_TYPE]) }
        ${ DB_COLS[REVENUE_TYPE] }: {_neq: ""},
      },
      distinct_on: ${ DB_COLS[REVENUE_TYPE] },
      order_by: {${ DB_COLS[REVENUE_TYPE] }: asc}
    ) {
      option:${ DB_COLS[REVENUE_TYPE] }
    }
    ${ PERIOD }:query_tool_revenue_data(
      where: {
        ${ getDataFilterWhereClauses(variableConfig, [PERIOD, FISCAL_YEAR, CALENDAR_YEAR]) }
        ${ DB_COLS[PERIOD] }: {_neq: ""},
      },
      distinct_on: ${ DB_COLS[PERIOD] },
      order_by: {${ DB_COLS[PERIOD] }: asc}
    ) {
      option:${ DB_COLS[PERIOD] }
    }
    ${ FISCAL_YEAR }:query_tool_revenue_data(
      where: {
        ${ getDataFilterWhereClauses(variableConfig, [FISCAL_YEAR, CALENDAR_YEAR]) }
        ${ DB_COLS[FISCAL_YEAR] }: {_neq: 0},
      },
      distinct_on: ${ DB_COLS[FISCAL_YEAR] },
      order_by: {${ DB_COLS[FISCAL_YEAR] }: asc}
    ) {
      option:${ DB_COLS[FISCAL_YEAR] }
    }
    ${ US_STATE }:query_tool_revenue_data(
      where: {
        ${ getDataFilterWhereClauses(variableConfig, [US_STATE]) }
        ${ DB_COLS[US_STATE] }: {_neq: ""},
      },
      distinct_on: ${ DB_COLS[US_STATE] },
      order_by: {${ DB_COLS[US_STATE] }: asc}
    ) {
      option:${ DB_COLS[US_STATE] }
    }
    ${ COMMODITY }:query_tool_revenue_data(
      where: {
        ${ getDataFilterWhereClauses(variableConfig, [COMMODITY]) }
        ${ DB_COLS[COMMODITY] }: {_neq: ""},
      },
      distinct_on: commodity_order,
      order_by: {commodity_order: asc}
    ) {
      option:${ DB_COLS[COMMODITY] }
    }

    */
