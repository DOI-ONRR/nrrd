import React, { useContext } from 'react'

import { DataFilterContext } from '../../stores/data-filter-store'

const ContextDisplay = ({ params, children }) => {
  const { state } = useContext(DataFilterContext)
  if (!state) {
    throw new Error('Data Filter Context has an undefined state. Please verify you have the Data Filter Provider included in your page or component.')
  }

  const isEqual = () => {
    let equal = true
    const urlSearchParams = new URLSearchParams(params)

    for (const searchParam of urlSearchParams.entries()) {
      if (equal) {
        equal = (searchParam[1] === state[searchParam[0]])
      }
    }

    return equal
  }

  return (
    <React.Fragment>
      {isEqual() &&
        <React.Fragment>
          { children }
        </React.Fragment>
      }
    </React.Fragment>
  )
}

export default ContextDisplay
