import React, { useContext } from 'react'
import { StoreContext } from '../../../store'

const Year = ({ location }) => {
  const { state } = useContext(StoreContext)
  const year = state.year

  return (
    <>
      {year &&
        year
      }
    </>
  )
}

export default Year
