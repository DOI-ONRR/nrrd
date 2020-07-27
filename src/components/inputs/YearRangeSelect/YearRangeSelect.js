import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { DataFilterContext } from '../../../stores/data-filter-store'
import {
  PERIOD_FISCAL_YEAR,
  FISCAL_YEAR,
  PERIOD_CALENDAR_YEAR,
  CALENDAR_YEAR
} from '../../../constants'

import BaseDataFilterRangeSlider from '../BaseDataFilterRangeSlider'

const YearRangeSelect = ({ helperText, label, loadingMessage }) => {
  const { state } = useContext(DataFilterContext)

  return (
    <React.Fragment>
      {state.period === PERIOD_FISCAL_YEAR &&
        <BaseDataFilterRangeSlider
          dataFilterKey={FISCAL_YEAR}
          label={'Fiscal years'}
          loadingMessage={'Updating Fiscal year options from server...'}
          helperText={helperText} />
      }
      {state.period === PERIOD_CALENDAR_YEAR &&
        <BaseDataFilterRangeSlider
          dataFilterKey={CALENDAR_YEAR}
          label={'Calendar years'}
          loadingMessage={'Updating Calendar year options from server...'}
          helperText={helperText} />
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
