import React from 'react'
import { flowRight as compose } from 'lodash'
import BaseSelectInput from '../BaseSelectInput'
import { DISPLAY_NAMES, DATA_TYPE, DATA_TYPES, DATA_TYPES_PLUS } from '../../../constants'
import withDataFilterContext from '../withDataFilterContext'

/**
 * A factory method for building input components with a DataFilterContext.
 *
 * @param {compnent} baseInput
 * @param {String} dataFilterKey
 */

const DataTypeFilter = ({ useDataTypesPlus, ...rest }) => {
  const createDataFilterContextInput = (baseInput, dataFilterKey) => {
    return compose(
      BaseComponent => props => (<BaseComponent label={DISPLAY_NAMES[dataFilterKey]?.default} {...props} />),
      BaseComponent => withDataFilterContext(BaseComponent, dataFilterKey))(baseInput)
  }
  const EnhancedFilter = createDataFilterContextInput(BaseSelectInput, DATA_TYPE)
  return (<EnhancedFilter data={useDataTypesPlus ? DATA_TYPES_PLUS : DATA_TYPES} showClearSelected={false} {...rest} />)
}

export default DataTypeFilter
