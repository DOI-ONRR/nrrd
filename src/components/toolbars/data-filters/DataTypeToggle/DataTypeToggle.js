import React, { useContext, useEffect, useState } from 'react'

import { fetchDataFilterFromUrl } from '../../../../js/utils'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC, DATA_TYPES } from '../../../../constants'

import {
  Grid,
  FormControl,
  FormHelperText,
  InputLabel
} from '@material-ui/core'

import {
  ToggleButton,
  ToggleButtonGroup
} from '@material-ui/lab'

const DataTypeToggle = ({ label = 'Data type:', helperText }) => {
  const [urlParams] = useState(fetchDataFilterFromUrl())
  useEffect(() => {
    if (Object.keys(urlParams).length > 0) {
      updateDataFilter(urlParams)
    }
  }, [urlParams])

  const { state, updateDataFilter } = useContext(DataFilterContext)
  const handleChange = (event, newDataType) => {
    updateDataFilter({ ...state, [DFC.DATA_TYPE]: newDataType })
  }

  return (
    <Grid container>
      {label.length > 0 &&
        <Grid item xs={12} sm={2}>
          <InputLabel id='data-type-label' aria-label={label}>{label}</InputLabel>
        </Grid>
      }
      <Grid item xs={12} sm={10}>
        <FormControl fullWidth={false} >
          <ToggleButtonGroup value={state[DFC.DATA_TYPE]} onChange={handleChange} exclusive>
            {DATA_TYPES.map(type =>
              <ToggleButton key={type} value={type} aria-label={type}>
                {type}
              </ToggleButton>)}
          </ToggleButtonGroup>
          {helperText &&
            <FormHelperText>{helperText}</FormHelperText>
          }
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default DataTypeToggle
