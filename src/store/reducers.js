/**
 * Reducer define how to update the application state
 * Any logic should be defined in actions
 */

import GLOSSARY_TERMS_YAML from '../data/terms.yml'

const types = Object.freeze({
  GLOSSARY_TERM_SELECTED: 'GLOSSARY_TERM_SELECTED',
  UPDATE_DATA_FILTER: 'UPDATE_DATA_FILTER',
})

const reducer = (state, action) => {
  const { type, payload } = action

  console.log('State Update:', action)

  switch (type) {
  case types.GLOSSARY_TERM_SELECTED:
    return ({ ...state, glossaryTerm: payload.glossaryTerm, glossaryOpen: payload.glossaryOpen })
  case 'COUNT':
    return ({ ...state, count: payload })
  case 'CARDS':
    return ({ ...state, cards: payload.cards })
  case 'YEAR':
    return ({ ...state, year: payload.year })
  case 'COUNTY_LEVEL':
    return ({ ...state, countyLevel: payload.countyLevel })
  case 'OFFSHORE':
    return ({ ...state, offShore: payload.offshore })
  case 'MAP_ZOOM':
    return ({ ...state, mapX: payload.mapX, mapY: payload.mapY, mapZoom: payload.mapZoom })
  case types.UPDATE_DATA_FILTER:
    return ({ ...state })
  default:
    return state
  }
}

const initialState = {
  glossaryTerms: GLOSSARY_TERMS_YAML,
  cards: [{ fips: 99, abbrev: 'National', name: 'National', minimizeIcon: true, closeIcon: false }],
  count: 0,
  countyLevel: false,
  glossaryOpen: false,
  glossaryTerm: '',
  mapX: 0,
  mapY: 0,
  mapZoom: 0.75,
  period: 'Fiscal Year',
  year: 2019,
  dataFilter: undefined,
}

export { initialState, types, reducer }
