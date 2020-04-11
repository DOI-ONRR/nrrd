import React from 'react'
import PropTypes from 'prop-types'

import { COMMODITIES } from '../../../../constants'

import BaseDataFilterSelect from '../BaseDataFilterSelect'

const CommoditySelect = ({ helperText, label, loadingMessage }) => (
  <BaseDataFilterSelect
    dataFilterKey={COMMODITIES}
    selectType={'Multi'}
    label={label}
    loadingMessage={loadingMessage}
    helperText={helperText} />
)

export default CommoditySelect

CommoditySelect.propTypes = {
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
CommoditySelect.defaultProps = {
  label: 'Commodity(s)',
  loadingMessage: 'Updating Commodity options from server...'
}
