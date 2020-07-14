import React, { useState, useEffect } from 'react'
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
const DefaultToggleButton = withStyles(theme =>
  createStyles({
    root: {
      borderStyle: 'none',
      color: 'black',
      backgroundColor: 'transparent',
      minWidth: 'fit-content',
      minHeight: 'inherit',
      padding: '10px',
      margin: '5px',
      marginTop: '11px',
      '&.Mui-selected': {
        color: 'black',
        backgroundColor: theme.palette.primary.main,
        borderRadius: '0px',
        borderTop: '1px solid rgba(0,0,0,0.2)',
        borderLeft: '1px solid rgba(0,0,0,0.2)',
        borderRight: '1px solid rgba(0,0,0,0.2)',
        height: '100%',
        marginBottom: '0px',
        marginTop: '0px',
        top: '2px',
        zIndex: '1'
      },
      '&.Mui-selected:hover': {
        color: 'black',
        backgroundColor: theme.palette.primary.main,
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
const BaseToggle = ({ onChange, selected, defaultSelected, data, label, legend, helperText, children, ...props }) => {
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
    setToggleState(!toggleState)
    onChange(toggleState)
  }

  useEffect(() => {
    if (selected !== toggleState) {
      setToggleState(selected)
    }
  }, [selected])

  return (
    <FormControl style={{ minWidth: 'fit-content' }}>
      {legend &&
        <FormLabel component="legend" style={{ transform: 'translate(0, -3px) scale(0.75)' }}>{legend}</FormLabel>
      }
      { data &&
          data.map((item, i) =>
            <DefaultToggleButton key={`${ i }`}value={item.option} selected={toggleState} aria-label={item.option} onChange={handleChange}>
              {children
                ? <>{children}</>
                : <>{item.option}</>
              }
            </DefaultToggleButton>
          )
      }
      {helperText &&
        <FormHelperText>{helperText}</FormHelperText>
      }
    </FormControl>
  )
}

export default BaseToggle

BaseToggle.propTypes = {
  /**
   * Data array used for building toggle items
   */
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
}
