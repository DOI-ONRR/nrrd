import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { DataFilterContext } from '../../../stores/data-filter-store'
import {
  PERIOD_FISCAL_YEAR,
  FISCAL_YEAR,
  PERIOD_CALENDAR_YEAR,
  CALENDAR_YEAR
} from '../../../constants'

import {
  FiscalYearSlider,
  CalendarYearSlider
} from '../index'

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
