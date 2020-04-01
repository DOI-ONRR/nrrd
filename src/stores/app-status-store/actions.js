/**
 * This defines actions used to mutate global state
 * @param {Object} state
 * @param {function} dispatch
 */

import { types } from './reducers'

export const useActions = (state, dispatch) => {
  const updateLoadingStatus = status => {
    console.log('sdjfhsjkhfdsjfasdkfdskjf ', status)
    dispatch({ type: types.UPDATE_LOADING_STATUS, payload: { isLoading: status } })
  }

  return {
    updateLoadingStatus,
  }
}
