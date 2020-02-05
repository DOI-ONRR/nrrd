/**
 * Reducer define how to update the application state
 * Any logic should be defined in actions
 */

const types = Object.freeze({
  UPDATE_DATA_FILTER: 'UPDATE_DATA_FILTER',
})

const reducer = (state, action) => {
  const { type, payload } = action

  console.log('State Update:', action)

  switch (type) {
  case types.UPDATE_DATA_FILTER:
    return ({ ...state, ...payload })
  default:
    return state
  }
}

const initialState = {
  dataFilter: undefined,
}

export { initialState, types, reducer }
