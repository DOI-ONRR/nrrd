import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

import {
  FormGroup,
  FormControl,
  FormControlLabel,
  Switch
} from '@material-ui/core'

import { withStyles, createStyles } from '@material-ui/styles'

import { DataFilterContext } from '../../../stores/data-filter-store'

// Default FormControlLabel
const DefaultFormControlLabel = withStyles(theme =>
  createStyles({
    label: {
      fontSize: theme.typography.caption.fontSize
    }
  })
)(({ classes, ...props }) => {
  return (
    <FormControlLabel
      classes={{
        label: classes.label
      }}
      {...props}
    />
  )
})

// DefaultSwitch styling
const DefaultSwitch = withStyles(theme =>
  createStyles({
    switchBase: {
      '&$checked': {
        color: theme.palette.links.default,
        '& + $track': {
          backgroundColor: theme.palette.links.default,
        },
      },
    },
    checked: {},
    track: {}
  })
)(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  )
})

const BaseSwitch = ({ dataFilterKey, dataOptions, checked, selectType, label, legend, helperText, disabled }) => {
  return (
    <>
      {selectType === 'Single' &&
        <SingleBaseSwitch
          dataFilterKey={dataFilterKey}
          data={dataOptions}
          label={label}
          isChecked={checked}
          helperText={helperText}
          disabled={disabled}
        />
      }

      {selectType === 'Group' &&
        <GroupBaseSwitch
          dataFilterKey={dataFilterKey}
          data={dataOptions}
          label={label}
          helperText={helperText}
        />
      }
    </>
  )
}

export default BaseSwitch

// BaseSwitch propTypes
BaseSwitch.propTypes = {
  dataFilterKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  legend: PropTypes.string,
  helperText: PropTypes.string,
  checked: PropTypes.bool
}

// Group switch
const GroupBaseSwitch = ({ dataFilterKey, dataOptions, selectType, label, legend, helperText }) => {
  const [state, setState] = useState({
    checked: false
  })

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

  return (
    <FormControl component="fieldset">
      {legend &&
          <FormLabel component="legend">{legend}</FormLabel>
      }
      <FormGroup>
        {dataOptions &&
          dataOptions.map((item, i) =>
            <DefaultFormControlLabel
              control={
                <DefaultSwitch
                  checked={item.checked}
                  onChange={handleChange}
                  name={item} />
              }
              label={item.label}
            />
          )
        }
      </FormGroup>
      {helperText &&
        <FormHelperText>{helperText}</FormHelperText>
      }
    </FormControl>
  )
}

// Single switch
const SingleBaseSwitch = ({ dataFilterKey, selectType, label, legend, helperText, isChecked, disabled }) => {
  const { state, updateDataFilter } = useContext(DataFilterContext)

  const [switchState, setSwitchState] = useState({
    checked: isChecked || false
  })

  const handleChange = event => {
    setSwitchState({ ...switchState, [event.target.name]: event.target.checked })
    updateDataFilter({ ...state, [dataFilterKey]: event.target.checked })
  }

  return (
    <FormControl component="fieldset">
      {legend &&
          <FormLabel component="legend">{legend}</FormLabel>
      }
      <FormGroup>
        <DefaultFormControlLabel
          control={
            <DefaultSwitch
              checked={switchState.checked}
              onChange={handleChange}
              name="checked"
              disabled={disabled}
            />
          }
          label={label}
        />
      </FormGroup>
      {helperText &&
        <FormHelperText>{helperText}</FormHelperText>
      }
    </FormControl>
  )
}
