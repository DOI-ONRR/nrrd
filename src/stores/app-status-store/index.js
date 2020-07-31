import React, { useReducer } from 'react'
import { useActions } from './actions.js'
import { initialState, reducer } from './reducers'

const AppStatusContext = React.createContext(initialState)

function AppStatusProvider ({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const actions = useActions(state, dispatch)

  return (
    <AppStatusContext.Provider value={{ state, ...actions }}>
      {children}
    </AppStatusContext.Provider>
  )
}

export { AppStatusContext, AppStatusProvider }
