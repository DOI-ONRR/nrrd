import React, { useReducer, useEffect } from 'react'
import { useActions } from './actions.js'
import { initialState, reducer } from './reducers'

const GlossaryContext = React.createContext(initialState)

function GlossaryProvider ({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const actions = useActions(state, dispatch)

  // Log new state
  useEffect(() => console.log('GlossaryProvider', { newState: state }), [state])

  return (
    <GlossaryContext.Provider value={{ state, ...actions }}>
      {children}
    </GlossaryContext.Provider>
  )
}

export { GlossaryContext, GlossaryProvider }
