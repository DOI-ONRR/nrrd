import React, { useState, useEffect } from 'react'

import { isEqual, isEqualWith } from 'lodash'

import { range } from '../../../js/utils'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Slider,
  Box,
  Grid
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'

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
    '@media screen and (-ms-high-contrast: active)': {
      border: `1px solid ${ theme.palette.grey['500'] }`
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
    backgroundColor: theme.palette.links.default,
    '& span': {
      borderRadius: 4,
    },
    '&:hover': {
      boxShadow: 'none',
      transition: 'none',
    },
    '&:focus,&:hover,&:active': {
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
/**
 * This enables users to select a specific year or range of years in the data.
 * The base slider can exist when the user in Explore data and Query data.
 *
 * An example where only a single year can be selected exists on the map in [Explore data](https://revenuedata.doi.gov/explore).
 *
 * An example where a range of years can be selected exists in [Query Data](https://revenuedata.doi.gov/query-data).
 */
const BaseSlider = ({ data, onChange, defaultSelected, selected, label, ...restProps }) => {
  const theme = useTheme()
  const classes = useStyles(theme)
  let selectedArrayNums, defaultArrayNums

  const convertStringToArrayNums = values => {
    values = values.split(',').map(num => +num)
    if (values.length > 2) {
      values = [values[0], values.slice(-1)[0]]
    }
    return values
  }

  if (typeof selected === 'string') {
    selectedArrayNums = convertStringToArrayNums(selected)
  }
  if (typeof defaultSelected === 'string') {
    defaultArrayNums = convertStringToArrayNums(defaultSelected)
  }

  const [selectedOptions, setSelectedOptions] = useState(selectedArrayNums || defaultArrayNums)

  const noop = () => {}
  onChange = onChange || noop
  if (data && data.length > 0 && !data[0].option) {
    data = data.map(item => ({ option: item }))
  }

  const handleChange = (event, newValue) => {
    setSelectedOptions(newValue)
  }

  const handleChangeCommit = (event, newValue) => {
    const rangeValues = range(newValue[0], newValue[1])
    if (rangeValues.length === 1) {
      rangeValues.push(rangeValues[0])
    }
    onChange(rangeValues.toString())
  }

  useEffect(() => {
    if (selectedArrayNums && !isEqual(selectedArrayNums, selectedOptions)) {
      handleChange(undefined, selectedArrayNums)
    }
  }, [selected])

  const minValue = (data && data.length > 0) ? data[0].option : undefined
  const maxValue = (data && data.length > 0) ? data.slice(-1)[0].option : undefined

  const RangeValueIndexEven = ({ value }) => (
    <div style={{ position: 'relative', top: '-10px', paddingTop: '2px', paddingBottom: '5px', border: '1px solid currentColor' }}>
      {value}
    </div>
  )

  const RangeValueIndexOdd = ({ value }) => (
    <div style={{ position: 'relative', top: '12px', paddingTop: '3px', paddingBottom: '4px', border: '1px solid currentColor' }}>
      {value}
    </div>
  )

  return (
    <>
      {data
        ? <Box id="year-slider" className={classes.sliderBox}>
          <Grid container spacing={2}>
            <Grid item>
              {minValue}
            </Grid>
            <Grid item xs>
              <Box paddingRight={2} paddingLeft={2}>
                <Slider
                  defaultValue={defaultSelected || 1}
                  value={selectedOptions || undefined}
                  getAriaLabel={() => label}
                  getAriaValueText={() => selectedOptions ? selectedOptions.toString() : ''}
                  valueLabelDisplay={(data.length > 0) ? 'on' : 'off'}
                  valueLabelFormat={(value, index) => (index % 2 === 0)
                    ? <RangeValueIndexEven value={value} />
                    : <RangeValueIndexOdd value={value} />
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
        : <Box marginRight={2}>
          <Skeleton variant="rect" width={'300px'} height={'40px'} animation={false}/>
        </Box>}
    </>

  )
}

const areEqual = (prevProps, nextProps) => {
  const areDataValuesEqual = (item1, item2) => {
    let equal = (!item1 && !item2)
    if (item1 && item2) {
      if (item1.length !== item2.length) {
        equal = false
      }
      else {
        if (typeof item1[0] === 'string' && typeof item2[0] === 'string') {
          equal = isEqual(item1, item2)
        }
        else {
          equal = isEqual(item1.map(item => item.option), item2.map(item => item.option))
        }
      }
    }

    return equal
  }

  return isEqualWith(prevProps.data, nextProps.data, areDataValuesEqual) && isEqual(prevProps.selected, nextProps.selected)
}

export default React.memo(BaseSlider, areEqual)

BaseSlider.Preview = {
  group: 'Inputs',
  demos: [
    {
      title: 'Simple',
      code: '<BaseSlider label="Simple Items" data={[10, 20, 30, 40, 50, 60]} defaultSelected="20,50"/>',
    }
  ]
}
