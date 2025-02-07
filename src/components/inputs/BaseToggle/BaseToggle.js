import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  FormControl,
  FormLabel,
  FormHelperText
} from '@material-ui/core'

import {
  withStyles,
  createStyles,
  makeStyles
} from '@material-ui/core/styles'

import {
  ToggleButton
} from '@material-ui/lab'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: 0,
    minWidth: 'fit-content',
    '& svg': {
      fill: theme.palette.links.default,
      maxWidth: '.75em',
      maxHeight: '.75em',
      marginRight: '.25em',
    },
    // '& span': {
    //   textTransform: 'lowercase'
    // },
    // '& span::first-letter': {
    //   textTransform: 'uppercase'
    // }
  },
}))

// DefaultToggleButton Styles
const DefaultToggleButton = withStyles(theme =>
  createStyles({
    root: {
      borderStyle: 'none',
      color: 'black',
      backgroundColor: 'transparent',
      minWidth: 'fit-content',
      minHeight: 'inherit',
      height: 50,
      padding: '0 15px',
      '& h1': {
        fontWeight: 'normal',
        fontSize: '1.125rem',
        margin: 0,
      },
      '& h1:first-letter': {
        textTransform: 'capitalize',
      },
      '&.Mui-selected': {
        color: 'black',
        backgroundColor: theme.palette.primary.main,
        borderRadius: 0,
        height: '100%',
        margin: 0,
        zIndex: '1',
        fontWeight: 'bold',
        '& h1': {
          fontWeight: 'bold',
          fontSize: '1.125rem',
          margin: 0,
        },
        '& h1:first-letter': {
          textTransform: 'capitalize'
        }
      },
      '&.Mui-selected:hover': {
        color: 'black',
        backgroundColor: theme.palette.primary.main,
        fontWeight: 'bold',
      }
    },
    label: {
      textTransform: 'Capitalize',
    },
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

const BaseToggle = ({ onChange, selected, defaultSelected, data, label, legend, helperText, children, ...props }) => {
  if (data && data.length > 0 && !data[0].option) {
    data = data.map(item => ({ option: item }))
  }
  else if (!data) {
    data = []
  }

  const classes = useStyles()
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
    <FormControl className={classes.formControl}>
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
