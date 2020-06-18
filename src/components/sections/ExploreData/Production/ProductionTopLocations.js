import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

// utility functions
import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'
import CONSTANTS from '../../../../js/constants'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  useTheme
} from '@material-ui/core'

// import CloseIcon from '@material-ui/icons/Close'
// import IconMap from '-!svg-react-loader!../../../img/svg/icon-us-map.svg'
import CircleChart from '../../../data-viz/CircleChart/CircleChart.js'

const APOLLO_QUERY = gql`
  query FiscalProduction($year: Int!, $location: String!, $commodity: String!, $state: String!) {
    state_fiscal_production_summary: fiscal_production_summary(
      where: {
        location_type: {_eq: $location},
        state_or_area: {_nin: ["Nationwide Federal", ""]}, 
        fiscal_year: { _eq: $year },
        commodity: {_eq: $commodity},
        state: {_eq: $state}
      },
        order_by: {sum: desc}
      ) {
        location_name
        unit_abbr
        fiscal_year
        state_or_area
        sum
      }
    fiscal_production_summary(
      where: {
        location_type: {_nin: ["Nationwide Federal", "County", ""]}, 
        fiscal_year: { _eq: $year }, 
        commodity: {_eq: $commodity}
      }, order_by: {sum: desc}
      ) {
        location_name
        unit_abbr
        fiscal_year
        state_or_area
        sum
      }
  }
`

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    width: '100%',
    margin: theme.spacing(1),
    '@media (max-width: 768px)': {
      maxWidth: '100%',
      margin: 0,
    }
  },
  progressContainer: {
    maxWidth: '25%',
    display: 'flex',
    '& > *': {
      marginTop: theme.spacing(3),
      marginRight: 'auto',
      marginLeft: 'auto',
    }
  },
  circularProgressRoot: {
    color: theme.palette.primary.dark,
  },
  chartHorizontal: {
    '& .chart-container': {
      display: 'flex',
      // alignItems: 'top',
      '@media (max-width: 426px)': {
        display: 'block',
        margin: 0,
      },
      '& .chart': {
        marginRight: theme.spacing(2),
        width: '70%',
        '@media (max-width: 426px)': {
          marginRight: 0,
        },
      },
    },
  },
  chartVertical: {
    '& .chart-container': {
      display: 'block',
      margin: 0,
    },
    '& .chart': {
      margin: 0,
      width: '100%',
    },
  }
}))

const ProductionTopLocations = ({ title, ...props }) => {
  // console.debug('ProductionTopLocations props: ', props)

  const classes = useStyles()
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  let state = ''
  let location = 'County'
  if (props.abbr && props.abbr.length === 2) {
    location = 'County'
    state = props.abbr
  }
  else if (props.abbr && props.abbr.length === 5) {
    location = ''
    state = ''
  }
  else {
    location = 'State'
    state = ''
  }

  const commodity = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  const key = `PTL${ year }${ state }${ commodity }`
  const { loading, error, data } = useQuery(APOLLO_QUERY,
    {
      variables: { year, location, commodity, state },
      skip: props.state === CONSTANTS.NATIVE_AMERICAN || location === ''
    })

  const maxLegendWidth = props.maxLegendWidth
  if (loading) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </div>
    )
  }
  if (error) return `Error! ${ error.message }`

  let chartData = []
  const dataSet = `FY ${ year }`

  if (data && data.length) {
    if (location === 'County') {
      const unitAbbr = data.state_fiscal_production_summary[0].unit_abbr
      chartData = d3.nest()
        .key(k => k.location_name)
        .rollup(v => d3.sum(v, i => i.sum))
        .entries(data.state_fiscal_production_summary).map(item => {
          const r = { sum: item.value, location_name: item.key, unit_abbr: unitAbbr }
          return r
        })
    }
    else {
      const unitAbbr = data.fiscal_production_summary[0].unit_abbr
      chartData = d3.nest()
        .key(k => k.location_name)
        .rollup(v => d3.sum(v, i => i.sum))
        .entries(data.fiscal_production_summary).map(item => {
          const r = { sum: item.value, location_name: item.key, unit_abbr: unitAbbr }
          return r
        })
      // chartData =  data.fiscal_production_summary
    }

    return (
      <Box className={classes.root}>
        {title && <Box component="h4" fontWeight="bold" mb={2}>{title}</Box>}
        <Box className={props.horizontal ? classes.chartHorizontal : classes.chartVertical}>
          <CircleChart
            key={key}
            data={chartData}
            maxLegendWidth={maxLegendWidth}
            xAxis='location_name'
            yAxis='sum'
            format={ d => utils.formatToCommaInt(d) }
            circleLabel={
              d => {
                // console.debug('circleLABLE: ', d)
                if (location === 'State') {
                  const r = []
                  r[0] = d.location_name
                  r[1] = utils.formatToCommaInt(d.sum) + ' ' + d.unit_abbr
                  return r
                }
                else {
                  return ['', '']
                }
              }
            }
            xLabel={location}
            yLabel={dataSet}
            maxCircles={6}
            minColor={theme.palette.green[100]}
            maxColor={theme.palette.green[600]} />
        </Box>
      </Box>
    )
  }
  else {
    return <Box className={classes.root}></Box>
  }
}

export default ProductionTopLocations

ProductionTopLocations.propTypes = {
  title: PropTypes.string
}
