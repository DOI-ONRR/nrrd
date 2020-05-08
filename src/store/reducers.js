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
  case 'MAP_ACTIVE':
    return ({ ...state, mapActive: payload.mapActive })
  default:
    return state
  }
}

const initialState = {
  cards: [],
  mapX: 0,
  mapY: 0,
  mapZoom: 0.75,
}

export { initialState, reducer }
