import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

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

import { DataFilterContext } from '../../../stores/data-filter-store'

// DefaultToggleButton Styles
const DefaultToggleButton = withStyles(theme =>
  createStyles({
    root: {
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

const BaseToggle = ({ dataFilterKey, data, label, legend, helperText, ...props }) => {
  const { state: filterState, updateDataFilter } = useContext(DataFilterContext)
  const [toggleState, setToggleState] = useState(filterState[dataFilterKey] || data.options[0].value)

  const handleChange = (event, newVal) => {
    setToggleState(newVal)
    updateDataFilter({ ...filterState, [dataFilterKey]: newVal })
  }

  return (
    <FormControl component="fieldset">
      {legend &&
        <FormLabel component="legend" style={{ transform: 'translate(0, -3px) scale(0.75)' }}>{legend}</FormLabel>
      }
      <FormGroup>
        <ToggleButtonGroup
          value={toggleState}
          exclusive
          onChange={handleChange}
          aria-label={label}
          {...props}
        >
          { data &&
            data.options.map((item, i) =>
              <DefaultToggleButton value={item.value} aria-label={item.option}>
                {item.option}
              </DefaultToggleButton>
            )
          }
        </ToggleButtonGroup>
      </FormGroup>
      {helperText &&
        <FormHelperText>{helperText}</FormHelperText>
      }
    </FormControl>
  )
}

export default BaseToggle

BaseToggle.propTypes = {
  /**
   * The data filter key used for data filter context
   */
  dataFilterKey: PropTypes.string.isRequired,
  /**
   * Data array used for building toggle items
   */
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  /**
   * Label used for aria-label on ToggleButtonGroup
   */
  label: PropTypes.string.isRequired,
}
