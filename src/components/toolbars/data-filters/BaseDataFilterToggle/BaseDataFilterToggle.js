import React, { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'

import { useQuery } from '@apollo/react-hooks'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { AppStatusContext } from '../../../../stores/app-status-store'
import DFQM from '../../../../js/data-filter-query-manager/index'

import {
  Grid,
  FormControl,
  FormHelperText
} from '@material-ui/core'

import {
  ToggleButton,
  ToggleButtonGroup
} from '@material-ui/lab'

const BaseDataFilterToggle = ({ dataFilterKey, helperText, loadingMessage }) => {
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const { loading, error, data } = useQuery(DFQM.getQuery(dataFilterKey, state), DFQM.getVariables(state, dataFilterKey))

  const { updateLoadingStatus, showErrorMessage } = useContext(AppStatusContext)

  useEffect(() => {
    if (error) {
      showErrorMessage(`Error!: ${ error.message }`)
    }
  }, [error])

  useEffect(() => {
    updateLoadingStatus({ status: loading, message: loadingMessage })
  }, [loading])

  const handleChange = (event, value) => {
    updateDataFilter({ [dataFilterKey]: value })
  }

  return (
    <Grid container>
      <Grid item xs={12} sm={12}>
        <FormControl fullWidth={false} >
          {data &&
            <ToggleButtonGroup value={state[dataFilterKey]} onChange={handleChange} exclusive>
              {data.options.map(item =>
                <ToggleButton key={item.option} value={item.option} aria-label={item.option}>
                  {item.option}
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

BaseDataFilterToggle.propTypes = {
  /** The string for the instruction label. */
  helperText: PropTypes.string,
}

export default BaseDataFilterToggle
