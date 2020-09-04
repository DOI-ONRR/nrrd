import React, { useReducer } from 'react'
import { initialState, reducer } from './reducers'
import { useActions } from './actions'

const ExploreDataContext = React.createContext(initialState)

function ExploreDataProvider ({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const actions = useActions(state, dispatch)

  return (
    <ExploreDataContext.Provider value={{ state, ...actions }}>
      {children}
    </ExploreDataContext.Provider>
  )
}

export { ExploreDataContext, ExploreDataProvider }
