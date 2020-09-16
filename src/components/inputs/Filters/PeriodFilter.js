import React from 'react'
import BaseSelectInput from '../BaseSelectInput'
import { PERIOD, EXCLUDE_PROPS, CALENDAR_YEAR, FISCAL_YEAR } from '../../../constants'
import { createEnhancedInput } from '../index'

const PeriodFilter = ({ queryKey, ...rest }) => {
  const EnhancedFilter = createEnhancedInput(BaseSelectInput, queryKey, PERIOD, { [EXCLUDE_PROPS]: [PERIOD, CALENDAR_YEAR, FISCAL_YEAR] })
  return (<EnhancedFilter {...rest} />)
}

export default PeriodFilter
