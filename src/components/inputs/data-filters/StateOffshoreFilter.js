import React from 'react'
import BaseSelectInput from '../BaseSelectInput'
import { STATE_OFFSHORE_NAME } from '../../../constants'
import { createEnhancedInput } from '../index'

const StateOffshoreFilter = ({ queryKey, ...rest }) => {
  const EnhancedFilter = createEnhancedInput(BaseSelectInput, queryKey, STATE_OFFSHORE_NAME)
  return (<EnhancedFilter {...rest} />)
}

export default StateOffshoreFilter
