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
    minWidth: 175,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

const OffshoreRegionSelect = ({ helperText, label = 'Offshore region(s)' }) => {
  const { state } = useContext(DataFilterContext)
  const { loading, error, data } = useQuery(DFC.GET_DF_REVENUE_LOCATION_OPTIONS, DFC.ALL_DATA_FILTER_VARS(state))
  if (error) return `Error! ${ error.message }`

  return (
    <React.Fragment>
      <OffshoreRegionMultiSelect loading={loading} label={label} data={data} helperText={helperText} />
    </React.Fragment>
  )
}

export default OffshoreRegionSelect

const OffshoreRegionMultiSelect = ({ label, data, loading, helperText }) => {
  const classes = useStyles()
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const handleChange = event => {
    updateDataFilter({ ...state, [DFC.OFFSHORE_REGIONS]: event.target.value.toString() })
  }

  useEffect(() => {
    if (data && data[DFC.OFFSHORE_REGION_OPTIONS].length === 0) {
      updateDataFilter({ ...state, [DFC.OFFSHORE_REGIONS]: undefined })
    }
  }, [data])

  const handleClearAll = () => updateDataFilter({ ...state, [DFC.OFFSHORE_REGIONS]: undefined })

  const currentRegions = state[DFC.OFFSHORE_REGIONS] ? state[DFC.OFFSHORE_REGIONS].split(',') : []

  return (
    <Grid container direction='row' alignitems='flex-end'>
      <Grid item xs={12} sm={10}>
        <FormControl className={classes.formControl} disabled={(data && data[DFC.OFFSHORE_REGION_OPTIONS].length === 0)}>
          {!loading &&
              <InputLabel id="offshore-region-select-label">{label}</InputLabel>
          }
          {loading &&
            <InputLabel id="offshore-region-select-label">
              <LinearProgress />
              {label}
            </InputLabel>
          }
          <Select
            labelId="offshore-region-select-label"
            id="offshore-region-select"
            multiple
            value={currentRegions}
            renderValue={selected => selected.join(', ')}
            input={<Input />}
            onChange={handleChange}
            displayEmpty

          >
            {data &&
          data[DFC.OFFSHORE_REGION_OPTIONS].map(
            (option, i) => <MenuItem key={`${ option[DFC.OFFSHORE_REGION] }_${ i }`} value={option[DFC.OFFSHORE_REGION]}>
              <Checkbox checked={(currentRegions.findIndex(region => region === option[DFC.OFFSHORE_REGION]) > -1)} />
              <ListItemText primary={option[DFC.OFFSHORE_REGION]} />
            </MenuItem>)
            }
          </Select>
          {helperText &&
        <FormHelperText>{helperText}</FormHelperText>
          }
          {(data && data[DFC.OFFSHORE_REGION_OPTIONS].length === 0) &&
        <FormHelperText>No offshore regions match the current filter options.</FormHelperText>
          }
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={2}>
        { state[DFC.OFFSHORE_REGIONS] &&
          <IconButton color="primary" aria-label='Clear all offshore region options' onClick={handleClearAll}><ClearAll /></IconButton>
        }
      </Grid>
    </Grid>

  )
}
