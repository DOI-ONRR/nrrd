import React, { useContext, useEffect, useState } from 'react'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DISBURSEMENT, DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import { fetchDataFilterFromUrl } from '../../../../js/utils'

export default ({ children }) => {
  const { state: filterData, updateDataFilter } = useContext(DataFilterContext)
  const type = filterData[DFC.DATA_TYPE]

  const [urlParams] = useState(fetchDataFilterFromUrl())
  useEffect(() => {
    if (Object.keys(urlParams).length > 0) {
      updateDataFilter(urlParams)
    }
  }, [urlParams])

  return (
    <>
      { type === DISBURSEMENT && children }
    </>
  )
}
