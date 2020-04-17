import React from 'react'
import PropTypes from 'prop-types'

import { DATA_TYPE } from '../../../../constants'

import BaseDataFilterToggle from '../BaseDataFilterToggle'

const DataTypeToggle = ({ helperText, loadingMessage }) => (
  <BaseDataFilterToggle
    dataFilterKey={DATA_TYPE}
    loadingMessage={loadingMessage}
    helperText={helperText} />
)

export default DataTypeToggle

DataTypeToggle.propTypes = {
  /**
   * Text that displays below the select box to provide additional instructions
   */
  helperText: PropTypes.string,
  /**
   * The message that shows in the loading screen
   */
  loadingMessage: PropTypes.string
}
DataTypeToggle.defaultProps = {
  loadingMessage: 'Updating Data type options from server...'
}
