import React from 'react'
import BaseSlider from '../BaseSlider'
import { CALENDAR_YEAR } from '../../../constants'
import { createEnhancedInput } from '../index'

const CalendarYearFilter = ({ queryKey, ...rest }) => {
  const EnhancedFilter = createEnhancedInput(BaseSlider, queryKey, CALENDAR_YEAR)
  return (<EnhancedFilter {...rest} />)
}

export default CalendarYearFilter
