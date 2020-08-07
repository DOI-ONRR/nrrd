/**
 * This defines actions used to mutate global state
 * @param {Object} state
 * @param {function} dispatch
 */

import { types } from './reducers'

export const useActions = (state, dispatch) => {
  const updateDataFilter = updatedFilter =>
    dispatch({ type: types.UPDATE_DATA_FILTER, payload: updatedFilter })

  const updateQueryDataFilterCounts = updatedCounts =>
    dispatch({ type: types.UPDATE_QUERY_DATA_FILTER_COUNTS, payload: updatedCounts })

  const clearAllFilters = () =>
    dispatch({ type: types.CLEAR_ALL_FILTERS })

  return {
    updateDataFilter,
    updateQueryDataFilterCounts,
    clearAllFilters
  }
}
