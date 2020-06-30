import React, { useEffect, useState } from 'react'

import {
  FormControl,
  FormLabel,
  FormGroup,
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
  console.log(classes)
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

const BaseMultiToggle = ({ onChange, data, ...props }) => {
  if (data && data.length > 0 && !data[0].option) {
    data = data.map(item => ({ option: item }))
  }
  else if (!data) {
    data = []
  }
  console.log('BaseMultiToggle data: ', data)
  const noop = () => {}
  onChange = onChange || noop

  console.log('BaseMultiToggle props: ', props)

  const {
    defaultSelected,
    label,
    legend,
    helperText,
    size
  } = props

  const [toggleState, setToggleState] = useState(defaultSelected)

  const handleChange = (event, newVal) => {
    setToggleState(newVal)
  }

  return (
    <FormControl style={{ minWidth: 'fit-content' }}>
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
             <DefaultButton value={item.value} aria-label={item.option} key={`toogleButton__${ i }`}>
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
