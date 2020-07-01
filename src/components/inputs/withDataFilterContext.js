import React, { useContext, useEffect } from 'react'

import { DataFilterContext } from '../../stores/data-filter-store'

const withDataFilterContext = (BaseComponent, dataFilterKey) => ({ ...props }) => {
  const { state, updateDataFilter } = useContext(DataFilterContext)

  const handleChange = newValue => {
    updateDataFilter({ [dataFilterKey]: (newValue === '') ? undefined : newValue })
  }

  useEffect(() => {
    console.log(props.defaultSelected)
    if (props.defaultSelected && (state[dataFilterKey] !== props.defaultSelected)) {
      updateDataFilter({ [dataFilterKey]: (props.defaultSelected === '') ? undefined : props.defaultSelected })
    }
  }, [props.defaultSelected])

  return (
    <BaseComponent onChange={handleChange} defaultSelected={props.defaultSelected || state[dataFilterKey]} {...props} />
  )
}

export default withDataFilterContext
