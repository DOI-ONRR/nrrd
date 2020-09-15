import React from 'react'
import BaseSelectInput from '../BaseSelectInput'
import { REVENUE_TYPE } from '../../../constants'
import { createEnhancedInput } from '../index'

const RevenueTypeFilter = ({ queryKey, ...rest }) => {
  const EnhancedFilter = createEnhancedInput(BaseSelectInput, queryKey, REVENUE_TYPE)
  return (<EnhancedFilter {...rest} />)
}

export default RevenueTypeFilter
