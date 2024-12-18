import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  Box,
  FormGroup,
  FormControl,
  FormControlLabel,
  Switch,
  Tooltip
} from '@material-ui/core'

import { withStyles, createStyles, makeStyles } from '@material-ui/core/styles'

import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 'fit-content',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  iconRoot: {
    fill: theme.palette.common.black,
    position: 'absolute',
    top: 10,
    right: -10,
    cursor: 'pointer',
  },
  iconFontSizeSmall: {
    fontSize: 20,
  },
  tooltipRoot: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
}))

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
    root: {
      margin: 0,
    },
    switchBase: {
      '&$checked': {
        color: theme.palette.links.default,
        '& + $track': {
          backgroundColor: theme.palette.links.default,
        },
      },
    },
    checked: {},
    track: {
      '@media screen and (-ms-high-contrast: active)': {
        border: '1px solid currentColor'
      }
    },
    thumb: {
      '@media screen and (-ms-high-contrast: active)': {
        border: '1px solid currentColor'
      }
    }
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
/*
* This is used to show offshore on the map in “Explore data”. An example exists
* after clicking on the “Map level State and offshore” button in [Explore data](https://revenuedata.doi.gov/explore).
*/
const BaseSwitch = ({ onChange, dataFilterKey, data, defaultSelected, checked, selectType, label, legend, helperText, disabled }) => {
  // Group switch
  const GroupBaseSwitch = ({ onChange, dataFilterKey, defaultSelected, data, selectType, label, legend, helperText }) => {
    const [state, setState] = useState({
      checked: defaultSelected
    })

    const handleChange = event => {
      setState({ ...state, [event.target.name]: event.target.checked })
      onChange(event.target.checked)
    }

    return (
      <FormControl>
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
  const SingleBaseSwitch = ({ onChange, dataFilterKey, defaultSelected, label, legend, helperText, disabled }) => {
    const classes = useStyles()
    const [switchState, setSwitchState] = useState({
      checked: defaultSelected
    })

    const noop = () => {}
    onChange = onChange || noop

    const handleChange = event => {
      setSwitchState({ ...switchState, [event.target.name]: event.target.checked })
      onChange(event.target.checked)
    }

    const helperContent = () => {
      return (
        <>
          <Box component="span" className={classes.formHelperTextRoot}>
            {helperText}
          </Box>
        </>
      )
    }

    return (
      <FormControl className={classes.formControl}>
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

        {(helperText && disabled) &&
        <Tooltip
          title={helperContent()}
          classes={{
            tooltip: classes.tooltipRoot,
            arrow: classes.tooltipArrow,
          }}>
          <HelpOutlineIcon
            fontSize="small"
            classes={{
              root: classes.iconRoot,
              fontSizeSmall: classes.iconFontSizeSmall
            }} />
        </Tooltip>
        }
      </FormControl>
    )
  }

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
          onChange={onChange}
        />
      }

      {selectType === 'Group' &&
        <GroupBaseSwitch
          dataFilterKey={dataFilterKey}
          data={data}
          defaultSelected={defaultSelected}
          label={label}
          helperText={helperText}
          onChange={onChange}
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

BaseSwitch.Preview = {
  group: 'Inputs',
  demos: [
    {
      title: 'Single',
      code: '<BaseSwitch label={"Enable access"} selectType={"Single"} />',
    }
  ]
}
