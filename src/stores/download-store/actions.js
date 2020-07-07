/**
 * This defines actions used to mutate global state
 * @param {Object} state
 * @param {function} dispatch
 */
import { types } from './reducers'

export const useActions = (state, dispatch) => {
  const addDownloadData = payload => {
    console.log('addDownloadData', payload)
    dispatch({ type: types.ADD_DOWNLOAD_DATA, payload: payload })
  }

  return {
    addDownloadData,
  }
}
