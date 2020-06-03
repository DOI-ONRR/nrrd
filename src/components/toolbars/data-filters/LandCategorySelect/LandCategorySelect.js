import React from 'react'
import PropTypes from 'prop-types'

import { LAND_CATEGORY } from '../../../../constants'

import BaseDataFilterSelect from '../BaseDataFilterSelect'
import BaseSelectInput from '../../../inputs/BaseSelectInput'

const LandCategorySelect = ({ helperText, label, loadingMessage }) => (
  <BaseDataFilterSelect
    dataFilterKey={LAND_CATEGORY}
    label={label}
    loadingMessage={loadingMessage}
    helperText={helperText} />
)

export default LandCategorySelect

LandCategorySelect.propTypes = {
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
LandCategorySelect.defaultProps = {
  label: 'Land category',
  loadingMessage: 'Updating Land Category options from server...'
}
