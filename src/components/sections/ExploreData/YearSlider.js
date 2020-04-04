import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import {
  Slider,
  Box,
  Grid
} from '@material-ui/core'

import { StoreContext } from '../../../store'

const useStyles = makeStyles(theme => ({
  sliderBox: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    zIndex: 101,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    top: 0,
  },
  sliderRoot: {
  },
  sliderMarkLabel: {
    fontWeight: 'bold',
    top: '28px',
    color: theme.palette.primary.dark,
    fontSize: '1rem',
  },
  sliderMarkLabelActive: {
    fontWeight: 'bold',
    boxShadow: 'none',
  },
  sliderTrack: {
    height: 4,
    backgroundColor: 'transparent',
  },
  sliderRail: {
    height: 4,
    backgroundColor: theme.palette.grey['500']
  },
  sliderMark: {
    height: 4,
    backgroundColor: theme.palette.common.white,
    width: 0,
  },
  sliderActive: {
    boxShadow: 'none',
    transition: 'none',
    borderRadius: 0,
  },
  sliderThumb: {
    marginTop: -4,
    boxShadow: 'none',
    transition: 'none',
    '&:hover': {
      boxShadow: 'none',
      transition: 'none',
    },
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  sliderValueLabel: {
    width: 60,
    top: -2,
    left: 'calc(-50% + -18px)',
    transform: 'rotate(0deg)',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: theme.palette.links.default,
    color: theme.palette.primary.contrastText,
    '& span': {
      width: 60,
      transform: 'rotate(0)',
      borderRadius: 0,
      textAlign: 'center',
      color: `${ theme.palette.common.white } !important`,
      backgroundColor: theme.palette.links.default,
    },
  },
}))

const YearSlider = props => {
  const classes = useStyles()
  const { state } = useContext(StoreContext)

  const data = props.data
  const year = state.year

  let periodData
  let minYear
  let maxYear

  if (data) {
    periodData = data

    // set min and max trend years
    minYear = periodData.reduce((min, p) => p.fiscal_year < min ? p.fiscal_year : min, periodData[0].fiscal_year)
    maxYear = periodData.reduce((max, p) => p.fiscal_year > max ? p.fiscal_year : max, periodData[periodData.length - 1].fiscal_year)
  }

  const customMarks = [
    {
      label: minYear,
      value: minYear
    },
    {
      label: maxYear,
      value: maxYear
    }
  ]

  return (
    <Box id="year-slider" className={classes.sliderBox}>
      <Grid container spacing={4}>
        <Grid item xs>
          <Slider
            defaultValue={year}
            aria-label="Year slider"
            aria-labelledby="year-slider"
            aria-valuetext={year.toString()}
            valueLabelDisplay="on"
            step={1}
            onChangeCommitted={(e, yr) => {
              props.onYear(yr)
            }}
            marks={customMarks}
            min={minYear}
            max={maxYear}
            classes={{
              root: classes.sliderRoot,
              markLabel: classes.sliderMarkLabel,
              markLabelActive: classes.sliderMarkLabelActive,
              track: classes.sliderTrack,
              rail: classes.sliderRail,
              mark: classes.sliderMark,
              active: classes.sliderActive,
              thumb: classes.sliderThumb,
              valueLabel: classes.sliderValueLabel,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default YearSlider

YearSlider.propTypes = {
  // Get year that is passed into slider
  onYear: PropTypes.func.isRequired
}
