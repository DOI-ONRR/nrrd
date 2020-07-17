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
  query FiscalProduction($state: String!, $location: String!, $commodity: String!) {
    fiscal_production_summary(
      where: {
        state_or_area: {_eq: $state}, 
        location_type: {_eq: $location}, 
        commodity: {_eq: $commodity}}, 
        order_by: {fiscal_year: asc}
    ) {
      fiscal_year
      land_category    
      state_or_area
      sum
      unit_abbr
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
  console.log('ProductionLandCategory props: ', props)
  const classes = useStyles()
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019

  const { state: pageState } = useContext(StoreContext)
  const cards = pageState.cards

  let location = props.regionType

  if (location === '') {
    location = props.state
  }

  const commodity = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  const state = (props.fipsCode === '99' || props.fipsCode === '999') ? props.name : props.fipsCode
  // console.log('useQuery vars: ', state, location, commodity)
  const { loading, error, data } = useQuery(APOLLO_QUERY, { variables: { state, location, commodity } })
  if (loading) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </div>
    )
  }
  if (error) return `Error! ${ error.message }`

  let chartData = []
  const dataSet = `FY ${ year } - ${ commodity }`

  if (data && data.fiscal_production_summary.length > 0) {
    const unit = data.fiscal_production_summary[0].unit_abbr
   
    const years = [...new Set(data.fiscal_production_summary.map(item => item.fiscal_year))]
    // const sums = [...new Set(data.fiscal_production_summary.filter(row => row.state_or_area === state).map(item => item.sum))]
    const sums = [...new Set(
      d3.nest()
        .key(k => k.fiscal_year)
        .rollup(v => d3.sum(v, i => i.sum))
        .entries(data.fiscal_production_summary.filter(row => row.state_or_area === state)).map(item => item.value)
    )]

    chartData = [years, sums]
    const noChartData = chartData[0].length === 0 && chartData[1].length === 0

    if (!noChartData) {
      return (

        <Box className={classes.root}>
          {title && <Box component="h4" fontWeight="bold" mb={2}>{title + ' (' + unit + ')'}</Box>}
          <Box>
            <LineChart
              key={'PLC' + dataSet }
              data={chartData}
              chartColors={[theme.palette.blue[300], theme.palette.orange[300], theme.palette.green[300], theme.palette.purple[300]]}
              lineDashes={LINE_DASHES}
              lineTooltip={
                (d, i) => {
                  const r = []
                  const card = cards && cards.filter(item => item.abbr === data.fiscal_production_summary[i].state_or_area)[0]
                  r[0] = `${ card.name }: ${ utils.formatToCommaInt(d) } (${ data.fiscal_production_summary[i].unit_abbr })`
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
