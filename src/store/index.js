import React, { useReducer, useCallback } from 'react'

const reducer = (state, action) => {
  const { type, payload } = action
  console.log('type: ', type)
  console.log('payload: ', payload)
  console.log('action: ', action)
  switch (type) {
    case 'GLOSSARY_TERM_SELECTED':
      return ({ ...state, glossaryTerm: action.glossaryTerm, glossaryOpen: action.glossaryOpen })
    case 'COUNT':
      return ({ ...state, count: payload })
    case 'CARDS': 
      return ({ ...state, cards: action.cards })
    case 'YEAR': 
      return ({ ...state, year: action.year })

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

