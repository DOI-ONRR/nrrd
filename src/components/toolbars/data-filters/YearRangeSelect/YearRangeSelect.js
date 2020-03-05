import React, { useContext, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import { range } from '../../../../js/utils'

import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemText from '@material-ui/core/ListItemText'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {
  IconButton,
  Grid,
  Slider,
  Typography,
  LinearProgress
} from '@material-ui/core'
import { ClearAll } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(2),
    minWidth: 250,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

const YearRangeSelect = ({ helperText, label = 'Fiscal years' }) => {
  const { state } = useContext(DataFilterContext)
  const { loading, error, data } = useQuery(DFC.GET_DF_REVENUE_LOCATION_OPTIONS, DFC.ALL_DATA_FILTER_VARS(state))
  if (error) return `Error! ${ error.message }`

  return (
    <React.Fragment>
      <YearRangeSelector loading={loading} label={label} data={data} helperText={helperText} />
    </React.Fragment>
  )
}

export default YearRangeSelect

const YearRangeSelector = ({ loading, label, data, helperText }) => {
  const classes = useStyles()
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const handleChange = (event, newValue) => {
    updateDataFilter({ ...state, [DFC.FISCAL_YEARS]: range(newValue[0], newValue[newValue.length - 1]).toString() })
  }

  useEffect(() => {
    if (data && data[DFC.FISCAL_YEAR_OPTIONS].length === 0) {
      updateDataFilter({ ...state, [DFC.FISCAL_YEARS]: undefined })
    }
  }, [data])

  const handleClearAll = () => updateDataFilter({ ...state, [DFC.FISCAL_YEARS]: undefined })

  const currentFiscalYears = state[DFC.FISCAL_YEARS] ? state[DFC.FISCAL_YEARS].split(',') : []

  const fiscalYearOptions = (data && data[DFC.FISCAL_YEAR_OPTIONS].length > 0) && data[DFC.FISCAL_YEAR_OPTIONS].map(option => option[DFC.FISCAL_YEAR])

  const getCurrentValues = () => {
    let values = []
    if (currentFiscalYears.length > 0) {
      values = [parseInt(currentFiscalYears[0]), parseInt(currentFiscalYears[currentFiscalYears.length - 1])]
    }
    else if (fiscalYearOptions && fiscalYearOptions.length > 0) {
      values = [fiscalYearOptions[0], fiscalYearOptions[fiscalYearOptions.length - 1]]
    }
    return values
  }
  const getCurrentValuesText = () => {
    let valuesText = ''
    if (currentFiscalYears.length > 0) {
      valuesText = valuesText.concat(`${ currentFiscalYears[0] } - ${ currentFiscalYears[currentFiscalYears.length - 1] }`)
    }
    else if (fiscalYearOptions && fiscalYearOptions.length > 0) {
      valuesText = valuesText.concat(`${ fiscalYearOptions[0] } - ${ fiscalYearOptions[fiscalYearOptions.length - 1] }`)
    }
    return valuesText
  }

  return (
    <Grid container direction='row' alignitems='flex-end'>
      <Grid item xs={12}>
        <FormControl className={classes.formControl} disabled={(data && data[DFC.FISCAL_YEAR_OPTIONS].length === 0)}>

          {!loading &&
            <InputLabel id="years-select-label">
              {label.concat(': ')}<Typography display={'inline'} color={'textSecondary'}>{getCurrentValuesText()}</Typography>
            </InputLabel>
          }
          {loading &&
            <InputLabel id="years-select-label">
              <LinearProgress />
              {label}
            </InputLabel>
          }
          {fiscalYearOptions &&
            <Slider
              defaultValue={getCurrentValues()}
              getAriaValueText={getCurrentValuesText}
              aria-labelledby="years-select-label"
              valueLabelDisplay="auto"
              step={1}
              onChangeCommitted={handleChange}
              marks
              min={fiscalYearOptions[0]}
              max={fiscalYearOptions[fiscalYearOptions.length - 1]} />
          }
          {helperText &&
            <FormHelperText>{helperText}</FormHelperText>
          }
          {(data && data[DFC.FISCAL_YEAR_OPTIONS].length === 0) &&
            <FormHelperText>No years match the current filter options.</FormHelperText>
          }
        </FormControl>
      </Grid>
    </Grid>
  )
}

/*

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

          */
