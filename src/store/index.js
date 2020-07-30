import React, { useReducer, useEffect } from 'react'
import { initialState, reducer } from './reducers'

const StoreContext = React.createContext(initialState)

function StoreProvider ({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Log new state
  useEffect(() => {
    // console.debug({ newState: state })
  }, [state])

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export { StoreContext, StoreProvider }
