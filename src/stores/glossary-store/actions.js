/**
 * This defines actions used to mutate global state
 * @param {Object} state
 * @param {function} dispatch
 */

import { types } from './reducers'

export const useActions = (state, dispatch) => {
  const setGlossaryTermSelected = term => {
    if (term) {
      if (state.glossaryTerms.find(termItem => termItem.name.toLowerCase() === term.toLowerCase())) {
        dispatch({ type: types.GLOSSARY_TERM_SELECTED, payload: { glossaryTerm: term, glossaryOpen: true } })
      }
      else {
        console.error('Term not found in glossary ', term)
      }
    }
  }

  const toggleGlossaryDrawer = () => {
    dispatch({ type: types.GLOSSARY_TERM_SELECTED, payload: { glossaryTerm: undefined, glossaryOpen: !state.glossaryOpen } })
  }

  return {
    setGlossaryTermSelected,
    toggleGlossaryDrawer
  }
}
