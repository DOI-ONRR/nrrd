import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import {
  Slider,
  Box,
  Grid
} from '@material-ui/core'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    bottom: 0,
    width: '100vw',
    maxWidth: '100%',
    '& .sticky-outer-wrapper.sticky .slider-wrapper': {
      top: 0,
    }
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: theme.spacing(1),
    zIndex: 101,
    paddingBottom: theme.spacing(0),
    borderTop: `1px solid ${ theme.palette.grey[300] }`,
    borderBottom: `1px solid ${ theme.palette.grey[300] }`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    '@media (max-width: 768px)': {
      paddingTop: 0,
    },
  },
  sliderBox: {
    position: 'relative',
    boxSizing: 'border-box',
    margin: '0 20px',
    zIndex: 101,
    padding: 0,
    top: 6,
    minWidth: 295,
    flexGrow: 1,
  },
  sliderRoot: {
    width: '85%',
    display: 'block',
    margin: '0 auto',
  },
  sliderMarkLabel: {
    fontWeight: 'bold',
    top: 25,
    color: theme.palette.primary.dark,
    fontSize: '1rem',
    '@media (max-width: 768px)': {
      top: 30,
    },
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
    backgroundColor: theme.palette.grey['500'],
    '@media screen and (-ms-high-contrast: active)': {
      border: '1px solid currentColor'
    }
  },
  sliderMark: {
    height: 4,
    backgroundColor: theme.palette.common.white,
    width: 1,
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
    borderRadius: 4,
    '& span': {
      borderRadius: 4,
    },
    '&:hover': {
      boxShadow: 'none',
      transition: 'none',
    },
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  sliderValueLabel: {
    width: 50,
    top: -2,
    left: 'calc(-50% + -12px)',
    transform: 'rotate(0deg)',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: theme.palette.links.default,
    color: theme.palette.primary.contrastText,
    '& span': {
      width: 50,
      transform: 'rotate(0)',
      borderRadius: 4,
      textAlign: 'center',
      color: `${ theme.palette.common.white } !important`,
      backgroundColor: theme.palette.links.default
    },
    '& > span:first-child': {
      border: `1px solid ${ theme.palette.links.default }`,
    }
  },
  sliderYearDisplay: {
    color: theme.palette.grey[900],
    background: theme.palette.grey[100],
    fontWeight: 'bold',
    width: 175,
    borderRadius: 4,
    margin: '0 auto',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    position: 'relative',
    top: -14,
    textAlign: 'center',
    '@media (max-width: 768px)': {
      top: -5,
    },
  },
}))

const YearSlider = props => {
  const classes = useStyles()

  const { state: filterState, updateDataFilter } = useContext(DataFilterContext)
  const {
    year,
    period,
    fiscalYear,
    calendarYear,
    periodAllYears
  } = filterState

  const handleOnchange = year => {
    updateDataFilter({ ...filterState, [DFC.YEAR]: year })
  }

  useEffect(() => {
    updateDataFilter({ ...filterState, [DFC.YEAR]: (period === DFC.PERIOD_CALENDAR_YEAR) ? calendarYear : fiscalYear })
  }, [period])

  const customMarks = []

  const minYear = periodAllYears[period][0]
  const maxYear = (period === DFC.PERIOD_FISCAL_YEAR) ? parseInt(fiscalYear) : parseInt(calendarYear)
  // console.debug('period all years: ', periodAllYears)
  customMarks.push(
    {
      label: minYear.toString(),
      value: minYear
    },
    {
      label: maxYear.toString(),
      value: maxYear
    }
  )

  return (
    <Box id="year-slider" className={classes.sliderBox}>
      <Grid container spacing={2}>
        <Grid item>
          {minYear}
        </Grid>
        <Grid item xs>
          <Slider
            key={`slider__${ year }__${ period }`}
            defaultValue={year}
            aria-label="Year slider"
            aria-labelledby="year-slider"
            aria-valuetext={year && year.toString()}
            valueLabelDisplay="on"
            valueLabelFormat={label => label}
            step={1}
            onChangeCommitted={(e, yr) => {
              handleOnchange(yr)
            }}
            marks={true}
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
        <Grid item>
          {maxYear}
        </Grid>
      </Grid>
    </Box>
  )
}

export default YearSlider

YearSlider.propTypes = {
  // Get year that is passed into slider
  onYear: PropTypes.func
}
