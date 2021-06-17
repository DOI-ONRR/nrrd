/**
 * Reducer define how to update the application state
 * Any business logic should be defined in actions
 */

import {
  ALL_YEARS,
  REVENUE,
  REVENUE_TYPE,
  PRODUCTION,
  // COUNTIES,
  DISBURSEMENT,
  RECIPIENT,
  GROUP_BY,
  GROUP_BY_STICKY,
  BREAKOUT_BY,
  // ADDITIONAL_COLUMNS,
  MONTHLY,
  PERIOD,
  FISCAL_YEAR,
  PERIOD_FISCAL_YEAR,
  CALENDAR_YEAR,
  PERIOD_CALENDAR_YEAR,
  DATA_TYPE,
  QUERY_TABLE_FILTER_DEFAULT,
  EXPLORE_DATA_FILTER_DEFAULT,
  HOME_DATA_FILTER_DEFAULT,
  OFFSHORE_REGIONS,
  YEAR,
  // YEARLY,
  PRODUCT,
  QUERY_COUNTS,
  MAP_LEVEL,
  STATE,
  REVENUE_BY_COMPANY,
  COMPANY_NAME,
  COMMODITY,
  PERIOD_ALL_YEARS
} from '../../constants'

const types = Object.freeze({
  UPDATE_DATA_FILTER: 'UPDATE_DATA_FILTER',
  UPDATE_QUERY_DATA_FILTER_COUNTS: 'UPDATE_QUERY_DATA_FILTER_COUNTS',
  CLEAR_ALL_FILTERS: 'CLEAR_ALL_FILTERS',
})

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
  case types.UPDATE_DATA_FILTER: {
    const dataType = payload.dataType || state.dataType

    const dataTypeCache = Object.assign(((state.dataTypesCache && state.dataTypesCache[dataType]) || { ...initialState }), { ...payload })

    const updatedDataTypesCache = Object.assign((state.dataTypesCache || {}), { [dataType]: { ...dataTypeCache } })

    return ({ [QUERY_COUNTS]: state[QUERY_COUNTS], dataTypesCache: { ...updatedDataTypesCache }, ...dataTypeCache })
  }
  case types.UPDATE_QUERY_DATA_FILTER_COUNTS: {
    const currentQueryCounts = state[QUERY_COUNTS] || {}
    return ({ ...state, [QUERY_COUNTS]: Object.assign(currentQueryCounts, payload.counts) })
  }
  case types.CLEAR_ALL_FILTERS: {
    const dataType = state.dataType

    const dataTypeCache = {
      [DATA_TYPE]: state[DATA_TYPE],
      [PERIOD]: state[PERIOD],
      [FISCAL_YEAR]: state[FISCAL_YEAR],
      [CALENDAR_YEAR]: state[CALENDAR_YEAR]
    }

    const updatedDataTypesCache = Object.assign((state.dataTypesCache || {}), { [dataType]: { ...dataTypeCache } })

    return ({ [QUERY_COUNTS]: state[QUERY_COUNTS], dataTypesCache: { ...updatedDataTypesCache }, ...dataTypeCache })
  }
  default:
    return state
  }
}

const getLastFiveYears = (dataType, period) => (ALL_YEARS[dataType][period].length > 5)
  ? ALL_YEARS[dataType][period].slice(ALL_YEARS[dataType][period].length - 5).toString()
  : ALL_YEARS[dataType][period].toString()

const getLatestYear = (dataType, period) => ALL_YEARS[dataType][period].slice(ALL_YEARS[dataType][period].length - 1)[0]
const getAllYears = (dataType) => {
    console.debug("ALL_YEARS: ", ALL_YEARS, " Data Type : ", dataType);
    return ALL_YEARS[dataType]
}

