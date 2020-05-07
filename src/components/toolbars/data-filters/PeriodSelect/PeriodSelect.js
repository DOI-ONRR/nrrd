import React from 'react'
import PropTypes from 'prop-types'

import { PERIOD } from '../../../../constants'

import BaseDataFilterSelect from '../BaseDataFilterSelect'

const PeriodSelect = ({ helperText, label, loadingMessage }) => (
  <BaseDataFilterSelect
    dataFilterKey={PERIOD}
    label={label}
    loadingMessage={loadingMessage}
    helperText={helperText} />
)

export default PeriodSelect

PeriodSelect.propTypes = {
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
PeriodSelect.defaultProps = {
  label: 'Period',
  loadingMessage: 'Updating Period options from server...'
}
