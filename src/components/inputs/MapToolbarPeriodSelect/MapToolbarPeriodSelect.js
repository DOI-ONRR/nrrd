import React from 'react'
import PropTypes from 'prop-types'

import BaseSelectInput from '../BaseSelectInput'

const MapToolbarPeriodSelect = ({ dataFilterKey, data, defaultSelected, helperText, label, selectType, disabled }) => {
  // try useTheme for overriding styles
  return (
    <BaseSelectInput
      dataFilterKey={dataFilterKey}
      data={data}
      defaultSelected={defaultSelected}
      disabled={disabled}
      helperText={helperText}
      label={label}
      selectType={selectType}
      showClearSelected={false}
      variant='outlined'
    />
  )
}

export default MapToolbarPeriodSelect

MapToolbarPeriodSelect.propTypes = {
  /**
   * The data filter key used for data filter context
   */
  dataFilterKey: PropTypes.string.isRequired,
  /**
   * The data option, an array of options for input
   */
  data: PropTypes.array.isRequired,
  /**
   * Text that display as the default option of input
   */
  defaultSelected: PropTypes.string,
  /**
   * Text that displays below the select box to provide additional instructions
   */
  helperText: PropTypes.string,
  /**
   * Text that displays on the component
   */
  label: PropTypes.string.isRequired,
}
