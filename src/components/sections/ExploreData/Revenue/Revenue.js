import React, { useContext, useEffect, useState } from 'react'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { REVENUE, DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import { fetchDataFilterFromUrl } from '../../../../js/utils'

export default ({ children }) => {
  const { state: filterState, updateDataFilter } = useContext(DataFilterContext)
  const type = filterState[DFC.DATA_TYPE]

  const [urlParams] = useState(fetchDataFilterFromUrl())
  useEffect(() => {
    if (Object.keys(urlParams).length > 0) {
      updateDataFilter(urlParams)
    }
  }, [urlParams])

  return (
    <>
      { type === REVENUE && children }
    </>
  )
}
