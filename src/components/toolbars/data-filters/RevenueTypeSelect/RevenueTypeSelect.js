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

const RevenueTypeSelect = ({ helperText, label = 'Revenue type' }) => {
  const { state } = useContext(DataFilterContext)
  const { loading, error, data } = useQuery(DFC.GET_DF_REVENUE_LOCATION_OPTIONS, DFC.ALL_DATA_FILTER_VARS(state))
  if (error) return `Error! ${ error.message }`

  return (
    <React.Fragment>
      <RevenueTypeSelector loading={loading} label={label} data={data} helperText={helperText} />
    </React.Fragment>
  )
}

export default RevenueTypeSelect

const RevenueTypeSelector = ({ loading, label, data, helperText }) => {
  const classes = useStyles()
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const handleChange = event => {
    updateDataFilter({ ...state, [DFC.REVENUE_TYPE]: event.target.value.toString() })
  }

  useEffect(() => {
    if (data && data[DFC.REVENUE_TYPE_OPTIONS].length === 0) {
      updateDataFilter({ ...state, [DFC.REVENUE_TYPE]: undefined })
    }
  }, [data])

  const handleClearAll = () => updateDataFilter({ ...state, [DFC.REVENUE_TYPE]: undefined })

  return (
    <Grid container direction='row' alignitems='flex-end'>
      <Grid item xs={12} sm={10}>
        <FormControl className={classes.formControl} disabled={(data && data[DFC.REVENUE_TYPE_OPTIONS].length === 0)} >
          {!loading &&
              <InputLabel id="revenue-type-select-label">{label}</InputLabel>
          }
          {loading &&
            <InputLabel id="revenue-type-select-label">
              <LinearProgress />
              {label}
            </InputLabel>
          }
          <Select
            labelId="revenue-type-select-label"
            id="revenue-type-select"
            value={state[DFC.REVENUE_TYPE] || ''}
            onChange={handleChange}
            displayEmpty
          >
            {data &&
              data[DFC.REVENUE_TYPE_OPTIONS].map((option, i) =>
                <MenuItem key={`${ option[DFC.REVENUE_TYPE] }_${ i }`} value={option[DFC.REVENUE_TYPE]}>{option[DFC.REVENUE_TYPE]}</MenuItem>)
            }
          </Select>
          {helperText &&
            <FormHelperText>{helperText}</FormHelperText>
          }
          {(data && data[DFC.REVENUE_TYPE_OPTIONS].length === 0) &&
            <FormHelperText>No revenue types match the current filter options.</FormHelperText>
          }
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={2}>
        { state[DFC.REVENUE_TYPE] &&
          <IconButton color="primary" aria-label='Clear all revenue type options' onClick={handleClearAll}><ClearAll /></IconButton>
        }
      </Grid>
    </Grid>
  )
}
