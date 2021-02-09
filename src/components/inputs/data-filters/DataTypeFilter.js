import React from 'react'
import BaseSelectInput from '../BaseSelectInput'
import { DATA_TYPE, DATA_TYPES, DATA_TYPES_PLUS } from '../../../constants'
import { createDataFilterContextInput } from '../index'

const DataTypeFilter = ({ useDataTypesPlus, ...rest }) => {
  const EnhancedFilter = createDataFilterContextInput(BaseSelectInput, DATA_TYPE)
  return (<EnhancedFilter data={useDataTypesPlus ? DATA_TYPES_PLUS : DATA_TYPES} showClearSelected={false} {...rest} />)
}

export default DataTypeFilter
