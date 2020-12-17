import React, { useContext } from 'react'

import { DataFilterContext } from '../../../stores/data-filter-store'
import BaseButtonInput from '../BaseButtonInput'

/**
 * This can be used to clear all data filters from the data filter provider and
 * reset them to the defaults.
 */
const ClearAllFiltersBtn = ({ ...props }) => {
  const { clearAllFilters } = useContext(DataFilterContext)

  const onClickHandler = () => {
    if (clearAllFilters) {
      clearAllFilters()
    }
  }

  return (
    <>
      <BaseButtonInput onClick={onClickHandler} {...props}>Clear all</BaseButtonInput>
    </>
  )
}

export default ClearAllFiltersBtn

export const ClearAllFiltersBtnDemos = [
  {
    title: 'Clear All Button',
    code: '<ClearAllFiltersBtn />',
  }
]
