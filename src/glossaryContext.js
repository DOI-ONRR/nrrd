import React, { useReducer } from 'react'

const reducer = (state, action) => {
  switch (action.type) {
    case 'GLOSSARY_TERM_SELECTED':
      return { ...state, glossaryTerm: action.glossaryTerm, glossaryOpen: action.glossaryOpen }
    default:
      return { ...state }
  }
}

const initialState = { 
  glossaryTerm: '',
  glossaryOpen: false
}

const GlossaryContext = React.createContext(initialState)

function GlossaryProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <GlossaryContext.Provider value={{ state, dispatch }}>
      {children}
    </GlossaryContext.Provider>
  )
}

export { GlossaryContext, GlossaryProvider }