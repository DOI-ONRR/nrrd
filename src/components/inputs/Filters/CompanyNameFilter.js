import React from 'react'
import BaseSearchSelect from '../BaseSearchSelect'
import { COMPANY_NAME } from '../../../constants'
import { createEnhancedInput } from '../index'

const CompanyNameFilter = ({ queryKey, ...rest }) => {
  const EnhancedFilter = createEnhancedInput(BaseSearchSelect, queryKey, COMPANY_NAME)
  return (<EnhancedFilter {...rest} />)
}

export default CompanyNameFilter
