import React, { useReducer, useEffect } from 'react'
import { useActions } from './actions.js'
import { initialState, reducer } from './reducers'

const DataFilterContext = React.createContext(initialState)

function DataFilterProvider ({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const actions = useActions(state, dispatch)

  // Log new state
  useEffect(() => console.log('DataFilterProvider', { newState: state }), [state])
  console.log(actions)
  return (
    <DataFilterContext.Provider value={{ state, dispatch, ...actions }}>
      {children}
    </DataFilterContext.Provider>
  )
}

export { DataFilterContext, DataFilterProvider }
