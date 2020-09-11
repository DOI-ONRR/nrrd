// Helper functions for using a variable config to create the vairable list and values
import {
  COMMODITY,
  COMMODITY_ORDER,
  PERIOD,
  CALENDAR_YEAR,
  COMPANY_NAME,
  REVENUE_TYPE
} from '../../constants'

import {
  DATA_FILTER_KEY_TO_DB_COLUMNS as DB_COLS
} from './index'

const DATA_FILTER_QUERIES = {
  [PERIOD]: (view, whereClause) => (
    `options:${ view }(
      where: {
        ${ whereClause }
      },
      distinct_on: ${ DB_COLS[PERIOD] },
      order_by: {${ DB_COLS[PERIOD] }: asc}
      ) {
        option: ${ DB_COLS[PERIOD] }
      }`),
  [COMMODITY]: (view, whereClause) => (
    `options:${ view }(
      where: {
        ${ whereClause }
      },
      distinct_on: ${ DB_COLS[COMMODITY_ORDER] },
      order_by: {${ DB_COLS[COMMODITY_ORDER] }: asc}
      ) {
        option: ${ DB_COLS[COMMODITY] }
      }`),
  [CALENDAR_YEAR]: (view, whereClause) => (
    `options:${ view }(
      where: {
        ${ whereClause }
      },
      distinct_on: ${ DB_COLS[CALENDAR_YEAR] },
      order_by: {${ DB_COLS[CALENDAR_YEAR] }: asc}
      ) {
        option: ${ DB_COLS[CALENDAR_YEAR] }
      }`),
  [COMPANY_NAME]: (view, whereClause) => (
    `options:${ view }(
      where: {
        ${ whereClause }
      },
      distinct_on: ${ DB_COLS[COMPANY_NAME] },
      order_by: {${ DB_COLS[COMPANY_NAME] }: asc}
      ) {
        option: ${ DB_COLS[COMPANY_NAME] }
      }`),
  [REVENUE_TYPE]: (view, whereClause) => (
    `options:${ view }(
      where: {
        ${ whereClause }
      },
      distinct_on: ${ DB_COLS[REVENUE_TYPE] },
      order_by: {${ DB_COLS[REVENUE_TYPE] }: asc}
      ) {
        option: ${ DB_COLS[REVENUE_TYPE] }
      }`)
}

export default (view, dataFilterKey, whereClause) => {
  if (!DATA_FILTER_QUERIES[dataFilterKey]) {
    throw Error(`A data filter query does not exist for ${ dataFilterKey }. Please add query for this key.`)
  }
  return DATA_FILTER_QUERIES[dataFilterKey](view, whereClause)
}
