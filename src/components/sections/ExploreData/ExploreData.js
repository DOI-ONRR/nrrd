import React, {useContext }  from 'react'
import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const ExploreData = props => {
  const { state: filterState, updateDataFilter } = useContext(DataFilterContext)

  if (!filterState[DFC.DATA_TYPE]) {
    updateDataFilter({ ...filterState, [DFC.DATA_TYPE]: 'Revenue' })
  }

  return (
    <>
      {props.children}
    </>
  )
}

export default ExploreData
