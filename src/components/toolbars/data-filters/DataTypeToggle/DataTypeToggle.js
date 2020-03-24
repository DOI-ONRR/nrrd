import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC, DATA_TYPES } from '../../../../constants'

import {
  Grid,
  FormControl,
  FormHelperText
} from '@material-ui/core'

import {
  ToggleButton,
  ToggleButtonGroup
} from '@material-ui/lab'

const DataTypeToggle = ({ helperText }) => {
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const handleChange = (event, newDataType) => {
    updateDataFilter({ ...state, [DFC.DATA_TYPE]: newDataType })
  }

  return (
    <Grid container>
      <Grid item xs={12} sm={12}>
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

DataTypeToggle.propTypes = {
  /** The string for the instruction label. */
  helperText: PropTypes.string,
}

DataTypeToggle.defaultProps = {
  helperText: 'Select a data type.',
}

export default DataTypeToggle
