import React from 'react'
import BaseSelectInput from '../BaseSelectInput'
import { US_STATE_NAME } from '../../../constants'
import { createEnhancedInput } from '../index'

const StateFilter = ({ queryKey, ...rest }) => {
  const EnhancedFilter = createEnhancedInput(BaseSelectInput, queryKey, US_STATE_NAME)
  return (<EnhancedFilter {...rest} />)
}

export default StateFilter
