import React from 'react'
import BaseSelectInput from '../BaseSelectInput'
import { RECIPIENT } from '../../../constants'
import { createEnhancedInput } from '../index'

const RecipientFilter = ({ queryKey, ...rest }) => {
  const EnhancedFilter = createEnhancedInput(BaseSelectInput, queryKey, RECIPIENT)
  return (<EnhancedFilter {...rest} />)
}

export default RecipientFilter
