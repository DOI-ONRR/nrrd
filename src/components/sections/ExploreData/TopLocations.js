import React, { useContext } from 'react'
// import { graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
// utility functions
import utils from '../../../js/utils'
import { StoreContext } from '../../../store'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Chip from '@material-ui/core/Chip'

import CloseIcon from '@material-ui/icons/Close'
import IconMap from '-!svg-react-loader!../../../img/svg/icon-us-map.svg'
import CirlceChart from '../../data-viz/CircleChart/CircleChart.js'

const APOLLO_QUERY = gql`
  query TopLocations($year: Int! ) {
    fiscal_revenue_summary(
where: {location_type: {_eq: "State"}, fiscal_year: { _eq: $year } }
      order_by: { fiscal_year: asc, sum desc }
    ) {
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
}))

const TopLocations = props => {
  const classes = useStyles()
  const { state } = useContext(StoreContext)
  const year = state.year
  const { loading, error, data } = useQuery(APOLLO_QUERY, { variables: { year } })

  if (loading) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </div>
    )
  }
  if (error) return `Error! ${ error.message }`
  if (data) {
    chartData = data.fiscal_revenue_summary
  }

  return (
    <Box className={classes.root}>
      <Box component="h4" fontWeight="bold">Top Locations</Box>
      <Box>
        <CircleChart data={chartData} xAxis='state_or_area' yAxis='sum'
                     format={ d => utils.formatToDollarInt(d) }
          yLabel={dataSet}
          maxCircles={10}
          maxColor='#B64D00' minColor='#FCBA8B' />
      </Box>
    </Box>
  )
  
  
}

export default TopLocations
