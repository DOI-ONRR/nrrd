import React from 'react'
import PropTypes from 'prop-types'

import { OFFSHORE_REGION } from '../../../../constants'

import BaseDataFilterSelect from '../BaseDataFilterSelect'

const OffshoreRegionSelect = ({ helperText, label, loadingMessage }) => (
  <BaseDataFilterSelect
    dataFilterKey={OFFSHORE_REGION}
    selectType={'Multi'}
    label={label}
    loadingMessage={loadingMessage}
    helperText={helperText} />
)

export default OffshoreRegionSelect

OffshoreRegionSelect.propTypes = {
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
OffshoreRegionSelect.defaultProps = {
  label: 'Offshore region(s)',
  loadingMessage: 'Updating Offshore region options from server...'
}
