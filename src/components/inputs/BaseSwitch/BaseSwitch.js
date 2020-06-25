import React, { useState, useContext, useEffect } from 'react'
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

const BaseSwitch = ({ dataFilterKey, data, defaultSelected, checked, selectType, label, legend, helperText, disabled }) => {
  return (
    <>
      {selectType === 'Single' &&
        <SingleBaseSwitch
          dataFilterKey={dataFilterKey}
          data={data}
          defaultSelected={defaultSelected}
          label={label}
          isChecked={checked}
          helperText={helperText}
          disabled={disabled}
        />
      }

      {selectType === 'Group' &&
        <GroupBaseSwitch
          dataFilterKey={dataFilterKey}
          data={data}
          defaultSelected={defaultSelected}
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
const GroupBaseSwitch = ({ dataFilterKey, defaultSelected, data, selectType, label, legend, helperText }) => {
  const { state: filterState, updateDataFilter } = useContext(DataFilterContext)
  const [state, setState] = useState({
    checked: defaultSelected
  })

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

  useEffect(() => {
    updateDataFilter({ ...filterState, [dataFilterKey]: state.checked })
  }, state)

  return (
    <FormControl component="fieldset">
      {legend &&
          <FormLabel component="legend">{legend}</FormLabel>
      }
      <FormGroup>
        {data &&
          data.map((item, i) =>
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
const SingleBaseSwitch = ({ dataFilterKey, defaultSelected, label, legend, helperText, disabled }) => {
  const { state: filterState, updateDataFilter } = useContext(DataFilterContext)

  const [switchState, setSwitchState] = useState({
    checked: defaultSelected
  })

  const handleChange = event => {
    setSwitchState({ ...switchState, [event.target.name]: event.target.checked })
    updateDataFilter({ ...filterState, [dataFilterKey]: event.target.checked })
  }

  useEffect(() => {
    updateDataFilter({ ...filterState, [dataFilterKey]: switchState.checked })
  }, switchState)

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
