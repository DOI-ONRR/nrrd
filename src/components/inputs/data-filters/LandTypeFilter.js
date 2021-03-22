import React from 'react'
import BaseSelectInput from '../BaseSelectInput'
import { LAND_TYPE } from '../../../constants'
import { createEnhancedInput } from '../index'

const LandTypeFilter = ({ queryKey, ...rest }) => {
  const EnhancedFilter = createEnhancedInput(BaseSelectInput, queryKey, LAND_TYPE)
  return (<EnhancedFilter {...rest} />)
}

export default LandTypeFilter
