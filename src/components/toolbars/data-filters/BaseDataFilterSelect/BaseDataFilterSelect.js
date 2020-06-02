import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { useQuery } from '@apollo/react-hooks'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { AppStatusContext } from '../../../../stores/app-status-store'
import DFQM from '../../../../js/data-filter-query-manager/index'

import { ZERO_OPTIONS } from '../../../../constants'

import { formatToSlug } from '../../../../js/utils'

import makeStyles from '@material-ui/core/styles/makeStyles'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import IconButton from '@material-ui/core/IconButton'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: '-webkit-fill-available'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

const BaseDataFilterSelect = ({ dataFilterKey, selectType, helperText, label, loadingMessage }) => {
  const { state } = useContext(DataFilterContext)
  const { loading, error, data } = useQuery(DFQM.getQuery(dataFilterKey, state), DFQM.getVariables(state))

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
      {selectType === 'Single' &&
        <BaseDataFilterSingleSelect dataFilterKey={dataFilterKey} label={label} data={data} helperText={helperText} />
      }
      {selectType === 'Multi' &&
        <BaseDataFilterMultiSelector dataFilterKey={dataFilterKey} label={label} data={data} helperText={helperText} />
      }
    </React.Fragment>
  )
}

export default BaseDataFilterSelect

BaseDataFilterSelect.propTypes = {
  /**
   * The key to retrieve the appropriate option values and store selected values
   */
  dataFilterKey: PropTypes.string.isRequired,
  /**
   * Specify the selection type
   */
  selectType: PropTypes.oneOf(['Single', 'Multi']).isRequired,
  /**
   * Text that displays below the select box to provide additional instructions
   */
  helperText: PropTypes.string,
  /**
   * Text that displays on the component
   */
  label: PropTypes.string.isRequired,
  /**
   * The message that shows in the loading screen
   */
  loadingMessage: PropTypes.string
}
BaseDataFilterSelect.defaultProps = {
  loadingMessage: 'Updating data filters from server...',
  selectType: 'Single'
}

const BaseDataFilterSingleSelect = ({ dataFilterKey, label, data, helperText }) => {
  // console.log('dataFilterKey, data: ', dataFilterKey, data)
  const classes = useStyles()
  const labelSlug = formatToSlug(label)

  const { state, updateDataFilter } = useContext(DataFilterContext)

  const handleChange = event => {
    if (event.target.value.includes('Clear')) {
      handleClearAll()
    }
    else {
      updateDataFilter({ [dataFilterKey]: event.target.value.toString() })
    }
  }

  useEffect(() => {
    if (data && data.options.length === 0) {
      updateDataFilter({ [dataFilterKey]: ZERO_OPTIONS })
    }
    else if (state[dataFilterKey] === ZERO_OPTIONS) {
      handleClearAll()
    }
  }, [data])

  const handleClearAll = () => updateDataFilter({ [dataFilterKey]: undefined })

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormControl className={classes.formControl} disabled={(data && data.options.length === 0)}>
          <InputLabel id={`${ labelSlug }-select-label`}>{label}</InputLabel>
          <Select
            labelId={`${ labelSlug }-select-label`}
            id={`${ labelSlug }-select`}
            value={(state[dataFilterKey] === ZERO_OPTIONS || !state[dataFilterKey]) ? '' : state[dataFilterKey]}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value={'Clear'} disabled={(!state[dataFilterKey])}>
              <ListItemText primary={'Clear selected'} />
            </MenuItem>
            {data &&
              data.options.map((item, i) =>
                <MenuItem key={`${ item.option }_${ i }`} value={item.option}><ListItemText primary={item.option} /></MenuItem>)
            }
          </Select>
          {helperText &&
            <FormHelperText>{helperText}</FormHelperText>
          }
          {(data && data.options.length === 0) &&
            <FormHelperText>No '{label}' match the current filter options.</FormHelperText>
          }
        </FormControl>
      </Grid>
    </Grid>
  )
}

const BaseDataFilterMultiSelector = ({ dataFilterKey, label, data, helperText }) => {
  const classes = useStyles()
  const labelSlug = formatToSlug(label)
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const [selectedOptions, setSelectedOptions] = useState((state[dataFilterKey] === ZERO_OPTIONS || !state[dataFilterKey]) ? '' : state[dataFilterKey])

  const handleChange = event => {
    if (event.target.value.includes('Clear')) {
      handleClearAll()
    }
    else {
      setSelectedOptions(event.target.value.toString())
    }
  }

  const handleClose = event => {
    if (!(selectedOptions.length === 0 && !state[dataFilterKey]) && (selectedOptions !== state[dataFilterKey])) {
      updateDataFilter({ [dataFilterKey]: selectedOptions })
    }
  }

  useEffect(() => {
    if (data && data.options.length === 0) {
      updateDataFilter({ [dataFilterKey]: ZERO_OPTIONS })
    }
    else if (state[dataFilterKey] === ZERO_OPTIONS) {
      handleClearAll()
    }
  }, [data])

  const handleClearAll = () => {
    setSelectedOptions('')
    if (state[dataFilterKey]) {
      updateDataFilter({ [dataFilterKey]: undefined })
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormControl className={classes.formControl} disabled={(data && data.options.length === 0)}>
          <InputLabel id={`${ labelSlug }-select-label`}>{label}</InputLabel>
          <Select
            labelId={`${ labelSlug }-select-label`}
            id={`${ labelSlug }-select`}
            multiple
            value={selectedOptions.length > 0 ? selectedOptions.split(',') : []}
            renderValue={selected => selected && selected.join(', ')}
            input={<Input />}
            onChange={handleChange}
            onClose={handleClose}
          >
            <MenuItem value={'Clear'} disabled={(selectedOptions.length === 0)}>
              <ListItemText primary={'Clear selected'} />
            </MenuItem>
            {data &&
              data.options.map(
                (item, i) => <MenuItem key={`${ item.option }_${ i }`} value={item.option}>
                  <Checkbox checked={selectedOptions.includes(item.option)} />
                  <ListItemText primary={item.option} />
                </MenuItem>)
            }
          </Select>
          {helperText &&
            <FormHelperText>{helperText}</FormHelperText>
          }
          {(data && data.options.length === 0) &&
            <FormHelperText>No '{label}' match the current filter options.</FormHelperText>
          }
        </FormControl>
      </Grid>
    </Grid>
  )
}
