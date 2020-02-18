import React, { useContext, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'

import { DataFilterContext } from '../../../../stores/data-filter-store'
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
import { IconButton, Grid, LinearProgress } from '@material-ui/core'
import { ClearAll } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 140,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

const StateSelect = ({ helperText, label = 'State(s)' }) => {
  const { state } = useContext(DataFilterContext)
  const { loading, error, data } = useQuery(DFC.GET_DF_REVENUE_LOCATION_OPTIONS, DFC.ALL_DATA_FILTER_VARS(state))
  if (error) return `Error! ${ error.message }`

  return (
    <React.Fragment>
      <StatesMultiSelect loading={loading} label={label} data={data} helperText={helperText} />
    </React.Fragment>
  )
}

export default StateSelect

const StatesMultiSelect = ({ label, data, loading, helperText }) => {
  const classes = useStyles()
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const handleChange = event => {
    updateDataFilter({ ...state, [DFC.US_STATES]: event.target.value.toString() })
  }

  useEffect(() => {
    if (data && data[DFC.US_STATE_OPTIONS].length === 0) {
      updateDataFilter({ ...state, [DFC.US_STATES]: undefined })
    }
  }, [data])

  const handleClearAll = () => updateDataFilter({ ...state, [DFC.US_STATES]: undefined })

  const currentUsStates = state[DFC.US_STATES] ? state[DFC.US_STATES].split(',') : []

  return (
    <Grid container direction='row' alignitems='flex-end'>
      <Grid item xs={12} sm={10}>
        <FormControl className={classes.formControl} disabled={(data && data[DFC.US_STATE_OPTIONS].length === 0)}>
          {!loading &&
              <InputLabel id="states-select-label">{label}</InputLabel>
          }
          {loading &&
            <InputLabel id="states-select-label">
              <LinearProgress />
              {label}
            </InputLabel>
          }
          <Select
            labelId="states-select-label"
            id="states-select"
            multiple
            value={currentUsStates}
            renderValue={selected => selected.join(', ')}
            input={<Input />}
            onChange={handleChange}
            displayEmpty

          >
            {data &&
              data[DFC.US_STATE_OPTIONS].map(
                (option, i) => <MenuItem key={`${ option[DFC.US_STATE] }_${ i }`} value={option[DFC.US_STATE]}>
                  <Checkbox checked={currentUsStates.findIndex(state => state === option[DFC.US_STATE]) > -1} />
                  <ListItemText primary={option[DFC.US_STATE]} />
                </MenuItem>)
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
      <Grid item xs={12} sm={2}>
        {state[DFC.US_STATES] &&
          <IconButton color="primary" aria-label='Clear all state options' onClick={handleClearAll}><ClearAll /></IconButton>
        }
      </Grid>
    </Grid>
  )
}
