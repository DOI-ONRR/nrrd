/**
 * Reducer define how to update the application state
 * Any logic should be defined in actions
 */

const reducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
  case 'COMMODITY':
    return ({ ...state, commodity: payload.commodity })
  case 'COUNT':
    return ({ ...state, count: payload })
  case 'CARDS':
    return ({ ...state, cards: payload.cards })
  case 'YEAR':
    return ({ ...state, year: payload.year })
  case 'COUNTY_LEVEL':
    return ({ ...state, countyLevel: payload.countyLevel })
  case 'OFFSHORE_DATA':
    return ({ ...state, offshoreData: payload.offshoreData })
  case 'DATA_TYPE':
    return ({ ...state, dataType: payload.dataType })
  case 'MAP_ZOOM':
    return ({ ...state, mapX: payload.mapX, mapY: payload.mapY, mapZoom: payload.mapZoom })
  default:
    return state
  }
}

const initialState = {
  cards: [],
  commodity: 'Oil',
  count: 0,
  countyLevel: 'State',
  dataType: 'Revenue',
  mapX: 0,
  mapY: 0,
  mapZoom: 0.75,
  offshoreData: 'Off',
  period: 'Fiscal Year',
  year: 2019,
}

export { initialState, reducer }
