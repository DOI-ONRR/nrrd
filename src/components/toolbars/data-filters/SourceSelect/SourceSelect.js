import React from 'react'
import PropTypes from 'prop-types'

import { SOURCE } from '../../../../constants'

import BaseDataFilterSelect from '../BaseDataFilterSelect'

const SourceSelect = ({ helperText, label, loadingMessage }) => (
  <BaseDataFilterSelect
    dataFilterKey={SOURCE}
    label={label}
    loadingMessage={loadingMessage}
    helperText={helperText} />
)

export default SourceSelect

SourceSelect.propTypes = {
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
SourceSelect.defaultProps = {
  label: 'Source',
  loadingMessage: 'Updating Source options from server...'
}
