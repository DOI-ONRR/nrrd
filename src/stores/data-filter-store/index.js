import React, { useReducer } from 'react'
import { useActions } from './actions.js'
import { initialState, reducer } from './reducers'

import {
  DATA_TYPE
} from '../../constants'

const DataFilterContext = React.createContext(initialState)

function DataFilterProvider ({ children, defaults, urlParams }) {
  let initialStateMerged = { ...(initialState[defaults] || {}) }
  // only update the initial state with url params if data type is available
  if (urlParams && urlParams[DATA_TYPE]) {
    const dataType = urlParams[DATA_TYPE]
    const payload = urlParams

    const prevCache = initialStateMerged.dataTypesCache || {}
    const prevForType = prevCache[dataType] || { ...initialStateMerged }

    const dataTypeCache = {
      ...prevForType,
      ...payload,
    }

    const updatedDataTypesCache = {
      ...prevCache,
      [dataType]: dataTypeCache,
    }

    initialStateMerged = {
      ...dataTypeCache,
      dataTypesCache: updatedDataTypesCache,
    }
  }

  const [state, dispatch] = useReducer(reducer, initialStateMerged)
  const actions = useActions(state, dispatch)

  return (
    <DataFilterContext.Provider value={{ state, ...actions }}>
      {children}
    </DataFilterContext.Provider>
  )
}

export { DataFilterContext, DataFilterProvider }
