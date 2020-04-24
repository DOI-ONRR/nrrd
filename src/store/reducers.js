/**
 * Reducer define how to update the application state
 * Any logic should be defined in actions
 */

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
  case 'CARDS':
    return ({ ...state, cards: payload })
  case 'MAP_ZOOM':
    return ({ ...state, mapX: payload.mapX, mapY: payload.mapY, mapZoom: payload.mapZoom })
  default:
    return state
  }
}

const initialState = {
  cards: [{ fips: 99, abbr: 'Nationwide Federal', name: 'Nationwide Federal', minimizeIcon: false, closeIcon: true }],
  mapX: 0,
  mapY: 0,
  mapZoom: 0.75,
}

export { initialState, reducer }
