import React from 'react'
import PropTypes from 'prop-types'

import { LAND_TYPE } from '../../../../constants'

import BaseDataFilterSelect from '../BaseDataFilterSelect'

const LandTypeSelect = ({ helperText, label, loadingMessage }) => (
  <BaseDataFilterSelect
    dataFilterKey={LAND_TYPE}
    label={label}
    loadingMessage={loadingMessage}
    helperText={helperText} />
)

export default LandTypeSelect

LandTypeSelect.propTypes = {
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
LandTypeSelect.defaultProps = {
  label: 'Land type',
  loadingMessage: 'Updating Land Type options from server...'
}
