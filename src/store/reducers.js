/**
 * Reducer define how to update the application state
 * Any logic should be defined in actions
 */

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
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
  default:
    return state
  }
}

const initialState = {
  cards: [{ fips: 99, abbr: 'Nationwide Federal', name: 'Nationwide Federal', minimizeIcon: false, closeIcon: true }],
  count: 0,
  countyLevel: false,
  mapX: 0,
  mapY: 0,
  mapZoom: 0.75,
  period: 'Fiscal Year',
  year: 2019,
}

export { initialState, reducer }
