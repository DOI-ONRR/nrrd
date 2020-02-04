/**
 * This defines actions used to mutate global state
 * @param {Object} state
 * @param {function} dispatch
 */

import { types } from './reducers'

export const useActions = (state, dispatch) => {
  const setGlossaryTermSelected = term => {
    if (state.glossaryTerms.find(termItem => termItem.name.toLowerCase() === term.toLowerCase())) {
      dispatch({ type: types.GLOSSARY_TERM_SELECTED, payload: { glossaryTerm: term, glossaryOpen: true } })
    }
    else {
      console.error('Term not found in glossary:', term)
    }
  }

  const updateDataFilter = updatedFilter => {
    let params = ''
    if(updatedFilter) {
      console.log(typeof updatedFilter)
    }
    
    if (typeof window !== 'undefined' && window) {
      console.log(JSON.stringify(updatedFilter))
      //params = updatedFilter.keys().forEach(key => params.concat(key, '=', updatedFilter[key]))
      //window.history.replaceState({}, '', `${ window.location.pathname }?${ params }`)
    }

    dispatch({ type: types.UPDATE_DATA_FILTER, payload: updatedFilter })
  }

  return {
    setGlossaryTermSelected,
    updateDataFilter,
  }
}
