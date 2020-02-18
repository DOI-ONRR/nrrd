import React, { useContext } from 'react'

import { DataFilterContext } from '../../stores/data-filter-store'

const ContextDisplay = ({ params, children }) => {
  const { state } = useContext(DataFilterContext)

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
