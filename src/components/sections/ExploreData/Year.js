import React, { useContext } from 'react'
import { StoreContext } from '../../../store'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const Year = ({ location }) => {
  const { state } = useContext(DataFilterContext)
  const year = state[DFC.YEAR]

  return (
    <>
      {year &&
        year
      }
    </>
  )
}

export default Year
