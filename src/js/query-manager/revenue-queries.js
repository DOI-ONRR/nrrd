import {
  REVENUE
} from '../../constants'
import gql from 'graphql-tag'

const RevenueTotalMonthlyLastTwelve = `results:
  total_monthly_last_twelve_revenue {
    source: land_type
    sum
    month_long
    period_date
    month
    year
    revenue_type
    sort_order
    commodity_order
    commodity
  }`

export const getVariables = (state, options) => undefined

export const getQuery = (state, options) => {
  return QUERIES[REVENUE](undefined, undefined)
}

const QUERIES = {
  [REVENUE]: (state, variableConfig) =>
    gql`query GetRevenueTotalMonthlyLastTwelve
      {${ RevenueTotalMonthlyLastTwelve }}`,
}