const initialState = {
  [QUERY_TABLE_FILTER_DEFAULT]: {
    [DATA_TYPE]: REVENUE,
    [GROUP_BY]: REVENUE_TYPE,
    [PERIOD]: PERIOD_FISCAL_YEAR,
    [FISCAL_YEAR]: getLastFiveYears(REVENUE, PERIOD_FISCAL_YEAR),
    [CALENDAR_YEAR]: getLastFiveYears(REVENUE, PERIOD_CALENDAR_YEAR),
    dataTypesCache: {
      [REVENUE]: {
        [DATA_TYPE]: REVENUE,
        [GROUP_BY]: REVENUE_TYPE,
        [PERIOD]: PERIOD_FISCAL_YEAR,
        [FISCAL_YEAR]: getLastFiveYears(REVENUE, PERIOD_FISCAL_YEAR),
        [CALENDAR_YEAR]: getLastFiveYears(REVENUE, PERIOD_CALENDAR_YEAR),
      },
      [PRODUCTION]: {
        [DATA_TYPE]: PRODUCTION,
        [GROUP_BY_STICKY]: PRODUCT,
        [PERIOD]: PERIOD_FISCAL_YEAR,
        [FISCAL_YEAR]: getLastFiveYears(PRODUCTION, PERIOD_FISCAL_YEAR),
        [CALENDAR_YEAR]: getLastFiveYears(PRODUCTION, PERIOD_CALENDAR_YEAR),
      },
      [DISBURSEMENT]: {
        [DATA_TYPE]: DISBURSEMENT,
        [GROUP_BY]: RECIPIENT,
        [PERIOD]: PERIOD_FISCAL_YEAR,
        [FISCAL_YEAR]: getLastFiveYears(DISBURSEMENT, PERIOD_FISCAL_YEAR),
        [CALENDAR_YEAR]: getLastFiveYears(DISBURSEMENT, PERIOD_CALENDAR_YEAR),
      },
      [REVENUE_BY_COMPANY]: {
        [DATA_TYPE]: REVENUE_BY_COMPANY,
        [GROUP_BY]: COMPANY_NAME,
        [PERIOD]: 'Calendar Year',
        [CALENDAR_YEAR]: getLastFiveYears(REVENUE_BY_COMPANY, PERIOD_CALENDAR_YEAR),
      }
    }
  },
  [EXPLORE_DATA_FILTER_DEFAULT]: {
    [DATA_TYPE]: REVENUE,
    [PERIOD]: PERIOD_CALENDAR_YEAR,
    [FISCAL_YEAR]: getLatestYear(REVENUE, PERIOD_FISCAL_YEAR).toString(),
    [CALENDAR_YEAR]: getLatestYear(REVENUE, PERIOD_CALENDAR_YEAR).toString(),
    [OFFSHORE_REGIONS]: false,
    [MAP_LEVEL]: STATE,
    [YEAR]: getLatestYear(REVENUE, PERIOD_CALENDAR_YEAR),
    [PERIOD_ALL_YEARS]: getAllYears(REVENUE),
    dataTypesCache: {
      [REVENUE]: {
        [DATA_TYPE]: REVENUE,
        [PERIOD]: PERIOD_CALENDAR_YEAR,
        [FISCAL_YEAR]: getLatestYear(REVENUE, PERIOD_FISCAL_YEAR).toString(),
        [CALENDAR_YEAR]: getLatestYear(REVENUE, PERIOD_CALENDAR_YEAR).toString(),
        [OFFSHORE_REGIONS]: false,
        [MAP_LEVEL]: STATE,
        [YEAR]: getLatestYear(REVENUE, PERIOD_FISCAL_YEAR),
        [PERIOD_ALL_YEARS]: getAllYears(REVENUE),
      },
      [PRODUCTION]: {
        [DATA_TYPE]: PRODUCTION,
        [PERIOD]: PERIOD_CALENDAR_YEAR,
        [FISCAL_YEAR]: getLatestYear(PRODUCTION, PERIOD_FISCAL_YEAR).toString(),
        [CALENDAR_YEAR]: getLatestYear(PRODUCTION, PERIOD_CALENDAR_YEAR).toString(),
        [OFFSHORE_REGIONS]: false,
        [MAP_LEVEL]: STATE,
        [YEAR]: getLatestYear(PRODUCTION, PERIOD_CALENDAR_YEAR),
        [PERIOD_ALL_YEARS]: getAllYears(PRODUCTION, PERIOD_CALENDAR_YEAR),
      },
      [DISBURSEMENT]: {
        [DATA_TYPE]: DISBURSEMENT,
        [GROUP_BY]: RECIPIENT,
        [PERIOD]: PERIOD_FISCAL_YEAR,
        [FISCAL_YEAR]: getLatestYear(DISBURSEMENT, PERIOD_FISCAL_YEAR).toString(),
        [OFFSHORE_REGIONS]: false,
        [MAP_LEVEL]: STATE,
        [YEAR]: getLatestYear(DISBURSEMENT, PERIOD_FISCAL_YEAR),
        [PERIOD_ALL_YEARS]: getAllYears(DISBURSEMENT, PERIOD_FISCAL_YEAR),
      }
    }
  },
  [HOME_DATA_FILTER_DEFAULT]: {
    [DATA_TYPE]: REVENUE,
    [PERIOD]: PERIOD_FISCAL_YEAR,
    [FISCAL_YEAR]: getLatestYear(REVENUE, PERIOD_FISCAL_YEAR).toString(),
    [CALENDAR_YEAR]: getLatestYear(REVENUE, PERIOD_CALENDAR_YEAR).toString(),
    [YEAR]: getLatestYear(REVENUE, PERIOD_CALENDAR_YEAR),
    [MONTHLY]: 'Yearly',
    [BREAKOUT_BY]: 'source',
    [PRODUCT]: 'Oil (bbl)',
    [PERIOD_ALL_YEARS]: getAllYears(REVENUE, PERIOD_FISCAL_YEAR),

    dataTypesCache: {
	  [REVENUE]: {
        [DATA_TYPE]: REVENUE,
        [PERIOD]: PERIOD_FISCAL_YEAR,
        [FISCAL_YEAR]: getLatestYear(REVENUE, PERIOD_FISCAL_YEAR).toString(),
        [CALENDAR_YEAR]: getLatestYear(REVENUE, PERIOD_CALENDAR_YEAR).toString(),
        [OFFSHORE_REGIONS]: false,
        [MAP_LEVEL]: STATE,
        [YEAR]: getLatestYear(REVENUE, PERIOD_CALENDAR_YEAR),
        [MONTHLY]: 'Yearly',
        [BREAKOUT_BY]: 'source',
	      [PERIOD_ALL_YEARS]: getAllYears(REVENUE, PERIOD_FISCAL_YEAR),

	  },
	  [PRODUCTION]: {
        [DATA_TYPE]: PRODUCTION,
        [PERIOD]: PERIOD_FISCAL_YEAR,
        [FISCAL_YEAR]: getLatestYear(PRODUCTION, PERIOD_FISCAL_YEAR).toString(),
        [CALENDAR_YEAR]: getLatestYear(PRODUCTION, PERIOD_CALENDAR_YEAR).toString(),
        [OFFSHORE_REGIONS]: false,
        [MAP_LEVEL]: STATE,
        [YEAR]: getLatestYear(PRODUCTION, PERIOD_CALENDAR_YEAR),
        [MONTHLY]: 'Yearly',
        [PRODUCT]: 'Oil (bbl)',
	      [PERIOD_ALL_YEARS]: getAllYears(PRODUCTION, PERIOD_FISCAL_YEAR),
	  },
	  [DISBURSEMENT]: {
        [DATA_TYPE]: DISBURSEMENT,
        [GROUP_BY]: RECIPIENT,
        [PERIOD]: PERIOD_FISCAL_YEAR,
        [FISCAL_YEAR]: getLatestYear(DISBURSEMENT, PERIOD_FISCAL_YEAR).toString(),
        [OFFSHORE_REGIONS]: false,
        [MAP_LEVEL]: STATE,
        [YEAR]: getLatestYear(DISBURSEMENT, PERIOD_FISCAL_YEAR),
        [MONTHLY]: 'Yearly',
        [BREAKOUT_BY]: 'source',
	      [PERIOD_ALL_YEARS]: getAllYears(DISBURSEMENT, PERIOD_FISCAL_YEAR),
	  }
    }
  }
}

export { initialState, types, reducer }
