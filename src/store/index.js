import React, { useReducer, useEffect } from 'react'
import { useActions } from './actions.js'
import { initialState, reducer } from './reducers'

const StoreContext = React.createContext(initialState)

function StoreProvider ({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const actions = useActions(state, dispatch)

  // Log new state
  useEffect(() => console.debug({ newState: state }), [state])

  return (
    <StoreContext.Provider value={{ state, dispatch, ...actions }}>
      {children}
    </StoreContext.Provider>
  )
}

export { StoreContext, StoreProvider }
