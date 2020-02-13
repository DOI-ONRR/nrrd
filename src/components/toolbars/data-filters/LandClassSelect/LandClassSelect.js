import React, { useContext, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
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

const LandClassSelect = ({ helperText, label = 'Land class' }) => {
  const { state } = useContext(DataFilterContext)
  const { loading, error, data } = useQuery(DFC.GET_DF_REVENUE_LOCATION_OPTIONS, DFC.ALL_DATA_FILTER_VARS(state))
  if (error) return `Error! ${ error.message }`

  return (
    <React.Fragment>
      <LandClassSelector loading={loading} label={label} data={data} helperText={helperText} />
    </React.Fragment>
  )
}

export default LandClassSelect

const LandClassSelector = ({ label, data, loading, helperText }) => {
  const classes = useStyles()
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const handleChange = event => {
    updateDataFilter({ ...state, [DFC.LAND_CLASS]: event.target.value.toString() })
  }

  useEffect(() => {
    if (data && data[DFC.LAND_CLASS_OPTIONS].length === 0) {
      updateDataFilter({ ...state, [DFC.LAND_CLASS]: undefined })
    }
  }, [data])

  const handleClearAll = () => updateDataFilter({ ...state, [DFC.LAND_CLASS]: undefined })

  return (
    <Grid container direction='row' alignitems='flex-end'>
      <Grid item xs={12} sm={10}>
        <FormControl className={classes.formControl} disabled={(data && data[DFC.LAND_CLASS_OPTIONS].length === 0)} >
          {!loading &&
              <InputLabel id="land-class-select-label">{label}</InputLabel>
          }
          {loading &&
            <InputLabel id="land-class-select-label">
              <LinearProgress />
              {label}
            </InputLabel>
          }
          <Select
            labelId="land-class-select-label"
            id="land-class-select"
            value={state[DFC.LAND_CLASS] || ''}
            onChange={handleChange}
            displayEmpty
          >
            {data &&
              data[DFC.LAND_CLASS_OPTIONS].map((option, i) =>
                <MenuItem key={`${ option[DFC.LAND_CLASS] }_${ i }`} value={option[DFC.LAND_CLASS]}>{option[DFC.LAND_CLASS]}</MenuItem>)
            }
          </Select>
          {helperText &&
            <FormHelperText>{helperText}</FormHelperText>
          }
          {(data && data[DFC.LAND_CLASS_OPTIONS].length === 0) &&
            <FormHelperText>No land classes match the current filter options.</FormHelperText>
          }
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={2}>
        { state[DFC.LAND_CLASS] &&
          <IconButton color="primary" aria-label='Clear all land class options' onClick={handleClearAll}><ClearAll /></IconButton>
        }
      </Grid>
    </Grid>
  )
}
