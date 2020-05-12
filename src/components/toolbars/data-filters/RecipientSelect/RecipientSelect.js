import React from 'react'
import PropTypes from 'prop-types'

import { RECIPIENT } from '../../../../constants'

import BaseDataFilterSelect from '../BaseDataFilterSelect'

const RecipientSelect = ({ helperText, label, loadingMessage }) => (
  <BaseDataFilterSelect
    dataFilterKey={RECIPIENT}
    label={label}
    loadingMessage={loadingMessage}
    helperText={helperText} />
)

export default RecipientSelect

RecipientSelect.propTypes = {
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
RecipientSelect.defaultProps = {
  label: 'Recipient',
  loadingMessage: 'Updating Recipient options from server...'
}
