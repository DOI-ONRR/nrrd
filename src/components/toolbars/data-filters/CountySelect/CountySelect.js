import React from 'react'
import PropTypes from 'prop-types'

import { COUNTY } from '../../../../constants'

import BaseDataFilterSelect from '../BaseDataFilterSelect'

const CountySelect = ({ helperText, label, loadingMessage, disabled }) => (
  <BaseDataFilterSelect
    dataFilterKey={COUNTY}
    selectType={'Multi'}
    label={label}
    loadingMessage={loadingMessage}
    helperText={helperText}
    disabled={disabled} />
)

export default CountySelect

CountySelect.propTypes = {
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
CountySelect.defaultProps = {
  label: 'County',
  loadingMessage: 'Updating County options from server...'
}
