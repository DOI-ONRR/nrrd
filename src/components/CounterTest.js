import React, { useContext } from 'react'
import { StoreContext } from '../store'
import Button from '@material-ui/core/Button'

const CounterTest = () => {
  const { state, dispatch } = useContext(StoreContext)

  const incrementCount = (increment) => {
    return state.count + increment
  }

  const count = (inc) => {
    dispatch({ type: 'COUNT', payload: incrementCount(inc) })
  }

  return (
    <div className="Counter">
      <p>
        Count:
        {state.count}
      </p>
      <Button onClick={(e) => count(5)}>
        +1 to global
      </Button>
    </div>
  )
}

export default CounterTest
