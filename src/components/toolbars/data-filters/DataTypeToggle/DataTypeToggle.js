import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_TYPE, REVENUE, PRODUCTION, DISBURSEMENT } from '../../../../constants'

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
  const handleChange = (event, value) => {
    updateDataFilter({ [DATA_TYPE]: value })
  }
  const options = [REVENUE, PRODUCTION, DISBURSEMENT]
  return (
    <Grid container>
      <Grid item xs={12} sm={12}>
        <FormControl fullWidth={false} >
          {options &&
            <ToggleButtonGroup value={state[DATA_TYPE]} onChange={handleChange} exclusive>
              {options.map(item =>
                <ToggleButton key={item} value={item} aria-label={item}>
                  {item}
                </ToggleButton>)}
            </ToggleButtonGroup>
          }
          {helperText &&
            <FormHelperText>{helperText}</FormHelperText>
          }
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default DataTypeToggle

DataTypeToggle.propTypes = {
  /**
   * Text that displays below the select box to provide additional instructions
   */
  helperText: PropTypes.string,

}
