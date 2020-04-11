import React from 'react'
import PropTypes from 'prop-types'

import { REVENUE_TYPE } from '../../../../constants'

import BaseDataFilterSelect from '../BaseDataFilterSelect'

const RevenueTypeSelect = ({ helperText, label, loadingMessage }) => (
  <BaseDataFilterSelect
    dataFilterKey={REVENUE_TYPE}
    label={label}
    loadingMessage={loadingMessage}
    helperText={helperText} />
)

export default RevenueTypeSelect

RevenueTypeSelect.propTypes = {
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
RevenueTypeSelect.defaultProps = {
  label: 'Revenue type',
  loadingMessage: 'Updating data filters from server...'
}
