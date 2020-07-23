import React, { useReducer, useEffect } from 'react'
import { useActions } from './actions.js'
import { initialState, reducer } from './reducers'

import {
  DATA_TYPE
} from '../../constants'

const DataFilterContext = React.createContext(initialState)

function DataFilterProvider ({ children, defaults, urlParams }) {
  let initialStateMerged = (initialState[defaults] || {})
  // only update the initial state with url params if data type is available
  if (urlParams && urlParams[DATA_TYPE]) {
    const dataType = urlParams[DATA_TYPE]
    const payload = urlParams

    const dataTypeCache = Object.assign(((initialStateMerged.dataTypesCache && initialStateMerged.dataTypesCache[dataType]) || { ...initialStateMerged }), { ...payload })

    const updatedDataTypesCache = Object.assign((initialStateMerged.dataTypesCache || {}), { [dataType]: { ...dataTypeCache } })

    initialStateMerged = ({ dataTypesCache: { ...updatedDataTypesCache }, ...dataTypeCache })
  }

  const [state, dispatch] = useReducer(reducer, initialStateMerged)
  const actions = useActions(state, dispatch)

  // Log new state
  useEffect(() => {
    console.log('DataFilterProvider newState: ', state)
  }, [state])

  return (
    <DataFilterContext.Provider value={{ state, ...actions }}>
      {children}
    </DataFilterContext.Provider>
  )
}

export { DataFilterContext, DataFilterProvider }
