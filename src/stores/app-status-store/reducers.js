/**
 * Reducer define how to update the application state
 * Any logic should be defined in actions
 */

const types = Object.freeze({
  UPDATE_LOADING_STATUS: 'UPDATE_LOADING_STATUS',
})

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
  case types.UPDATE_LOADING_STATUS:
    return ({ ...state, ...payload })
  default:
    return state
  }
}

const initialState = {}

export { initialState, types, reducer }
