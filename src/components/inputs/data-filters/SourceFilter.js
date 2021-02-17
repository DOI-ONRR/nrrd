import React from 'react'
import BaseSelectInput from '../BaseSelectInput'
import { SOURCE } from '../../../constants'
import { createEnhancedInput } from '../index'

const SourceFilter = ({ queryKey, ...rest }) => {
  const EnhancedFilter = createEnhancedInput(BaseSelectInput, queryKey, SOURCE)
  return (<EnhancedFilter {...rest} />)
}

export default SourceFilter
