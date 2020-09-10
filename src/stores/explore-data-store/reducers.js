/**
 * Reducer define how to update the application state
 * Any logic should be defined in actions
 */

const types = Object.freeze({
  CARDS: 'CARDS',
  MAP_ZOOM: 'MAP_ZOOM',
  MAP_ACTIVE: 'MAP_ACTIVE'
})

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
  case types.CARDS:
    return ({ ...state, cards: payload.cards })
  case types.MAP_ZOOM:
    return ({ ...state, mapX: payload.mapZoom.mapX, mapY: payload.mapZoom.mapY, mapZoom: payload.mapZoom.mapZoom })
  case types.MAP_ACTIVE:
    return ({ ...state, mapActive: payload.mapActive })
  default:
    return state
  }
}

// Explore data initialState
const initialState = {
  cards: [],
  mapX: 150,
  mapY: 100,
  mapZoom: 0.75,
}

export { initialState, types, reducer }
