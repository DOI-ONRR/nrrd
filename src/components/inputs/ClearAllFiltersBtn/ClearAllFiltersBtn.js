import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { DataFilterContext } from '../../../stores/data-filter-store'
import BaseButtonInput from '../BaseButtonInput'

const ClearAllFiltersBtn = ({ label, dataFilterKey, ...props }) => {
  const { clearAllFilters } = useContext(DataFilterContext)

  const onClickHandler = () => {
    clearAllFilters()
  }

  return (
    <>
      <BaseButtonInput
        label={label}
        onClick={onClickHandler}
        {...props}/>
    </>
  )
}

ClearAllFiltersBtn.propTypes = {
  /**
   * Text that displays on the component
   */
  label: PropTypes.string,
}
ClearAllFiltersBtn.defaultProps = {
  label: 'Clear All',
}

export default ClearAllFiltersBtn
