import React, { useReducer, useEffect } from 'react'
import { useActions } from './actions.js'
import { initialState, reducer } from './reducers'

const DownloadContext = React.createContext(initialState)

function DownloadProvider ({ children, defaults }) {
  const [state, dispatch] = useReducer(reducer, (initialState[defaults] || {}))
  const actions = useActions(state, dispatch)

  // Log new state
  // useEffect(() => console.log('DownloadProvider', state), [state])

  return (
    <DownloadContext.Provider value={{ state, ...actions }}>
      {children}
    </DownloadContext.Provider>
  )
}

export { DownloadContext, DownloadProvider }
