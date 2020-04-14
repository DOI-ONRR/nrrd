/**
 * Reducer define how to update the application state
 * Any logic should be defined in actions
 */

const types = Object.freeze({
  UPDATE_DATA_FILTER: 'UPDATE_DATA_FILTER',
})

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
  case types.UPDATE_DATA_FILTER: {
    const dataType = payload.dataType || state.dataType
    // state.dataTypesCache = state.dataTypesCache || {}

    // if (payload.dataType !== undefined && payload.dataType !== state.dataType) {
    const dataTypeCache = Object.assign({ ...initialState }, { ...payload })
    const updatedDataTypesCache = Object.assign((state.dataTypesCache || {}), { [dataType]: { ...dataTypeCache } })
    console.log(state, dataTypeCache)
    return ({ dataTypesCache: { ...updatedDataTypesCache }, ...dataTypeCache, dataType: dataType })
    // }

    // return ({ ...state, dataTypesCache: { [dataType]: { ...payload } }, ...payload })
  }
  default:
    return state
  }
}

const initialState = {
  dataType: 'Revenue',
  period: 'Calendar Year',
}

export { initialState, types, reducer }
