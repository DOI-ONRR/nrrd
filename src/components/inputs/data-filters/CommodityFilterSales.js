import React from 'react'
import BaseSelectInput from '../BaseSelectInput'
import { COMMODITY_SALES, EXCLUDE_PROPS, COMMODITY } from '../../../constants'
import { createEnhancedInput } from '../index'

const CommodityFilter = ({ queryKey, ...rest }) => {
  const EnhancedFilter = createEnhancedInput(BaseSelectInput, queryKey, COMMODITY_SALES, { [EXCLUDE_PROPS]: [COMMODITY] })
  return (<EnhancedFilter {...rest} />)
}

export default CommodityFilter
