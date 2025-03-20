/**
 * Reducer define how to update the application state
 * Any logic should be defined in actions
 */

const types = Object.freeze({
  ADD_LOADING_MESSAGE: 'ADD_LOADING_MESSAGE',
  DELETE_LOADING_MESSAGE: 'DELETE_LOADING_MESSAGE',
  SHOW_ERROR_MESSAGE: 'SHOW_ERROR_MESSAGE',
  DELETE_ERROR_MESSAGE: 'DELETE_ERROR_MESSAGE',
})

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
    case types.SHOW_ERROR_MESSAGE:
      return ({ ...state, ...payload })
    case types.DELETE_ERROR_MESSAGE:
      return ({ ...state, ...payload })
    default:
      return state
  }
}

const initialState = {
  loadingMessages: []
}

export { initialState, types, reducer }
