import React, { useReducer, useEffect } from 'react'
import { useActions } from './actions.js'
import { initialState, reducer } from './reducers'
import {
  DATA_TYPE
} from '../../constants'

const DataFilterContext = React.createContext(initialState)

function DataFilterProvider ({ children, defaults }) {
  const [state, dispatch] = useReducer(reducer, (initialState[defaults] || {}))
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
