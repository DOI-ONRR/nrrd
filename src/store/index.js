import React, { useReducer } from 'react'

// Define Action Types
const GLOSSARY_TERM_SELECTED = 'GLOSSARY_TERM_SELECTED'

// Define Action Creators
export const glossaryTermSelected = (term, doOpen = true) => ({ type: GLOSSARY_TERM_SELECTED, payload: term, openGlossary: doOpen })

const reducer = (state, action) => {
  const { type, payload } = action

  console.log('State Update:', type)

  switch (type) {
  case 'GLOSSARY_TERM_SELECTED':
    return ({ ...state, glossaryTerm: payload.glossaryTerm, glossaryOpen: payload.glossaryOpen })
  case 'CARDS':
    return ({ ...state, cards: payload.cards })
  case 'YEAR':
    return ({ ...state, year: payload.year })

  default:
    return state
  }
}

const initialState = {
  cards: [{ fips: 99, abbrev: 'National', name: 'National', minimizeIcon: true, closeIcon: false }],
  count: 0,
  glossaryOpen: false,
  glossaryTerm: '',
  year: 2019,
  period: 'Fiscal Year'
}

const StoreContext = React.createContext(initialState)

function StoreProvider ({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export { StoreContext, StoreProvider }
