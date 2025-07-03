import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  FormControl,
  FormLabel,
  FormHelperText
} from '@material-ui/core'

import {
  withStyles,
  createStyles
} from '@material-ui/styles'

import {
  ToggleButton,
  ToggleButtonGroup
} from '@material-ui/lab'

// DefaultToggleButton Styles
const DefaultButton = withStyles(theme =>
  createStyles({
    root: {
      color: theme.palette.grey[900],
      padding: '6px 11px',
      '&.Mui-selected': {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.links.default,
      }
    },
    label: {
      textTransform: 'Capitalize',
    }
  })
)(({ classes, ...props }) => {
  return (
    <ToggleButton
      classes={{
        root: classes.root,
        label: classes.label,
      }}
      {...props}
    />
  )
})

// DefaultToggleButtonGroup Styles
const DefaultToggleButtonGroup = withStyles(theme =>
  createStyles({
    root: {
      border: 'none',
      backgroundColor: 'transparent',
      minHeight: 'inherit',
    },
  })
)(({ classes, ...props }) => {
  return (
    <ToggleButtonGroup
      classes={{
        root: classes.root,
        label: classes.label,
      }}
      {...props}
    />
  )
})
/**
 * This is the base component to create a multi toggle group.
 */
const BaseMultiToggle = ({ onChange, data, defaultSelected, label, legend, helperText, size, disabled, ...props }) => {
  if (data && data.length > 0 && !data[0].option) {
    data = data.map(item => ({ option: item }))
  }
  else if (!data) {
    data = []
  }

  const noop = () => {}
  onChange = onChange || noop

  const [toggleState, setToggleState] = useState(defaultSelected)

  const handleChange = (event, newVal) => {
    if (newVal !== null) {
      setToggleState(newVal)
      onChange(newVal)
    }
  }

  return (
    <FormControl style={{ minWidth: 'fit-content' }} disabled={disabled}>
      {legend &&
        <FormLabel component="legend" style={{ transform: 'translate(0, -3px) scale(0.75)' }}>{legend}</FormLabel>
      }
      <DefaultToggleButtonGroup
        value={toggleState}
        exclusive
        onChange={handleChange}
        aria-label={label}
        size={size}
        {...props}>
        {
          data &&
           data.map((item, i) =>
             <DefaultButton 
               value={item.value} 
               aria-label={item.option} 
               key={`toogleButton__${ i }`} 
               disabled={disabled}>
               {item.option}
             </DefaultButton>
           )}
      </DefaultToggleButtonGroup>

      {helperText &&
        <FormHelperText>{helperText}</FormHelperText>
      }
    </FormControl>
  )
}

export default BaseMultiToggle

BaseMultiToggle.propTypes = {
  /** Set the collapsible content to show by default */
  data: PropTypes.array,
}

BaseMultiToggle.Preview = {
  group: 'Inputs',
  demos: [
    {
      title: 'Simple',
      code: '<BaseMultiToggle label="Simple Items" data={["item1", "item2", "item3"]} />',
    }
  ]
}
