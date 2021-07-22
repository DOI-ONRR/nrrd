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
  cards: [
    {
      fipsCode: 'NF',
      name: 'Nationwide Federal',
      locationName: 'Nationwide Federal',
      state: 'Nationwide Federal',
      regionType: '',
      districtType: undefined,
      county: ''
    },
    {
      fipsCode: 'NA',
      name: 'Native American',
      locationName: 'Native American',
      state: 'Native American',
      regionType: '',
      districtType: undefined,
      county: ''
    }
  ],
  mapX: -180,
  mapY: -80,
  mapZoom: 1.25,
}

export { initialState, types, reducer }
