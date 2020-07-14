/**
 * Reducer define how to update the application state
 * Any logic should be defined in actions
 */

const types = Object.freeze({
  ADD_DOWNLOAD_DATA: 'ADD_DOWNLOAD_DATA',
})

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
  case types.ADD_DOWNLOAD_DATA:
    return ({ ...state, [payload.key]: payload.data })
  default:
    return state
  }
}

const initialState = {}

export { initialState, types, reducer }
