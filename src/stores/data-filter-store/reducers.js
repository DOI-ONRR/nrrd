/**
 * Reducer define how to update the application state
 * Any business logic should be defined in actions
 */

import {
  REVENUE,
  REVENUE_TYPE,
  PRODUCTION,
  COUNTIES,
  DISBURSEMENT,
  RECIPIENT,
  GROUP_BY,
  GROUP_BY_STICKY,
  BREAKOUT_BY,
  ADDITIONAL_COLUMNS,
  PERIOD,
  FISCAL_YEAR,
  CALENDAR_YEAR,
  DATA_TYPE,
  QUERY_TABLE_FILTER_DEFAULT,
  EXPLORE_DATA_FILTER_DEFAULT,
  OFFSHORE_REGIONS,
  YEAR,
  LAND_TYPE,
  PRODUCT,
  MAP_LEVEL,
  STATE
} from '../../constants'

const types = Object.freeze({
  UPDATE_DATA_FILTER: 'UPDATE_DATA_FILTER',
})

const reducer = (state, action) => {
  const { type, payload } = action
  console.log('Data Filer Provider action', type, payload)
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
    [PERIOD]: 'Fiscal Year',
    [FISCAL_YEAR]: '2017,2018,2019',
    [CALENDAR_YEAR]: '2017,2018,2019',
    dataTypesCache: {
      [REVENUE]: {
        [DATA_TYPE]: REVENUE,
        [GROUP_BY]: REVENUE_TYPE,
        [PERIOD]: 'Fiscal Year',
        [FISCAL_YEAR]: '2017,2018,2019',
        [CALENDAR_YEAR]: '2017,2018,2019',
      },
      [PRODUCTION]: {
        [DATA_TYPE]: PRODUCTION,
        [GROUP_BY_STICKY]: PRODUCT,
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
  },
  [EXPLORE_DATA_FILTER_DEFAULT]: {
    [DATA_TYPE]: REVENUE,
    [PERIOD]: 'Fiscal Year',
    [FISCAL_YEAR]: '2019',
    [CALENDAR_YEAR]: '2019',
    [OFFSHORE_REGIONS]: false,
    [MAP_LEVEL]: STATE,
    [YEAR]: 2019,
    dataTypesCache: {
      [REVENUE]: {
        [DATA_TYPE]: REVENUE,
        [PERIOD]: 'Fiscal Year',
        [FISCAL_YEAR]: '2019',
        [CALENDAR_YEAR]: '2019',
        [OFFSHORE_REGIONS]: false,
        [MAP_LEVEL]: STATE,
        [YEAR]: 2019,
      },
      [PRODUCTION]: {
        [DATA_TYPE]: PRODUCTION,
        [PERIOD]: 'Fiscal Year',
        [FISCAL_YEAR]: '2019',
        [CALENDAR_YEAR]: '2018',
        [OFFSHORE_REGIONS]: false,
        [MAP_LEVEL]: STATE,
        [YEAR]: 2019,
      },
      [DISBURSEMENT]: {
        [DATA_TYPE]: DISBURSEMENT,
        [GROUP_BY]: RECIPIENT,
        [PERIOD]: 'Fiscal Year',
        [FISCAL_YEAR]: '2019',
        [OFFSHORE_REGIONS]: false,
        [MAP_LEVEL]: STATE,
        [YEAR]: 2019,
      }
    }
  }
}

export { initialState, types, reducer }
