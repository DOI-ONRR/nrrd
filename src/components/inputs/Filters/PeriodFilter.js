import React from 'react'
import BaseSelectInput from '../BaseSelectInput'
import { PERIOD } from '../../../constants'
import { createEnhancedInput } from '../index'

const PeriodFilter = ({ queryKey, ...rest }) => {
  const EnhancedFilter = createEnhancedInput(BaseSelectInput, queryKey, PERIOD)
  return (<EnhancedFilter {...rest} />)
}

export default PeriodFilter
