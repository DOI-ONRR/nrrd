export const initCounterState = {
  counter: 0
}

export const counterReducer = (state, action) => {
  const { type, payload } = action
  switch(type) {
    case 'INCREMENT': {
      return {
        counter: payload.counter + 1
      }
    }
    case 'DECREMENT': {
      return {
        counter: payload.counter - 1
      }
    }
    default: 
      return state
  }
}