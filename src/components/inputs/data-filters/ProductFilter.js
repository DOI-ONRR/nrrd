import React from 'react'
import BaseSelectInput from '../BaseSelectInput'
import { PRODUCT } from '../../../constants'
import { createEnhancedInput } from '../index'

const ProductFilter = ({ queryKey, ...rest }) => {
  const EnhancedFilter = createEnhancedInput(BaseSelectInput, queryKey, PRODUCT)
  return (<EnhancedFilter {...rest} />)
}

export default ProductFilter
