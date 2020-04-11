import React, { useContext, useEffect, useState } from 'react'

import { useQuery } from '@apollo/react-hooks'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { AppStatusContext } from '../../../../stores/app-status-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemText from '@material-ui/core/ListItemText'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { IconButton, Grid } from '@material-ui/core'
import Clear from '@material-ui/icons/Clear'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: '-webkit-fill-available'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

const StateSelect = ({ helperText, label = 'State(s)', loadingMessage = 'Updating State options from server...' }) => {
  const { state } = useContext(DataFilterContext)
  const { loading, error, data } = useQuery(DFC.GET_DF_REVENUE_LOCATION_OPTIONS, DFC.ALL_DATA_FILTER_VARS(state))

  const { updateLoadingStatus, showErrorMessage } = useContext(AppStatusContext)

  useEffect(() => {
    if (error) {
      showErrorMessage(`Error!: ${ error.message }`)
    }
  }, [error])

  useEffect(() => {
    updateLoadingStatus({ status: loading, message: loadingMessage })
  }, [loading])

  return (
    <React.Fragment>
      <StatesMultiSelect label={label} data={data} helperText={helperText} />
    </React.Fragment>
  )
}

export default StateSelect

const StatesMultiSelect = ({ label, data, helperText }) => {
  const classes = useStyles()
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const [selectedOptions, setSelectedOptions] = useState(state[DFC.US_STATES] || '')

  const handleChange = event => {
    if (event.target.value.includes('Clear')) {
      handleClearAll()
    }
    else {
      setSelectedOptions(event.target.value.toString())
    }
  }

  const handleClose = event => {
    if (!(selectedOptions.length === 0 && !state[DFC.US_STATES]) && (selectedOptions !== state[DFC.US_STATES])) {
      updateDataFilter({ ...state, [DFC.US_STATES]: selectedOptions })
    }
  }

  useEffect(() => {
    if (data && data[DFC.US_STATE_OPTIONS].length === 0) {
      updateDataFilter({ ...state, [DFC.US_STATES]: undefined })
    }
  }, [data])

  const handleClearAll = () => {
    setSelectedOptions('')
    updateDataFilter({ ...state, [DFC.US_STATES]: undefined })
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormControl className={classes.formControl} disabled={(data && data[DFC.US_STATE_OPTIONS].length === 0)}>
          <InputLabel id="states-select-label">{label}</InputLabel>
          <Select
            labelId="states-select-label"
            id="states-select"
            multiple
            value={selectedOptions.length > 0 ? selectedOptions.split(',') : []}
            renderValue={selected => selected && selected.join(', ')}
            input={<Input />}
            onChange={handleChange}
            onClose={handleClose}
          >
            <MenuItem value={'Clear'} disabled={(selectedOptions.length === 0)}>
              <IconButton><Clear /></IconButton><ListItemText primary={'Clear selected'} />
            </MenuItem>
            {data &&
              data[DFC.US_STATE_OPTIONS].map(
                (option, i) => {
                  return (<MenuItem key={`${ option[DFC.US_STATE] }_${ i }`} value={option[DFC.US_STATE]}>
                    <Checkbox checked={selectedOptions.includes(option[DFC.US_STATE])} />
                    <ListItemText primary={option[DFC.US_STATE]} />
                  </MenuItem>)
                })
            }
          </Select>
          {helperText &&
        <FormHelperText>{helperText}</FormHelperText>
          }
          {(data && data[DFC.US_STATE_OPTIONS].length === 0) &&
        <FormHelperText>No states match the current filter options.</FormHelperText>
          }
        </FormControl>
      </Grid>
    </Grid>
  )
}
