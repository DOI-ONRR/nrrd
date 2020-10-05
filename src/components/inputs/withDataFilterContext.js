import React, { useContext } from 'react'
import { DataFilterContext } from '../../stores/data-filter-store'

/**
 * The purpose of this HOC is to allow our inputs to be independent of a data filter context. This HOC handles the updating
 * of the data filter context and also provides default and updates on selected values.
 *
 * @param {*} BaseComponent
 * @param {*} dataFilterKey
 */
const withDataFilterContext = (BaseComponent, dataFilterKey) => ({ ...props }) => {

  const { state, updateDataFilter } = useContext(DataFilterContext)

  const handleChange = newValue => {
    updateDataFilter({ [dataFilterKey]: (newValue === '') ? undefined : newValue })
  }

  return (
    <BaseComponent onChange={handleChange} defaultSelected={props.defaultSelected} selected={state[dataFilterKey]} {...props} />
  )
}

export default withDataFilterContext
