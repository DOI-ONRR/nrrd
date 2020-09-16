/**
 * This defines actions used to mutate global state
 * @param {Object} state
 * @param {function} dispatch
 */

import { types } from './reducers'

export const useActions = (state, dispatch) => {
  const updateExploreDataCards = updatedCards =>
    dispatch({ type: types.CARDS, payload: updatedCards })

  const updateExploreDataMapZoom = updatedMapZoom =>
    dispatch({ type: types.MAP_ZOOM, payload: updatedMapZoom })

  return {
    updateExploreDataCards,
    updateExploreDataMapZoom
  }
}
