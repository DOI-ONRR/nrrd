import React, { useContext, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { AppStatusContext } from '../../../stores/app-status-store'
import DFQM from '../../../js/data-filter-query-manager'

import { range } from '../../../js/utils'

import makeStyles from '@material-ui/core/styles/makeStyles'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Box from '@material-ui/core/Box'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(3),
    marginBottom: '0px',
    minWidth: '350px',
    width: '-webkit-fill-available',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  MuiSlider: {
    color: theme.palette.links.default,
    marginBottom: '30px',
    top: '-5px`'
  },
  MuiSliderMark: {
    backgroundColor: 'white',
  },
  MuiSliderRail: {
    backgroundColor: theme.palette.grey[500],
  },
  thumb: {
    color: theme.palette.links.default,
    width: 50,
    height: 25,
    marginTop: -12,
    borderRadius: 4,
  },
  valueLabel: {
    color: 'transparent',
    top: -5,
    '& span': {
      '& span': {
        paddingTop: '20px',
        color: 'white',
        fontSize: theme.typography.h5.fontSize,
        fontWeight: theme.typography.h5.fontWeight,
      }
    }
  },
}))

const BaseDataFilterRangeSlider = ({ dataFilterKey, label = 'Years', helperText, loadingMessage = 'Updating...' }) => {
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
    return () => {
      if (loading) {
        updateLoadingStatus({ status: false, message: loadingMessage })
      }
    }
  }, [loading])

  return (
    <React.Fragment>
      <BaseDataFilterRangeSliderImpl dataFilterKey={dataFilterKey} data={data} label={label} helperText={helperText} />
    </React.Fragment>
  )
}

export default BaseDataFilterRangeSlider

const BaseDataFilterRangeSliderImpl = ({ dataFilterKey, label, data, helperText }) => {
  const classes = useStyles()
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const handleChange = (event, newValue) => {
    updateDataFilter({ [dataFilterKey]: range(newValue[0], newValue[newValue.length - 1]).toString() })
  }

  useEffect(() => {
    if (data && data.options.length === 0) {
      updateDataFilter({ [dataFilterKey]: undefined })
    }
  }, [data])

  const currentYears = state[dataFilterKey] ? state[dataFilterKey].split(',') : []

  const yearOptions = (data && data.options.length > 0) && data.options.map(item => item.option)

  const getCurrentValues = () => {
    let values = []
    if (currentYears.length > 0) {
      values = [parseInt(currentYears[0]), parseInt(currentYears[currentYears.length - 1])]
    }
    else if (yearOptions && yearOptions.length > 0) {
      values = [yearOptions[0], yearOptions[yearOptions.length - 1]]
    }
    return values
  }
  const getCurrentValuesText = () => {
    let valuesText = ''
    if (currentYears.length > 0) {
      valuesText = valuesText.concat(`${ currentYears[0] } - ${ currentYears[currentYears.length - 1] }`)
    }
    else if (yearOptions && yearOptions.length > 0) {
      valuesText = valuesText.concat(`${ yearOptions[0] } - ${ yearOptions[yearOptions.length - 1] }`)
    }
    return valuesText
  }

  return (
    <Box width={'500px'}>
      <FormControl className={classes.formControl} disabled={(data && data.options.length === 0)}>
        {yearOptions &&
            <Slider
              defaultValue={getCurrentValues()}
              getAriaValueText={getCurrentValuesText}
              step={1}
              onChangeCommitted={handleChange}
              marks
              min={yearOptions[0]}
              max={yearOptions[yearOptions.length - 1]}
              valueLabelDisplay="on"
              classes={{
                root: classes.MuiSlider,
                valueLabel: classes.valueLabel,
                thumb: classes.thumb,
                mark: classes.MuiSliderMark,
                rail: classes.MuiSliderRail
              }}/>
        }
        {helperText &&
            <FormHelperText>{helperText}</FormHelperText>
        }
        {(data && data.options.length === 0) &&
            <FormHelperText>No '{label}' match the current filter options.</FormHelperText>
        }
      </FormControl>
    </Box>
  )
}
