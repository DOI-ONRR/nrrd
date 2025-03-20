import {
  REVENUE,
  PRODUCTION,
  DISBURSEMENT,
  LAND_TYPE,
  LAND_CLASS,
  LAND_CATEGORY,
  OFFSHORE_REGION,
  US_STATE,
  STATE_OFFSHORE_NAME,
  COUNTY,
  COMMODITY,
  PRODUCT,
  REVENUE_TYPE,
  PERIOD,
  DATA_TYPE,
  PERIOD_FISCAL_YEAR,
  PERIOD_CALENDAR_YEAR,
  FISCAL_YEAR,
  CALENDAR_YEAR,
  ZERO_OPTIONS,
  RECIPIENT,
  SOURCE
} from '../../constants'

import DATA_TYPE_QUERIES from './data-type-queries'
import REVENUE_QUERIES from './revenue-queries'
import PRODUCTION_QUERIES from './production-queries'
import DISBURSEMENT_QUERIES from './disbursement-queries'

/**
 * This object provides various methods for quering the data filters
 */
const DataFilterQueryManager = {
  getQuery: (optionKey, state) => {
    if (optionKey === DATA_TYPE) {
      return QUERIES[DATA_TYPE](optionKey)
    }
    const query = QUERIES[state.dataType](optionKey)
    if (query === undefined) {
      throw new Error(`For data type: '${ state.dataType }' and option key '${ optionKey }', no query was found.`)
    }
    return query
  },
  getVariables: (state, optionKey) => {
    if (optionKey === DATA_TYPE) {
      return undefined
    }
    return VARIABLES[state.dataType](state)
  }
}

export default DataFilterQueryManager

/**
 * Set the variable filters for the query based on the state.
 * The state comes from the DataFilterProvider
 */
const VARIABLES = {
  [REVENUE]: state => ({
    variables: {
      [LAND_TYPE]: (state[LAND_TYPE] === ZERO_OPTIONS || !state[LAND_TYPE]) ? undefined : state[LAND_TYPE].split(','),
      [LAND_CATEGORY]: (state[LAND_CATEGORY] === ZERO_OPTIONS) ? undefined : state[LAND_CATEGORY],
      [OFFSHORE_REGION]: (state[OFFSHORE_REGION] === ZERO_OPTIONS || !state[OFFSHORE_REGION]) ? undefined : state[OFFSHORE_REGION].split(','),
      [US_STATE]: (state[US_STATE] === ZERO_OPTIONS || !state[US_STATE]) ? undefined : state[US_STATE].split(','),
      [COUNTY]: (state[COUNTY] === ZERO_OPTIONS || !state[COUNTY]) ? undefined : state[COUNTY].split(','),
      [COMMODITY]: (state[COMMODITY] === ZERO_OPTIONS || !state[COMMODITY]) ? undefined : state[COMMODITY].split(','),
      [REVENUE_TYPE]: (state[REVENUE_TYPE] === ZERO_OPTIONS || !state[REVENUE_TYPE]) ? undefined : state[REVENUE_TYPE].split(','),
      [PERIOD]: (state[PERIOD] === ZERO_OPTIONS) ? undefined : state[PERIOD],
      [CALENDAR_YEAR]: (state[PERIOD] === PERIOD_CALENDAR_YEAR && state[CALENDAR_YEAR]) ? state[CALENDAR_YEAR].split(',').map(year => parseInt(year)) : undefined,
      [FISCAL_YEAR]: (state[PERIOD] === PERIOD_FISCAL_YEAR && state[FISCAL_YEAR]) ? state[FISCAL_YEAR].split(',').map(year => parseInt(year)) : undefined,
      [STATE_OFFSHORE_NAME]: (state[STATE_OFFSHORE_NAME] === ZERO_OPTIONS || !state[STATE_OFFSHORE_NAME]) ? undefined : state[STATE_OFFSHORE_NAME].split(','),
    }
  }),
  [PRODUCTION]: state => ({
    variables: {
      [LAND_TYPE]: (state[LAND_TYPE] === ZERO_OPTIONS || !state[LAND_TYPE]) ? undefined : state[LAND_TYPE].split(','),
      [LAND_CLASS]: (state[LAND_CLASS] === ZERO_OPTIONS) ? undefined : state[LAND_CLASS],
      [LAND_CATEGORY]: (state[LAND_CATEGORY] === ZERO_OPTIONS) ? undefined : state[LAND_CATEGORY],
      [OFFSHORE_REGION]: (state[OFFSHORE_REGION] === ZERO_OPTIONS || !state[OFFSHORE_REGION]) ? undefined : state[OFFSHORE_REGION].split(','),
      [US_STATE]: (state[US_STATE] === ZERO_OPTIONS || !state[US_STATE]) ? undefined : state[US_STATE].split(','),
      [COUNTY]: (state[COUNTY] === ZERO_OPTIONS || !state[COUNTY]) ? undefined : state[COUNTY].split(','),
      [PRODUCT]: (state[PRODUCT] === ZERO_OPTIONS || !state[PRODUCT]) ? undefined : state[PRODUCT].split(','),
      [COMMODITY]: (state[COMMODITY] === ZERO_OPTIONS || !state[COMMODITY]) ? undefined : state[COMMODITY].split(','),
      [PERIOD]: (state[PERIOD] === ZERO_OPTIONS) ? undefined : state[PERIOD],
      [CALENDAR_YEAR]: (state[PERIOD] === PERIOD_CALENDAR_YEAR && state[CALENDAR_YEAR]) ? state[CALENDAR_YEAR].split(',').map(year => parseInt(year)) : undefined,
      [FISCAL_YEAR]: (state[PERIOD] === PERIOD_FISCAL_YEAR && state[FISCAL_YEAR]) ? state[FISCAL_YEAR].split(',').map(year => parseInt(year)) : undefined,
    }
  }),
  [DISBURSEMENT]: state => ({
    variables: {
      [RECIPIENT]: (state[RECIPIENT] === ZERO_OPTIONS || !state[RECIPIENT]) ? undefined : state[RECIPIENT].split(','),
      [SOURCE]: (state[SOURCE] === ZERO_OPTIONS || !state[SOURCE]) ? undefined : state[SOURCE].split(','),
      [US_STATE]: (state[US_STATE] === ZERO_OPTIONS || !state[US_STATE]) ? undefined : state[US_STATE].split(','),
      [COUNTY]: (state[COUNTY] === ZERO_OPTIONS || !state[COUNTY]) ? undefined : state[COUNTY].split(','),
      [PERIOD]: (state[PERIOD] === ZERO_OPTIONS) ? undefined : state[PERIOD],
      [CALENDAR_YEAR]: (state[PERIOD] === PERIOD_CALENDAR_YEAR && state[CALENDAR_YEAR]) ? state[CALENDAR_YEAR].split(',').map(year => parseInt(year)) : undefined,
      [FISCAL_YEAR]: (state[PERIOD] === PERIOD_FISCAL_YEAR && state[FISCAL_YEAR]) ? state[FISCAL_YEAR].split(',').map(year => parseInt(year)) : undefined,
    }
  })
}

/**
 * Get the queries based on data type and the data filter option
 */
const QUERIES = {
  [DATA_TYPE]: optionKey => DATA_TYPE_QUERIES[optionKey],
  [REVENUE]: optionKey => REVENUE_QUERIES[optionKey],
  [PRODUCTION]: optionKey => PRODUCTION_QUERIES[optionKey],
  [DISBURSEMENT]: optionKey => DISBURSEMENT_QUERIES[optionKey]
}
