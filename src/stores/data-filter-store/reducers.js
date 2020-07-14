/**
 * Reducer define how to update the application state
 * Any business logic should be defined in actions
 */

import {
  REVENUE,
  REVENUE_TYPE,
  PRODUCTION,
  COMMODITY,
  DISBURSEMENT,
  RECIPIENT,
  GROUP_BY,
  PERIOD,
  FISCAL_YEAR,
  CALENDAR_YEAR,
  DATA_TYPE,
  QUERY_TABLE_FILTER_DEFAULT,
  BREAKOUT_BY,
  LAND_TYPE,
  PRODUCT
} from '../../constants'
import CONSTANTS from '../../js/constants'

const types = Object.freeze({
  UPDATE_DATA_FILTER: 'UPDATE_DATA_FILTER',
})

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
  case types.UPDATE_DATA_FILTER: {
    const dataType = payload.dataType || state.dataType

    const dataTypeCache = Object.assign(((state.dataTypesCache && state.dataTypesCache[dataType]) || { ...initialState }), { ...payload })

    const updatedDataTypesCache = Object.assign((state.dataTypesCache || {}), { [dataType]: { ...dataTypeCache } })

    return ({ dataTypesCache: { ...updatedDataTypesCache }, ...dataTypeCache })
  }
  default:
    return state
  }
}

const initialState = {
  [QUERY_TABLE_FILTER_DEFAULT]: {
    [DATA_TYPE]: REVENUE,
    [GROUP_BY]: REVENUE_TYPE,
    [BREAKOUT_BY]: COMMODITY,
    [PERIOD]: 'Fiscal Year',
    [FISCAL_YEAR]: '2017,2018,2019',
    [CALENDAR_YEAR]: '2017,2018,2019',
    dataTypesCache: {
      [REVENUE]: {
        [DATA_TYPE]: REVENUE,
        [GROUP_BY]: REVENUE_TYPE,
        [PERIOD]: 'Fiscal Year',
        [FISCAL_YEAR]: '2017,2018,2019',
        [CALENDAR_YEAR]: '2017,2018,2019'
      },
      [PRODUCTION]: {
        [DATA_TYPE]: PRODUCTION,
        [GROUP_BY]: PRODUCT,
        [PERIOD]: 'Fiscal Year',
        [FISCAL_YEAR]: '2017,2018,2019',
        [CALENDAR_YEAR]: '2016,2017,2018'
      },
      [DISBURSEMENT]: {
        [DATA_TYPE]: DISBURSEMENT,
        [GROUP_BY]: RECIPIENT,
        [PERIOD]: 'Fiscal Year',
        [FISCAL_YEAR]: '2017,2018,2019',
      }
    }
  }
}

export { initialState, types, reducer }
