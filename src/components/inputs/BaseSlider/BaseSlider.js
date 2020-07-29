import React, { useState, useContext } from 'react'

import PropTypes from 'prop-types'

import { range } from '../../../js/utils'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Slider,
  Box,
  Grid
} from '@material-ui/core'

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
    display: 'block',
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
    backgroundColor: theme.palette.links.default,
  },
  sliderRail: {
    height: 4,
    backgroundColor: theme.palette.grey['500'],
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
    backgroundColor: theme.palette.links.default,
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
    backgroundColor: 'transparent',
    color: theme.palette.primary.contrastText,
    '& span': {
      width: 50,
      transform: 'rotate(0)',
      borderRadius: 4,
      textAlign: 'center',
      color: `${ theme.palette.common.white } !important`,
      backgroundColor: 'transparent',
    },
    '& div': {
      width: 50,
      transform: 'rotate(0)',
      borderRadius: 4,
      textAlign: 'center',
      color: `${ theme.palette.common.white } !important`,
      backgroundColor: theme.palette.links.default,
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

const BaseSlider = ({ data, onChange, defaultValue, selected, label, ...restProps }) => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const noop = () => {}
  onChange = onChange || noop
  if (data && data.length > 0 && !data[0].option) {
    data = data.map(item => ({ option: item }))
  }
  else if (!data) {
    data = []
  }

  const handleChange = (event, newValue) => {
    setSelectedOptions(newValue)
  }
  const handleChangeCommit = (event, newValue) => {
    onChange(range(newValue[0], newValue[1]).toString())
  }
  const [selectedOptions, setSelectedOptions] = useState(selected)

  const minValue = (data && data.length > 0) ? data[0].option : undefined
  const maxValue = (data && data.length > 0) ? data.slice(-1)[0].option : undefined

  const RangeValueIndex0 = ({ value }) => (
    <div style={{ position: 'relative', top: '-10px', paddingTop: '2px', paddingBottom: '5px' }}>
      {value}
    </div>
  )

  const RangeValueIndex1 = ({ value }) => (
    <div style={{ position: 'relative', top: '12px', paddingTop: '3px', paddingBottom: '4px' }}>
      {value}
    </div>
  )

  return (
    <Box id="year-slider" className={classes.sliderBox}>
      <Grid container spacing={2}>
        <Grid item>
          {minValue}
        </Grid>
        <Grid item xs>
          <Box paddingRight={2} paddingLeft={2}>
            <Slider
              defaultValue={defaultValue || 1}
              value={selectedOptions || undefined}
              getAriaLabel={() => label}
              getAriaValueText={() => selectedOptions.toString()}
              valueLabelDisplay={(data.length > 0) ? 'on' : 'off'}
              valueLabelFormat={(value, index) => (index === 0)
                ? <RangeValueIndex0 value={value} />
                : <RangeValueIndex1 value={value} />
              }
              step={1}
              onChange={handleChange}
              onChangeCommitted={handleChangeCommit}
              marks={true}
              min={minValue}
              max={maxValue}
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
          </Box>
        </Grid>
        <Grid item>
          {maxValue}
        </Grid>
      </Grid>
    </Box>

  )
}

export default BaseSlider
