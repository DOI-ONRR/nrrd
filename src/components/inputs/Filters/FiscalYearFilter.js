import React from 'react'
import BaseSlider from '../BaseSlider'
import { FISCAL_YEAR } from '../../../constants'
import { createEnhancedInput } from '../index'

const FiscalYearFilter = ({ queryKey, ...rest }) => {
  const EnhancedFilter = createEnhancedInput(BaseSlider, queryKey, FISCAL_YEAR)
  return (<EnhancedFilter {...rest} />)
}

export default FiscalYearFilter
