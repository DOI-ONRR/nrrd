import {
  DISBURSEMENT
} from '../../constants'
import gql from 'graphql-tag'

const DisbursementTotalMonthlyLastTwelve = `results:
  total_monthly_last_twelve_disbursement {
    source
    sum
    month_long
    period_date
    month
    year
    recipient: fund_class
  } `

export const getVariables = (state, options) => undefined

export const getQuery = (state, options) => {
  return QUERIES[DISBURSEMENT](undefined, undefined)
}

const QUERIES = {
  [DISBURSEMENT]: (state, variableConfig) =>
    gql`query GetDisbursementTotalMonthlyLastTwelve
      {${ DisbursementTotalMonthlyLastTwelve }}`,
}
