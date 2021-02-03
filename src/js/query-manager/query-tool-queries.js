
import {
  DATA_FILTER_KEY,
  EXCLUDE_PROPS,
  REVENUE,
  PRODUCTION,
  DISBURSEMENT,
  DISBURSEMENT_MONTHLY,
  REVENUE_BY_COMPANY,
  COMPANY_NAME,
  LAND_TYPE,
  OFFSHORE_REGION,
  US_STATE,
  US_STATE_NAME,
  COUNTY,
  COUNTY_NAME,
  COMMODITY,
  COMMODITY_ORDER,
  PRODUCT,
  REVENUE_TYPE,
  PERIOD,
  RECIPIENT,
  SOURCE,
  SINGLE_STR,
  MULTI_STR,
  MULTI_INT,
  ALL_DISBURSEMENT_YEARS,
  ALL_REVENUE_YEARS,
  ALL_REVENUE_BY_COMPANY_YEARS,
  ALL_PRODUCTION_YEARS,
  ALL_PRODUCTION_MONTHLY_YEARS,
  DATA_TYPE,
  STATE_OFFSHORE_NAME,
  FISCAL_YEAR,
  CALENDAR_YEAR,
  LOCAL_RECIPIENT,
  PERIOD_MONTHLY,
  MONTH_LONG
} from '../../constants'
import gql from 'graphql-tag'

// Helper functions for using a variable config to create the vairable list and values
import {
  getDataFilterVariableValues,
  getDataFilterVariableList,
  getDataFilterWhereClauses,
  DATA_FILTER_KEY_TO_DB_COLUMNS as DB_COLS
} from './index'

import getDataFilterQuery from './data-filter-queries'

// STEP 1: Define the function to get the variables for the query. A variable config plus helper functions can be used

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
    { [COUNTY]: MULTI_STR },
    { [PRODUCT]: MULTI_STR },
    { [STATE_OFFSHORE_NAME]: MULTI_STR },
    { [PERIOD]: SINGLE_STR },
    { [FISCAL_YEAR]: MULTI_INT },
    { [CALENDAR_YEAR]: MULTI_INT },
    { [MONTH_LONG]: MULTI_STR }
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
  [DISBURSEMENT_MONTHLY]: [
    { [RECIPIENT]: MULTI_STR },
    { [SOURCE]: MULTI_STR },
    { [US_STATE_NAME]: MULTI_STR },
    { [LOCAL_RECIPIENT]: MULTI_STR },
    { [PERIOD]: SINGLE_STR },
    { [CALENDAR_YEAR]: MULTI_INT },
    { [MONTH_LONG]: MULTI_STR }
  ],
  [REVENUE_BY_COMPANY]: [
    { [PERIOD]: SINGLE_STR },
    { [COMMODITY]: MULTI_STR },
    { [REVENUE_TYPE]: MULTI_STR },
    { [COMPANY_NAME]: MULTI_STR },
    { [CALENDAR_YEAR]: MULTI_INT }
  ]
}
const getVariableValues = state => {
  if (state[PERIOD] === PERIOD_MONTHLY && state[DATA_TYPE] === DISBURSEMENT) {
    return getDataFilterVariableValues(state, VARIABLE_CONFIGS[DISBURSEMENT_MONTHLY])
  }
  return getDataFilterVariableValues(state, VARIABLE_CONFIGS[state[DATA_TYPE]])
}
const getVariableConfig = state => {
  if (state[PERIOD] === PERIOD_MONTHLY && state[DATA_TYPE] === DISBURSEMENT) {
    return VARIABLE_CONFIGS[DISBURSEMENT_MONTHLY]
  }
  return VARIABLE_CONFIGS[state[DATA_TYPE]]
}
export const getVariables = (state, options) => getVariableValues(state)

// STEP 2: Define all the queries needed

