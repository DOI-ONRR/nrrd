import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { DataFilterContext } from '../../../stores/data-filter-store'
import {
  PERIOD_FISCAL_YEAR,
  FISCAL_YEAR,
  PERIOD_CALENDAR_YEAR,
  CALENDAR_YEAR
} from '../../../constants'

import BaseSlider from '../BaseSlider'
import { createEnhancedSlider } from '../index'

import BaseDataFilterRangeSlider from '../BaseDataFilterRangeSlider'

const FiscalYearSlider = createEnhancedSlider(FISCAL_YEAR)
const CalendarYearSlider = createEnhancedSlider(CALENDAR_YEAR)

const YearRangeSelect = ({ helperText, label, loadingMessage }) => {
  const { state } = useContext(DataFilterContext)

  return (
    <React.Fragment>
      {state.period === PERIOD_FISCAL_YEAR &&
        <FiscalYearSlider selected={[2017, 2019]} />
      }
      {state.period === PERIOD_CALENDAR_YEAR &&
        <CalendarYearSlider selected={[2017, 2019]} />
      }
    </React.Fragment>
  )
}

export default YearRangeSelect

YearRangeSelect.propTypes = {
  /**
   * Text that displays below the select box to provide additional instructions
   */
  helperText: PropTypes.string,
  /**
   * Text that displays on the component
   */
  label: PropTypes.string,
  /**
   * The message that shows in the loading screen
   */
  loadingMessage: PropTypes.string
}
YearRangeSelect.defaultProps = {
  label: 'Years',
  loadingMessage: 'Updating Year options from server...'
}
