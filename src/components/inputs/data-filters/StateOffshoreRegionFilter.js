import React from 'react'
import BaseSelectInput from '../BaseSelectInput'
import { STATE_OFFSHORE_REGION } from '../../../constants'
import { createEnhancedInput } from '../index'

const StateOffshoreRegionFilter = ({ queryKey, ...rest }) => {
  const EnhancedFilter = createEnhancedInput(BaseSelectInput, queryKey, STATE_OFFSHORE_REGION)
  return (<EnhancedFilter {...rest} />)
}

export default StateOffshoreRegionFilter
