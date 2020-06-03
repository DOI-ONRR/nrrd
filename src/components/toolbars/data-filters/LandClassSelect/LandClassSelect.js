import React from 'react'
import PropTypes from 'prop-types'

import { LAND_CLASS } from '../../../../constants'

import BaseDataFilterSelect from '../BaseDataFilterSelect'

const LandClassSelect = ({ helperText, label, loadingMessage }) => (
  <BaseDataFilterSelect
    dataFilterKey={LAND_CLASS}
    label={label}
    loadingMessage={loadingMessage}
    helperText={helperText} />
)

export default LandClassSelect

LandClassSelect.propTypes = {
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
LandClassSelect.defaultProps = {
  label: 'Land class',
  loadingMessage: 'Updating Land Class options from server...'
}
