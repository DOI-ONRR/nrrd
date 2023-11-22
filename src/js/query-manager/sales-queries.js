import {
  FEDERAL_SALES
} from '../../constants'
import gql from 'graphql-tag'

const Sales = `results:
  federal_sales_v {
    id
    calendar_year
    period
    land_type
    state_offshore_region
    revenue_type
    commodity
    sales_volume
    gas_volume
    sales_value
    royalty_value_prior_to_allowance
    transportation_allowance
    processing_allowance
    royalty_value_less_allowance
    effective_royalty_rate
    creation_date
  } `

export const getVariables = (state, options) => undefined

export const getQuery = (state, options) => {
  return QUERIES[FEDERAL_SALES](undefined, undefined)
}

const QUERIES = {
  [FEDERAL_SALES]: (state, variableConfig) =>
    gql`query GetFederalSalesData
      {${ Sales }}`,
}
