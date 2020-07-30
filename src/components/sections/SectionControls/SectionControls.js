import React, { useState, useEffect, useRef } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Grid, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'

import CONSTANTS from '../../../js/constants'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
    textAlign: 'right',
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  periodFormControlContainer: {
    textAlign: 'right',
    '@media (max-width: 426px)': {
      textAlign: 'left',
    },
  }
}))

const SectionControls = props => {
  const classes = useStyles()

  const inputLabel = useRef(null)

  const TOGGLE_VALUES = props.toggleValues
  const MONTHLY_DROPDOWN_VALUES = props.monthlyDropdownValues
  const YEARLY_DROPDOWN_VALUES = props.yearlyDropdownValues

  const [labelWidth, setLabelWidth] = useState(0)

  const disabled = props.disabledInput

  const handleToggle = (event, newVal) => {
    props.onToggleChange(newVal)
  }

  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth)
  }, [])

  const handleChange = event => {
    props.onMenuChange(event.target.value)
  }

  return (
    <>
      <Grid item xs={12} sm={6}>
        <ToggleButtonGroup
          value={props.toggle}
          exclusive
          onChange={handleToggle}
          size="large"
          aria-label="Toggle between Yearly and Monthly data">
          {
            Object.values(TOGGLE_VALUES).map((item, i) => (
              <ToggleButton
                key={i}
                value={item}
                aria-label={item}
                disableRipple>
                { item === TOGGLE_VALUES.Year ? CONSTANTS.YEARLY : CONSTANTS.MONTHLY }
              </ToggleButton>
            ))
          }
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={12} sm={6} className={classes.periodFormControlContainer}>
        <FormControl variant="outlined" className={classes.formControl} disabled={disabled}>
          <InputLabel ref={inputLabel} id="select-period-outlined-label">
            Period
          </InputLabel>
          <Select
            labelId="Period select"
            id="period-label-select-outlined"
            value={props.period}
            onChange={handleChange}
            labelWidth={labelWidth}
          >
            {
              (props.toggle === TOGGLE_VALUES.Year)
                ? Object.values(YEARLY_DROPDOWN_VALUES).map((item, i) => (
                  <MenuItem key={i} value={item}>{ item === YEARLY_DROPDOWN_VALUES.Calendar ? CONSTANTS.CALENDAR_YEAR : CONSTANTS.FISCAL_YEAR }</MenuItem>
                ))
                : Object.values(MONTHLY_DROPDOWN_VALUES).map((item, i) => (
                  <MenuItem value={item} key={i}>
                    {(() => {
                      switch (item) {
                      case MONTHLY_DROPDOWN_VALUES.Fiscal:
                        return `Fiscal year ${ props.maxFiscalYear }`
                      case MONTHLY_DROPDOWN_VALUES.Calendar:
                        return `Calendar year ${ props.maxCalendarYear }`
                      default:
                        return 'Most recent 12 months'
                      }
                    })()}
                  </MenuItem>
                ))
            }
          </Select>
        </FormControl>
      </Grid>
    </>
  )
}

export default SectionControls
