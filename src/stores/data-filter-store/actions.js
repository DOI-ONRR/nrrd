/**
 * This defines actions used to mutate global state
 * @param {Object} state
 * @param {function} dispatch
 */

import { types } from './reducers'

export const useActions = (state, dispatch) => {
  const updateDataFilter = updatedFilter => {
    let params = ''
    // omit the following properties, might be better to store location ids in comma seperated list
    const propsToExclude = [
      'arcs',
      'cards',
      'counties',
      'commodity',
      'geometry',
      'id',
      'offshoreRegions',
      'period',
      'properties',
      'type',
      'year',
      'dataTypesCache'
    ]

    /* if (typeof window !== 'undefined' && window && Object.keys(updatedFilter).length > 0) {
      for (const prop in updatedFilter) {
        if (updatedFilter[prop] && !propsToExclude.includes(prop) && prop !== '') {
          if (params.length > 0) {
            params = params.concat('&')
          }
          params = params.concat(prop, '=', updatedFilter[prop])
        }
      }
      window.history.replaceState({}, '', `${ window.location.pathname }?${ params }`)
    } */

    dispatch({ type: types.UPDATE_DATA_FILTER, payload: updatedFilter })
  }

  return {
    updateDataFilter,
  }
}