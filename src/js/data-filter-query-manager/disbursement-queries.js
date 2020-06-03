import gql from 'graphql-tag'
import {
  RECIPIENT,
  SOURCE,
  OFFSHORE_REGION,
  US_STATE,
  PERIOD,
  FISCAL_YEAR,
  CALENDAR_YEAR,
  COMMODITY,
  COUNTY
} from '../../constants'

/**
 * The file contains all queries related to revenue data filters.
 * Please note to alias the option queries with 'options' and 'option' since this is
 * used to retrieve that data for the components
 */

const GRAPHQL_VIEW = 'data_filter_disbursements_options'

const VARIABLE_LIST = ''.concat(
  '$recipient: String,',
  '$source: String,',
  '$state: [String!],',
  '$county: [String!],',
  '$commodity: [String!],',
  '$period: String,',
  '$fiscalYear: [Int!],',
  '$calendarYear: [Int!],'
)

const RECIPIENT_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      state: {_in: $state},
      recipient: {_neq: ""},
      source: {_eq: $source},
      county: {_in: $county},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear}
    },
    distinct_on: recipient,
    order_by: {recipient: asc}
  ) {
    option:recipient
  }`

const SOURCE_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      state: {_in: $state},
      recipient: {_eq: $recipient},
      source: {_neq: ""},
      county: {_in: $county},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear}
    },
    distinct_on: source,
    order_by: {source: asc}
  ) {
    option:source
  }`

const US_STATE_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      state: {_neq: ""},
      recipient: {_eq: $recipient},
      source: {_eq: $source},
      county: {_in: $county},
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
      state: {_in: $state},
      recipient: {_eq: $recipient},
      source: {_eq: $source},
      county: {_neq: ""},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear}
    },
    distinct_on: county,
    order_by: {county: asc}
  ) {
    option:county
  }`

const FISCAL_YEAR_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      recipient: {_eq: $recipient},
      source: {_eq: $source},
      state: {_in: $state},
      county: {_in: $county},
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
      recipient: {_eq: $recipient},
      source: {_eq: $source},
      state: {_in: $state},
      county: {_in: $county},
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
      recipient: {_eq: $recipient},
      source: {_eq: $source},
      state: {_in: $state},
      county: {_in: $county},
    },
    distinct_on: period,
    order_by: {period: asc}
  ) {
    option:period
  }`

const DISBURSEMENT_QUERIES = {
  [US_STATE]: gql`query GetUsStateOptionsDisbursement(${ VARIABLE_LIST }){${ US_STATE_OPTIONS_QUERY }}`,
  [COUNTY]: gql`query GetCountyOptionsDisbursement(${ VARIABLE_LIST }){${ COUNTY_OPTIONS_QUERY }}`,
  [RECIPIENT]: gql`query GetRecipientOptionsDisbursement(${ VARIABLE_LIST }){${ RECIPIENT_OPTIONS_QUERY }}`,
  [SOURCE]: gql`query GetSourceOptionsDisbursement(${ VARIABLE_LIST }){${ SOURCE_OPTIONS_QUERY }}`,
  [FISCAL_YEAR]: gql`query GetFiscalYearOptionsDisbursement(${ VARIABLE_LIST }){${ FISCAL_YEAR_OPTIONS_QUERY }}`,
  [CALENDAR_YEAR]: gql`query GetCalendarYearOptionsDisbursement(${ VARIABLE_LIST }){${ CALENDAR_YEAR_OPTIONS_QUERY }}`,
  [PERIOD]: gql`query GetPeriodOptionsDisbursement(${ VARIABLE_LIST }){${ PERIOD_OPTIONS_QUERY }}`
}

export default DISBURSEMENT_QUERIES
