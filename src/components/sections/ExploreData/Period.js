import React, { useContext } from 'react'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

import {
  Box
} from '@material-ui/core'

const Period = () => {
  const { state: filterState } = useContext(DataFilterContext)
  const period = filterState.period
  return (
    <Box component="span">
      {period.toLowerCase()}
    </Box>
  )
}

export default Period
