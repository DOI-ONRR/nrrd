import React from 'react'

import { DataFilterProvider } from '../../stores/data-filter-store'
import { fetchDataFilterFromUrl } from '../../js/utils'

const DataFilterProviderWrapper = ({ children, defaults }) => {
  return (
    <DataFilterProvider defaults={defaults} urlParams={fetchDataFilterFromUrl()}>
      {children}
    </DataFilterProvider>
  )
}

export default DataFilterProviderWrapper
