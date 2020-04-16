import React, { useState, useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

import { StickyWrapper } from '../../utils/StickyWrapper'

import { makeStyles } from '@material-ui/core/styles'
import {
  Slider,
  Container,
  Box,
  Grid
} from '@material-ui/core'

import { StoreContext } from '../../../store'
import CONSTANTS from '../../../js/constants'

const APOLLO_QUERY = gql`
  query YearPeriod($period: String!) {
    # period query
    period(where: {period: {_ilike: $period }}) {
      fiscal_year
    }
  }
`

const useStyles = makeStyles(theme => ({
  root: {
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
    height: 75,
  },
  sliderBox: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    zIndex: 101,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    top: -4,
  },
  sliderRoot: {
    width: '90%',
    display: 'block',
    margin: '0 auto',
    // pure css sorcery needed to defeat the material-ui goblin
    '& .MuiSlider-markLabel:nth-child(5)': {
      left: '-5% !important',
    },
    '& .MuiSlider-markLabel:nth-child(7)': {
      left: '105% !important',
    }
  },
  sliderMarkLabel: {
    fontWeight: 'bold',
    top: 1,
    color: theme.palette.primary.dark,
    fontSize: '1rem',
  },
  sliderMarkLabelActive: {
    fontWeight: 'bold',
    boxShadow: 'none',
    '&:nth-child(1)': {
      left: '-5% !important',
    },
    '&:last-child': {
      left: '105% !important',
    }
  },
  sliderTrack: {
    height: 4,
    backgroundColor: 'transparent',
  },
  sliderRail: {
    height: 4,
    backgroundColor: theme.palette.grey['500'],
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
  sliderYearDisplay: {
    border: `1px solid ${ theme.palette.links.default }`,
    color: theme.palette.links.default,
    background: theme.palette.common.white,
    fontWeight: 'bold',
    width: 175,
    borderRadius: 5,
    margin: '0 auto',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    position: 'relative',
    top: -6,
  },
}))

const YearSlider = props => {
  const classes = useStyles()
  const { state } = useContext(StoreContext)

  const year = state.year
  const period = state.period

  let periodData
  let minYear
  let maxYear

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { period: CONSTANTS.FISCAL_YEAR }
  })

  if (loading) {}
  if (error) return `Error! ${ error.message }`

  if (data) {
    periodData = data.period

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
    <Box className={classes.root}>
      <StickyWrapper enabled={true} top={0} bottomBoundary={0} innerZ="1000" activeClass="sticky">
        <Box className={`${ classes.sliderContainer } slider-wrapper`}>
          <Container>
            <Box className={classes.sliderYearDisplay}>{period} {year}</Box>
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
          </Container>
        </Box>
      </StickyWrapper>
    </Box>
  )
}

export default YearSlider

YearSlider.propTypes = {
  // Get year that is passed into slider
  onYear: PropTypes.func.isRequired
}
