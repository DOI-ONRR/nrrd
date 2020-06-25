import React from 'react'
import PropTypes from 'prop-types'

import BaseSwitch from '../../inputs/BaseSwitch'

const MapControlSwitch = ({ dataFilterKey, checked, helperText, label, selectType, disabled }) => {
  return (
    <BaseSwitch
      dataFilterKey={dataFilterKey}
      checked={checked}
      helperText={helperText}
      label={label}
      selectType={selectType}
      disabled={disabled}
    />
  )
}

export default MapControlSwitch

MapControlSwitch.propTypes = {
  /**
   * The data filter key used for data filter context
   */
  dataFilterKey: PropTypes.string.isRequired,
  /**
   * The checked options controls when switch is engaged or not, boolean
   */
  checked: PropTypes.bool,
  /**
   * Text that displays below the select box to provide additional instructions
   */
  helperText: PropTypes.string,
  /**
   * Text that displays on the component
   */
  label: PropTypes.string.isRequired,
}
