import React, { useReducer } from 'react'

// Define Action Types
const GLOSSARY_TERM_SELECTED = 'GLOSSARY_TERM_SELECTED'

// Define Action Creators
export const glossaryTermSelected = (term, doOpen = true) => ({ type: GLOSSARY_TERM_SELECTED, payload: term, openGlossary: doOpen })

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
  case 'GLOSSARY_TERM_SELECTED':
    return ({ ...state, glossaryTerm: payload.glossaryTerm, glossaryOpen: payload.glossaryOpen })
  case 'COUNT':
    return ({ ...state, count: payload })
  case 'CARDS':
    return ({ ...state, cards: payload.cards })
  case 'YEAR':
    return ({ ...state, year: payload.year })
  case 'COUNTY_LEVEL':
    return ({ ...state, countyLevel: payload.countyLevel })
  default:
    return state
  }
}

const initialState = {
  cards: [{fips: 99, abbrev: 'National', name: 'National', minimizeIcon:true, closeIcon: false}],
  count: 0,
  glossaryOpen: false,
  glossaryTerm: '',
  year: 2019,
  countyLevel: false,
}

const StoreContext = React.createContext(initialState)

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export { StoreContext, StoreProvider }

