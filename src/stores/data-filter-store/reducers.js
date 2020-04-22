/**
 * Reducer define how to update the application state
 * Any logic should be defined in actions
 */

import { REVENUE, DATA_FILTER_CONSTANTS as DFC } from '../../constants'
import CONSTANTS from '../../js/constants'

const types = Object.freeze({
  UPDATE_DATA_FILTER: 'UPDATE_DATA_FILTER',
})

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
  case types.UPDATE_DATA_FILTER:
    return ({ ...state, ...payload })
  default:
    return state
  }
}

const initialState = {
  [DFC.DATA_TYPE]: REVENUE,
  [DFC.OFFSHORE_REGIONS]: 'Off',
  [DFC.COUNTIES]: 'State',
  [DFC.COMMODITY]: CONSTANTS.OIL,
  [DFC.PERIOD]: CONSTANTS.FISCAL_YEAR,
  [DFC.YEAR]: 2019,
  [DFC.CARDS]: [{ fips: 99, abbr: 'Nationwide Federal', name: 'Nationwide Federal', minimizeIcon: false, closeIcon: true }],
}

export { initialState, types, reducer }
