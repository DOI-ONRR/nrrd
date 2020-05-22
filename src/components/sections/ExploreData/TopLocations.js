import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import GlossaryTerm from '../../GlossaryTerm//GlossaryTerm.js'
// utility functions
import utils from '../../../js/utils'
import { StoreContext } from '../../../store'

import { DataFilterContext } from '../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../constants'

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
import CircleChart from '../../data-viz/CircleChart/CircleChart.js'

const APOLLO_QUERY = gql`
  query TopLocations($year: Int!, $locations: [String!] ) {
    fiscal_revenue_summary(
      where: {location_type: {_in: $locations}, fiscal_year: { _eq: $year }, location_name: {_neq: ""} }
      order_by: { fiscal_year: asc, sum: desc }
    ) {
      location_name
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
  topLocationsChart: {
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
  }
}))

const TopLocations = ({ title, ...props }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  const location = (filterState[DFC.COUNTIES]) ? filterState[DFC.COUNTIES] : 'State'
  const offshore = (filterState[DFC.OFFSHORE_REGIONS]) ? filterState[DFC.COUNTIES] : 'Hide'
  const locations = ['State', 'Offshore', 'Native American']
  if (offshore !== 'Hide') {
    locations.push('Offshore')
  }
  if (location === 'State') {
    locations.push('Native American')
  }
  const { loading, error, data } = useQuery(APOLLO_QUERY, { variables: { year, locations } })

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
  if (data) {
    chartData = data.fiscal_revenue_summary

    return (
      <Container id={utils.formatToSlug(title)}>
        <Grid container>
        <Grid item xs={12}>
            <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
              <Box component="h3" color="secondary.dark">{title}</Box>
            </Box>
        </Grid>
          <Grid item xs={12}>
            <Box className={classes.root}>
              <Box className={classes.topLocationsChart}>
                <CircleChart
                  data={chartData}
                  maxLegendWidth='800px'
                  xAxis='location_name'
                  yAxis='sum'
                  format={ d => utils.formatToDollarInt(d) }
                  circleLabel={
                    d => {
                      // console.debug('circleLABLE: ', d)
                      const r = []
                      r[0] = d.location_name
                      if( r[0] === 'Native American') {
                        r[0] = 'Native American lands'
                      }
                      else if (r[0] === 'Gulf of Mexico, Central Gulf of Mexico') {
                        r[0] = 'Central Gulf'
                      }
                      else if (r[0] === 'Gulf of Mexico, Western Gulf of Mexico') {
                        r[0] = 'Western Gulf'
                      }
                      
                      r[1] = utils.formatToDollarInt(d.sum)
                      return r
                    }
                  }
                  legendLabel={
                    d => {
                      if (d === 'Native American') {
                        d = 'Native American lands'
                      }
                      return d
                    }
                  }
                  yLabel={dataSet}
                  maxCircles={6}
                  minColor={theme.palette.green[100]}
                  maxColor={theme.palette.green[600]} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    )
  }
  else {
    return null
  }
}

export default TopLocations

TopLocations.propTypes = {
  title: PropTypes.string
}
