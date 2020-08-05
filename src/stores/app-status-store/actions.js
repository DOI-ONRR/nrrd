/**
 * This defines actions used to mutate global state
 * @param {Object} state
 * @param {function} dispatch
 */
import { types } from './reducers'

export const useActions = (state, dispatch) => {
  const updateLoadingStatus = ({ id, status, message = 'Loading...' }) => {
    if (status) {
      dispatch({ type: types.ADD_LOADING_MESSAGE, payload: { message: message } })
    }
    if (!status) {
      dispatch({ type: types.DELETE_LOADING_MESSAGE, payload: { message: message } })
    }
  }
  const showErrorMessage = (message = 'An error has occurred.') => {
    console.error(message)
    dispatch({ type: types.SHOW_ERROR_MESSAGE, payload: { isError: true, message: message } })
  }
  const deleteErrorMessage = (message = 'An error has occurred.') => {
    console.error(message)
    dispatch({ type: types.DELETE_ERROR_MESSAGE, payload: { isError: false, message: undefined } })
  }

  return {
    updateLoadingStatus,
    showErrorMessage,
    deleteErrorMessage
  }
}
