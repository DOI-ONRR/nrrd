import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
// utility functions
import utils from '../../../js/utils'
import { StoreContext } from '../../../store'

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
  query TopLocations($year: Int!, $location: String! ) {
    fiscal_revenue_summary(
where: {location_type: {_eq: $location}, fiscal_year: { _eq: $year }, location_name: {_neq: ""} }
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
      alignItems: 'top',
      '& .chart': {
        width: 'calc(100% - 400px)',
        height: 550,
      },
      '& .legend': {
        width: 400,
        marginTop: theme.spacing(2),
      },
    },
  }
}))

const TopLocations = ({ title, ...props }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { state } = useContext(StoreContext)
  const year = state.year
  const location = state.countyLevel

  const { loading, error, data } = useQuery(APOLLO_QUERY, { variables: { year, location } })

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
  }

  return (
    <Container id={utils.formatToSlug(title)}>
      <Grid container>
        <Grid item md={12}>
          <Box color="secondary.main" mt={5} mb={2} borderBottom={2}>
            <Box component="h3" color="secondary.dark">{title}</Box>
          </Box>
        </Grid>
        <Grid item md={12}>
          <Box className={classes.root}>
            <Box className={classes.topLocationsChart}>
              <CircleChart
                data={chartData}
                maxLegendWidth='800px'
                xAxis='location_name'
                yAxis='sum'
                format={ d => utils.formatToDollarInt(d) }
                circleLabel={ d => {
                  console.debug('circleLABLE: ', d)
                  const r = []
                  r[0] = d.location_name
                  r[1] = utils.formatToDollarInt(d.sum)
                  return r
                }
                }
                yLabel={dataSet}
                maxCircles={6}
                minColor={theme.palette.greens[100]}
                maxColor={theme.palette.greens[600]} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>

  )
}

export default TopLocations
