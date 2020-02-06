/**
 * Reducer define how to update the application state
 * Any logic should be defined in actions
 */

import GLOSSARY_TERMS_YAML from '../../data/terms.yml'

const types = Object.freeze({
  GLOSSARY_TERM_SELECTED: 'GLOSSARY_TERM_SELECTED',
})

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
  case types.GLOSSARY_TERM_SELECTED:
    return ({ ...state, glossaryTerm: payload.glossaryTerm, glossaryOpen: payload.glossaryOpen })
  default:
    return state
  }
}

const initialState = {
  glossaryTerms: GLOSSARY_TERMS_YAML,
  glossaryOpen: false,
  glossaryTerm: '',
}

export { initialState, types, reducer }
