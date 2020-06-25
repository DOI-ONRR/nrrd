import React from 'react'
import PropTypes from 'prop-types'

import BaseToggle from '../BaseToggle'

const MapControlToggle = ({ dataFilterKey, data, defaultSelected, label }) => {
  return (
    <BaseToggle
      dataFilterKey={dataFilterKey}
      defaultSelected={defaultSelected}
      data={data}
      label={label}
      size="small"
      legend="Map level"
    />
  )
}

export default MapControlToggle

MapControlToggle.propTypes = {
  /**
   * The data filter key used for data filter context
   */
  dataFilterKey: PropTypes.string.isRequired,
  /**
   * The data array of options
   */
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  /**
   * Label used for aria-label on ToggleButtonGroup
   */
  label: PropTypes.string,
}
