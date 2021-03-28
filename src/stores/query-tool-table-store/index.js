import React, { useReducer } from 'react'
import { useActions } from './actions.js'
import { initialState, reducer } from './reducers'

const QueryToolTableContext = React.createContext(initialState)

function QueryToolTableProvider ({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const actions = useActions(state, dispatch)

  return (
    <QueryToolTableContext.Provider value={{ state, ...actions }}>
      {children}
    </QueryToolTableContext.Provider>
  )
}

export { QueryToolTableContext, QueryToolTableProvider }
