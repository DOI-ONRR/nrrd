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
  Typography,
  Container,
  Grid,
  useTheme
} from '@material-ui/core'

// import CloseIcon from '@material-ui/icons/Close'
// import IconMap from '-!svg-react-loader!../../../img/svg/icon-us-map.svg'

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

const ProductionOverview = ({ title, ...props }) => {
  // console.debug('ProductionTopLocations props: ', props)

  const classes = useStyles()
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019

  let state = ''
  let location = CONSTANTS.COUNTY

  if (props.regionType === CONSTANTS.STATE) {
    location = CONSTANTS.COUNTY
    state = props.state
  }
  else if (props.regionType === CONSTANTS.COUNTY) {
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
      skip: props.state === DFC.NATIVE_AMERICAN_FIPS || location === CONSTANTS.OFFSHORE
    })

  const maxLegendWidth = props.maxLegendWidth
  if (loading) {
    return (
      <div className={classes.progressContainer}>
      </div>
    )
  }
  if (error) return `Error! ${ error.message }`

  let chartData = []
  let unitAbbr = ''
  if (data && (data.state_fiscal_production_summary.length || data.fiscal_production_summary.length)) {
    if (data.state_fiscal_production_summary.length > 0 && location === CONSTANTS.COUNTY) {
      unitAbbr = data.state_fiscal_production_summary[0].unit_abbr
      chartData = d3.nest()
        .key(k => k.location_name)
        .rollup(v => d3.sum(v, i => i.sum))
        .entries(data.state_fiscal_production_summary).map(item => {
          const r = { sum: item.value, location_name: item.key, unit_abbr: unitAbbr }
          return r
        })
    }
    else {
      unitAbbr = data.fiscal_production_summary[0].unit_abbr
      let tmp = data.fiscal_production_summary
      if (props.fipsCode) {
        tmp = data.fiscal_production_summary.filter(d => d.location_name !== 'Native American lands')
      }
      chartData = d3.nest()
        .key(k => k.location_name)
        .rollup(v => d3.sum(v, i => i.sum))
        .entries(tmp).map(item => {
          const r = { sum: item.value, location_name: item.key, unit_abbr: unitAbbr }
          return r
        })
      // chartData =  data.fiscal_production_summary
    }
    const dataSet = `FY ${ year } ${ unitAbbr }`

    return (

      <Grid item md={12}>
        <Box mb={1} color="secondary.main" borderBottom={5}>
          <Box component="h2" color="secondary.dark">Production { commodity }</Box>
        </Box>
        <Typography variant="body1">
          The Office of Natural Resources Revenue collects detailed data about natural resource production (?) on federal lands and waters.
        </Typography>
      </Grid>
    )
  }
  else {
    return (
      <Grid item md={12}>
        <Box mb={1} color="secondary.main" borderBottom={5}>
          <Box component="h2" color="secondary.dark">Production</Box>
        </Box>
        <Typography variant="body1">
          The Office of Natural Resources Revenue collects detailed data about natural resource production (?) on federal lands and waters.
        </Typography>
      </Grid>

    )
  }
}

export default ProductionOverview

ProductionOverview.propTypes = {
  title: PropTypes.string
}
