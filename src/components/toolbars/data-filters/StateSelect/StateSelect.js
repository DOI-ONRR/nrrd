import React from 'react'
import PropTypes from 'prop-types'

import { US_STATE } from '../../../../constants'

import BaseDataFilterSelect from '../BaseDataFilterSelect'

const StateSelect = ({ helperText, label, loadingMessage }) => (
  <BaseDataFilterSelect
    dataFilterKey={US_STATE}
    selectType={'Multi'}
    label={label}
    loadingMessage={loadingMessage}
    helperText={helperText} />
)

export default StateSelect

StateSelect.propTypes = {
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
StateSelect.defaultProps = {
  label: 'State(s)',
  loadingMessage: 'Updating State options from server...'
}
