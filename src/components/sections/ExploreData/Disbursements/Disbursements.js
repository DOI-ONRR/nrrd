import React, { useContext, useEffect, useState } from 'react'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DISBURSEMENTS, DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import { fetchDataFilterFromUrl } from '../../../../js/utils'

export default ({ children }) => {
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const type = state[DFC.DATA_TYPE]

  const [urlParams] = useState(fetchDataFilterFromUrl())
  useEffect(() => {
    if (Object.keys(urlParams).length > 0) {
      updateDataFilter(urlParams)
    }
  }, [urlParams])

  return (
    <>
      { type === DISBURSEMENTS && children }
    </>
  )
}
