import React, { useContext, useEffect, useState } from 'react'

import { DataFilterContext, DataFilterProvider } from '../../stores/data-filter-store'
import { fetchDataFilterFromUrl } from '../../js/utils'

const DataFilterProviderWrapper = ({ children, defaults }) => {
  return (
    <DataFilterProvider defaults={defaults}>
      <DataFilterFromUrlWrapper />
      {children}
    </DataFilterProvider>
  )
}

export default DataFilterProviderWrapper

/**
 * This is component handles gettin all data filter info when the page loads and updating the data filter context.
 * All components will then have the default context when the page loads.
 */
const DataFilterFromUrlWrapper = () => {
  const [urlParams] = useState(fetchDataFilterFromUrl())
  useEffect(() => {
    if (Object.keys(urlParams).length > 0) {
      updateDataFilter(urlParams)
    }
  }, [urlParams])

  const { updateDataFilter } = useContext(DataFilterContext)

  return (<React.Fragment />)
}
