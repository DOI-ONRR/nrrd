import {
  PRODUCTION
} from '../../constants'
import gql from 'graphql-tag'

const ProoductionTotalMonthlyLastTwelve = `results:
  total_monthly_last_twelve_production {
    source
    product
    sum
    month_long
    period_date
    month
    year
  }`

export const getVariables = (state, options) => undefined

export const getQuery = (state, options) => {
  return QUERIES[PRODUCTION](undefined, undefined)
}

const QUERIES = {
  [PRODUCTION]: (state, variableConfig) =>
    gql`query GetProductionTotalMonthlyLastTwelve
      {${ ProoductionTotalMonthlyLastTwelve }}`,
}
