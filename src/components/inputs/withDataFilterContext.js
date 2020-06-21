import React, { useContext } from 'react'

import { DataFilterContext } from '../../stores/data-filter-store'

const withDataFilterContext = (BaseComponent, dataFilterKey) => ({ ...props }) => {
  const { state, updateDataFilter } = useContext(DataFilterContext)

  const handleChange = newValue => {
    updateDataFilter({ [dataFilterKey]: (newValue === '') ? undefined : newValue })
  }

  return (
    <BaseComponent onChange={handleChange} defaultSelected={state[dataFilterKey]} {...props} />
  )
}

export default withDataFilterContext
