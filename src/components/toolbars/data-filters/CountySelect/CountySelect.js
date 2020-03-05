import React, { useContext, useEffect } from 'react'

import { useLazyQuery } from '@apollo/react-hooks'

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

const CountySelect = ({ helperText, label = 'County(s)' }) => {
  const { state } = useContext(DataFilterContext)
  const [getOptions, { loading, error, data }] = useLazyQuery(DFC.GET_DF_REVENUE_COUNTY_OPTIONS, DFC.ALL_DATA_FILTER_VARS(state))
  if (error) return `Error! ${ error.message }`

  return (
    <React.Fragment>
      <CountyMultiSelect loading={loading} label={label} data={data} helperText={helperText} />
    </React.Fragment>
  )
}

export default CountySelect

const CountyMultiSelect = ({ label, data, loading, helperText }) => {
  const classes = useStyles()
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const handleChange = event => {
    updateDataFilter({ ...state, [DFC.COUNTIES]: event.target.value.toString() })
  }

  useEffect(() => {
    if (data && data[DFC.COUNTY_OPTIONS].length === 0) {
      updateDataFilter({ ...state, [DFC.COUNTIES]: undefined })
    }
  }, [data])

  const handleClearAll = () => updateDataFilter({ ...state, [DFC.COUNTIES]: undefined })

  const currentCounties = state[DFC.COUNTIES] ? state[DFC.COUNTIES].split(',') : []

  return (
    <Grid container direction='row' alignitems='flex-end'>
      <Grid item xs={12} sm={10}>
        <FormControl className={classes.formControl} disabled={(data && data[DFC.COUNTY_OPTIONS].length === 0)}>
          {!loading &&
              <InputLabel id="counties-select-label">{label}</InputLabel>
          }
          {loading &&
            <InputLabel id="counties-select-label">
              <LinearProgress />
              {label}
            </InputLabel>
          }
          <Select
            labelId="counties-select-label"
            id="counties-select"
            multiple
            value={currentCounties}
            renderValue={selected => selected.join(', ')}
            input={<Input />}
            onChange={handleChange}
            displayEmpty
          >
            {data &&
              data[DFC.COUNTY_OPTIONS].map(
                (option, i) => <MenuItem key={`${ option[DFC.COUNTY] }_${ i }`} value={option[DFC.COUNTY]}>
                  <Checkbox checked={currentCounties.findIndex(county => county === option[DFC.COUNTY]) > -1} />
                  <ListItemText primary={`${ option[DFC.COUNTY] }, ${ option[DFC.US_STATE] }`} />
                </MenuItem>)
            }
          </Select>
          {helperText &&
            <FormHelperText>{helperText}</FormHelperText>
          }
          {(data && data[DFC.COUNTY_OPTIONS].length === 0) &&
            <FormHelperText>No counties match the current filter options.</FormHelperText>
          }
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={2}>
        {state[DFC.COUNTIES] &&
          <IconButton color="primary" aria-label='Clear all county options' onClick={handleClearAll}><ClearAll /></IconButton>
        }
      </Grid>
    </Grid>
  )
}
