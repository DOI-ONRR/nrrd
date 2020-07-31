import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

// utility functions
import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'
import CONSTANTS from '../../../../js/constants'

import * as d3 from 'd3'

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
import StackedBarChart from '../../../data-viz/StackedBarChart/StackedBarChart.js'
import LineChart from '../../../data-viz/LineChart/LineChart'

const LINE_DASHES = ['1,0', '5,5', '10,10', '20,10,5,5,5,10']

const APOLLO_QUERY = gql`
  query ProductionLandCategory($state: String!, $location: String!, $commodity: String!, $period: String!) {
    production_summary(
      where: {
        location: {_eq: $state}, 
        location_type: {_eq: $location}, 
        product: {_eq: $commodity},
        period: {_eq: $period}},
        order_by: {year: asc}
    ) {
      year
      land_category    
      location
      location_name
      total
      unit_abbr
    }

    period(where: {period: {_ilike: $period }}) {
      fiscal_year
      calendar_year
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
}))

const ProductionLandCategory = ({ title, ...props }) => {
  // console.log('ProductionLandCategory props: ', props)
  const classes = useStyles()
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR
  const { state: pageState } = useContext(StoreContext)
  const cards = pageState.cards

  const commodity = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  let locationType
  const state = props.fipsCode || ''

  switch (props.regionType) {
  case CONSTANTS.STATE:
    locationType = CONSTANTS.STATE
    break
  case CONSTANTS.COUNTY:
    locationType = CONSTANTS.COUNTY
    break
  case CONSTANTS.OFFSHORE:
    locationType = CONSTANTS.OFFSHORE
    break
  default:
    locationType = (props.fipsCode === DFC.NATIONWIDE_FEDERAL_FIPS || props.fipsCode === DFC.NATIVE_AMERICAN_FIPS) && props.state
    break
  }

  // console.log('ProductionLandCategory useQuery vars: ', state, locationType, commodity, period)

  const { loading, error, data } = useQuery(APOLLO_QUERY, { variables: { state, location: locationType, commodity, period } })
  if (loading) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </div>
    )
  }
  if (error) return `Error! ${ error.message }`

  let chartData = []
  const dataSet = (period === DFC.PERIOD_FISCAL_YEAR) ? `FY ${ year } - ${ commodity }` : `CY ${ year } - ${ commodity }`
  let unit = ''
  if (data && data.production_summary.length > 0) {
    // console.log('ProductionLandCategory data: ', data)
    unit = data.production_summary[0].unit_abbr

    const yearVar = (period === DFC.PERIOD_FISCAL_YEAR) ? 'fiscal_year' : 'calendar_year'
    const years = [...new Set(data.period.map(item => item[yearVar]))]

    let sums = [...new Set(
      d3.nest()
        .key(k => k.year)
        .rollup(v => d3.sum(v, i => i.total))
        .entries(data.production_summary.filter(row => row.location === state))
        .map(item => ({ year: parseInt(item.key), value: item.value }))
    )]

    sums = years.map(year => {
      const sum = sums.find(x => x.year === year)
      return sum ? sum.value : 0
    })

    chartData = [years, sums]

    const noChartData = chartData[0].length === 0 && chartData[1].length === 0

    if (!noChartData) {
      return (

        <Box className={classes.root}>
          {title && <Box component="h4" fontWeight="bold" mb={2}>{title + ' (' + unit + ')'}</Box>}
          <Box>
            <LineChart
              key={'PLC' + dataSet + period + commodity}
              data={chartData}
              chartColors={[theme.palette.blue[300], theme.palette.orange[300], theme.palette.green[300], theme.palette.purple[300]]}
              lineDashes={LINE_DASHES}
              lineTooltip={
                (d, i) => {
                  const r = []
                  const card = cards && cards.filter(item => item.fipsCode === data.production_summary[i].location)[0]
                  r[0] = `${ card.locationName }: ${ utils.formatToCommaInt(d) } (${ data.production_summary[i].unit_abbr })`
                  return r
                }
              }
            />
          </Box>
        </Box>

      )
    }
    else {
      return <Box className={classes.root}></Box>
    }
  }
  else {
    return null
  }
}

export default ProductionLandCategory

ProductionLandCategory.propTypes = {
  title: PropTypes.string
}
