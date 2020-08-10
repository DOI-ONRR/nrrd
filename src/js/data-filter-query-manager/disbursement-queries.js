import gql from 'graphql-tag'
import {
  RECIPIENT,
  SOURCE,
  US_STATE,
  US_STATE_NAME,
  PERIOD,
  FISCAL_YEAR,
  CALENDAR_YEAR,
  COUNTY,
  STATE_OFFSHORE_NAME
} from '../../constants'

/**
 * The file contains all queries related to revenue data filters.
 * Please note to alias the option queries with 'options' and 'option' since this is
 * used to retrieve that data for the components
 */

const GRAPHQL_VIEW = 'data_filter_disbursements_options'

const VARIABLE_LIST = ''.concat(
  '$recipient: [String!],',
  '$source: [String!],',
  '$state: [String!],',
  '$state_name: [String!]',
  '$period: String,',
  '$fiscalYear: [Int!],',
  '$calendarYear: [Int!],',
  '$stateOffshoreName: [String!]'
)

const STATE_OFFSHORE_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      state_name: {_in: $state_name},
      state: {_in: $state},
      recipient: {_in: $recipient},
      source: {_in: $source},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear},
      state_offshore_name: {_neq: ""}
    },
    distinct_on: state_offshore_name_sort,
    order_by: {state_offshore_name_sort: asc}
  ) {
    option:state_offshore_name
  }`

const RECIPIENT_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      state_name: {_in: $state_name},
      state: {_in: $state},
      recipient: {_neq: ""},
      source: {_in: $source},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear},
      state_offshore_name: {_in: $${ STATE_OFFSHORE_NAME }}
    },
    distinct_on: recipient,
    order_by: {recipient: asc}
  ) {
    option:recipient
  }`

const SOURCE_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      state_name: {_in: $state_name},
      state: {_in: $state},
      recipient: {_in: $recipient},
      source: {_neq: ""},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear},
      state_offshore_name: {_in: $${ STATE_OFFSHORE_NAME }}
    },
    distinct_on: source,
    order_by: {source: asc}
  ) {
    option:source
  }`

const US_STATE_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      state_name: {_in: $state_name},
      state: {_neq: ""},
      recipient: {_in: $recipient},
      source: {_in: $source},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear},
      state_offshore_name: {_in: $${ STATE_OFFSHORE_NAME }}
    },
    distinct_on: state,
    order_by: {state: asc}
  ) {
    option:state
  }`

const US_STATE_NAME_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      state_name: {_neq: ""},
      recipient: {_in: $recipient},
      source: {_in: $source},
      period: {_eq: $period},
      fiscal_year: {_in: $fiscalYear},
      calendar_year: {_in: $calendarYear},
      state_offshore_name: {_in: $${ STATE_OFFSHORE_NAME }}
    },
    distinct_on: state_name,
    order_by: {state_name: asc}
  ) {
    option:state_name
  }`

const FISCAL_YEAR_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      state_name: {_in: $state_name},
      recipient: {_in: $recipient},
      source: {_in: $source},
      state: {_in: $state},
      period: {_eq: $period},
      fiscal_year: {_neq: 0},
      state_offshore_name: {_in: $${ STATE_OFFSHORE_NAME }}
    },
    distinct_on: fiscal_year,
    order_by: {fiscal_year: asc}
  ) {
    option:fiscal_year
  }`

const CALENDAR_YEAR_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      state_name: {_in: $state_name},
      recipient: {_in: $recipient},
      source: {_in: $source},
      state: {_in: $state},
      period: {_eq: $period},
      calendar_year: {_neq: 0},
      state_offshore_name: {_in: $${ STATE_OFFSHORE_NAME }}
    },
    distinct_on: calendar_year,
    order_by: {calendar_year: asc}
  ) {
    option:calendar_year
  }`

const PERIOD_OPTIONS_QUERY = `
  options:${ GRAPHQL_VIEW }(
    where: {
      state_name: {_in: $state_name},
      recipient: {_in: $recipient},
      source: {_in: $source},
      state: {_in: $state},
      state_offshore_name: {_in: $${ STATE_OFFSHORE_NAME }}
    },
    distinct_on: period,
    order_by: {period: asc}
  ) {
    option:period
  }`

const DISBURSEMENT_QUERIES = {
  [US_STATE_NAME]: gql`query GetUsStateNameOptionsDisbursement(${ VARIABLE_LIST }){${ US_STATE_NAME_OPTIONS_QUERY }}`,
  [US_STATE]: gql`query GetUsStateOptionsDisbursement(${ VARIABLE_LIST }){${ US_STATE_OPTIONS_QUERY }}`,
  [RECIPIENT]: gql`query GetRecipientOptionsDisbursement(${ VARIABLE_LIST }){${ RECIPIENT_OPTIONS_QUERY }}`,
  [SOURCE]: gql`query GetSourceOptionsDisbursement(${ VARIABLE_LIST }){${ SOURCE_OPTIONS_QUERY }}`,
  [FISCAL_YEAR]: gql`query GetFiscalYearOptionsDisbursement(${ VARIABLE_LIST }){${ FISCAL_YEAR_OPTIONS_QUERY }}`,
  [CALENDAR_YEAR]: gql`query GetCalendarYearOptionsDisbursement(${ VARIABLE_LIST }){${ CALENDAR_YEAR_OPTIONS_QUERY }}`,
  [PERIOD]: gql`query GetPeriodOptionsDisbursement(${ VARIABLE_LIST }){${ PERIOD_OPTIONS_QUERY }}`,
  [STATE_OFFSHORE_NAME]: gql`query GetStateOffshoreOptionsDisbursement(${ VARIABLE_LIST }){${ STATE_OFFSHORE_OPTIONS_QUERY }}`,
}

export default DISBURSEMENT_QUERIES