const VIEWS = {
  [REVENUE]: 'query_tool_revenue',
  [PRODUCTION]: 'query_tool_production',
  [DISBURSEMENT]: 'query_tool_disbursement',
  [DISBURSEMENT_MONTHLY]: 'query_tool_disbursement_monthly_data',
  [REVENUE_BY_COMPANY]: 'query_tool_fed_revenue_by_company'
}
const REVENUE_QUERY = whereClause => (
  `results:${ VIEWS[REVENUE] }(
      where: {
        ${ whereClause }
      }) {
      ${ REVENUE_TYPE }: ${ DB_COLS[REVENUE_TYPE] }
      ${ COMMODITY }: ${ DB_COLS[COMMODITY] }
      ${ LAND_TYPE }: ${ DB_COLS[LAND_TYPE] }
      ${ STATE_OFFSHORE_NAME }: ${ DB_COLS[STATE_OFFSHORE_NAME] }
      ${ COUNTY }: ${ DB_COLS[COUNTY_NAME] }
      ${ CALENDAR_YEAR }: ${ DB_COLS[CALENDAR_YEAR] }
      ${ FISCAL_YEAR }: ${ DB_COLS[FISCAL_YEAR] }
      ${ REVENUE }: ${ DB_COLS[REVENUE] }
    }
    counts:${ VIEWS[REVENUE] }_aggregate (
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

const PRODUCTION_QUERY = whereClause => (
  `results:${ VIEWS[PRODUCTION] }(
    where: {
      ${ whereClause }
    }) {
    ${ PRODUCT }: ${ DB_COLS[PRODUCT] }
    ${ LAND_TYPE }: ${ DB_COLS[LAND_TYPE] }
    ${ STATE_OFFSHORE_NAME }: ${ DB_COLS[STATE_OFFSHORE_NAME] }
    ${ COUNTY }: ${ DB_COLS[COUNTY_NAME] }
    ${ MONTH_LONG }: ${ DB_COLS[MONTH_LONG] }
    ${ CALENDAR_YEAR }: ${ DB_COLS[CALENDAR_YEAR] }
    ${ FISCAL_YEAR }: ${ DB_COLS[FISCAL_YEAR] }
    ${ PRODUCTION }: ${ DB_COLS[PRODUCTION] }
  }
  counts:${ VIEWS[PRODUCTION] }_aggregate (
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

const DISBURSEMENT_QUERY = whereClause => (
  `results:${ VIEWS[DISBURSEMENT] }(
    where: {
      ${ whereClause }
    }) {
    ${ RECIPIENT }: ${ DB_COLS[RECIPIENT] }
    ${ SOURCE }: ${ DB_COLS[SOURCE] }
    ${ US_STATE }: ${ DB_COLS[US_STATE_NAME] }
    ${ LOCAL_RECIPIENT }: ${ DB_COLS[LOCAL_RECIPIENT] }
    ${ MONTH_LONG }: ${ DB_COLS[MONTH_LONG] }
    ${ CALENDAR_YEAR }: ${ DB_COLS[CALENDAR_YEAR] }
    ${ FISCAL_YEAR }: ${ DB_COLS[FISCAL_YEAR] }
    ${ DISBURSEMENT }: ${ DB_COLS[DISBURSEMENT] }
  }
  counts:${ VIEWS[DISBURSEMENT] }_aggregate (
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

const REVENUE_BY_COMPANY_QUERY = whereClause => (
  `results:${ VIEWS[REVENUE_BY_COMPANY] }(
    where: {
      ${ whereClause }
    }) {
      ${ COMMODITY }: ${ DB_COLS[COMMODITY] }
      ${ REVENUE_TYPE }: ${ DB_COLS[REVENUE_TYPE] }
      ${ COMPANY_NAME }: ${ DB_COLS[COMPANY_NAME] }
      ${ CALENDAR_YEAR }: ${ DB_COLS[CALENDAR_YEAR] }
      ${ REVENUE }: ${ DB_COLS[REVENUE] }
    }
  counts:${ VIEWS[REVENUE_BY_COMPANY] }_aggregate (
    where: {
      ${ whereClause }
    }) {
    aggregate {
      ${ COMMODITY }:count(columns: ${ DB_COLS[COMMODITY] }, distinct: true)
      ${ REVENUE_TYPE }:count(columns: ${ DB_COLS[REVENUE_TYPE] }, distinct: true)
      ${ COMPANY_NAME }:count(columns: ${ DB_COLS[COMPANY_NAME] }, distinct: true)
    }
  }`)

// STEP 3: Define the functions to return the proper query based of the state
/**
 * Get the queries based on data type and/or the data filter options
 */
export const getQuery = (state, options) => {
  if (options[DATA_FILTER_KEY]) {
    return QUERIES.DATA_FILTERS(state, getVariableConfig(state), options)
  }

  return QUERIES[state[DATA_TYPE]](state, getVariableConfig(state))
}

const QUERIES = {
  [REVENUE]: (state, variableConfig) =>
    gql`query GetDataTableRevenue
      (${ getDataFilterVariableList(state, variableConfig) })
      {${ REVENUE_QUERY(getDataFilterWhereClauses(variableConfig)) }}`,
  [PRODUCTION]: (state, variableConfig) =>
    gql`query GetDataTableProduction
      (${ getDataFilterVariableList(state, variableConfig) })
      {${ PRODUCTION_QUERY(getDataFilterWhereClauses(variableConfig)) }}`,
  [DISBURSEMENT]: (state, variableConfig) =>
    gql`query GetDataTableDisbursement
      (${ getDataFilterVariableList(state, variableConfig) })
      {${ DISBURSEMENT_QUERY(getDataFilterWhereClauses(variableConfig)) }}`,
  [REVENUE_BY_COMPANY]: (state, variableConfig) =>
    gql`query GetDataTableRevenueByCompany
          (${ getDataFilterVariableList(state, variableConfig) })
          {${ REVENUE_BY_COMPANY_QUERY(getDataFilterWhereClauses(variableConfig)) }}`,
  DATA_FILTERS: (state, variableConfig, options) => {
    const excludeProps = options[EXCLUDE_PROPS] ? options[EXCLUDE_PROPS] : []
    const view = (state[PERIOD] === PERIOD_MONTHLY && state[DATA_TYPE] === DISBURSEMENT)
      ? VIEWS[DISBURSEMENT_MONTHLY]
      : VIEWS[state[DATA_TYPE]]
    return (
      gql`query GetQueryToolFilter_${ options[DATA_FILTER_KEY] }
          (${ getDataFilterVariableList(state, variableConfig) })
          {${ getDataFilterQuery(
        view,
        options[DATA_FILTER_KEY],
        getDataFilterWhereClauses(variableConfig, [options[DATA_FILTER_KEY], ...excludeProps])) }}`)
  },
}
