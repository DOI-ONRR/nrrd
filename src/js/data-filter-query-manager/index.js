
import {
  REVENUE,
  PRODUCTION,
  DISBURSEMENTS,
  LAND_CLASS,
  LAND_CATEGORY,
  OFFSHORE_REGIONS,
  US_STATES,
  COUNTIES,
  COMMODITIES,
  REVENUE_TYPE,
  PERIOD,
  YEARS,
  PERIOD_FISCAL_YEAR,
  PERIOD_CALENDAR_YEAR,
  FISCAL_YEARS,
  CALENDAR_YEARS
} from '../../constants'

import REVENUE_QUERIES from './revenue-queries'
import PRODUCTION_QUERIES from './production-queries'

/**
 * This object provides various methods for quering the data filters
 */
const DataFilterQueryManager = {
  getQuery: (optionKey, state) => {
    const query = QUERIES[state.dataType](optionKey)
    if (query === undefined) {
      throw new Error(`For data type: '${ state.dataType }' and option key '${ optionKey }', no query was found.`)
    }
    return query
  },
  getVariables: state => VARIABLES[state.dataType](state)
}

export default DataFilterQueryManager

/**
 * Set the variable filters for the query based on the state.
 * The state comes from the DataFilterProvider
 */
const VARIABLES = {
  [REVENUE]: state => ({
    variables: {
      [LAND_CLASS]: state[LAND_CLASS],
      [LAND_CATEGORY]: state[LAND_CATEGORY],
      [OFFSHORE_REGIONS]: state[OFFSHORE_REGIONS] && state[OFFSHORE_REGIONS].split(','),
      [US_STATES]: state[US_STATES] && state[US_STATES].split(','),
      [COUNTIES]: state[COUNTIES] && state[COUNTIES].split(','),
      [COMMODITIES]: state[COMMODITIES] && state[COMMODITIES].split(','),
      [REVENUE_TYPE]: state[REVENUE_TYPE],
      [PERIOD]: state[PERIOD],
      [CALENDAR_YEARS]: state[CALENDAR_YEARS] && state[CALENDAR_YEARS].split(',').map(year => parseInt(year)),
      [FISCAL_YEARS]: state[FISCAL_YEARS] && state[FISCAL_YEARS].split(',').map(year => parseInt(year)),
    }
  }),
  [PRODUCTION]: state => ({
    variables: {
      [LAND_CLASS]: state[LAND_CLASS],
      [LAND_CATEGORY]: state[LAND_CATEGORY],
      [OFFSHORE_REGIONS]: state[OFFSHORE_REGIONS] && state[OFFSHORE_REGIONS].split(','),
      [US_STATES]: state[US_STATES] && state[US_STATES].split(','),
      [COUNTIES]: state[COUNTIES] && state[COUNTIES].split(','),
      [COMMODITIES]: state[COMMODITIES] && state[COMMODITIES].split(','),
      [FISCAL_YEARS]: state[FISCAL_YEARS] && state[FISCAL_YEARS].split(',').map(year => parseInt(year)),
    }
  })
}

/**
 * Get the queries based on data type and the data filter option
 */
const QUERIES = {
  [REVENUE]: optionKey => REVENUE_QUERIES[optionKey],
  [PRODUCTION]: optionKey => PRODUCTION_QUERIES[optionKey]
}
