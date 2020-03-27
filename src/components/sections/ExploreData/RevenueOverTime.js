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
import LineChart from '../../data-viz/LineChart/LineChart.js'

const APOLLO_QUERY = gql`
  query FiscalRevenueSummary {
    fiscal_revenue_summary(
      order_by: { fiscal_year: asc }
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

const RevenueOverTime = props => {
  const classes = useStyles()

  const { state } = useContext(StoreContext)
  const year = state.year
  const locations = props.locations || []
  const fips = props.fips || []
  const names = props.names || []
  console.debug("LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOCAAAAAAAAAAAAAAAATIONNNNNNNNNNNNNNNS", locations,fips,names)
  const {loading, error, data } = useQuery(APOLLO_QUERY)
  const foo=props.foo;
  console.debug("fooooo",foo)
  const handleDelete = props.handleDelete || ((e,val) => {    console.debug('handle delete', fips) })


  if (loading) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </div>
    )
  }
  if (error) return `Error! ${ error.message }`
  let chartData=[[]]
  if(data && locations) {
    const years = [...new Set(data.fiscal_revenue_summary.map(item => item.fiscal_year))];
    const sums= locations.map( yData => [...new Set(data.fiscal_revenue_summary.filter( row=>row.state_or_area === yData).map(item =>item.sum ))] )
    console.debug(sums, years)
    chartData=[years, ...sums]

    console.debug("CHART DATA", chartData)
  }
  return (
    <div className={classes.root} >
      <LineChart data={chartData} lineDashes={['1,0', '5,5', '10,10', '20,10,5,5,5,10']} />
      {locations.map( (location, i) => {
        
        return (  <Chip key={'RevenueOverTimeChip_'+ fips[i]} variant='outlined' color='primary.dark' onDelete={(e) => handleDelete(e, fips[i])}  label={names[i]} /> )
            })
          }
    </div>
  )
  
}

export default RevenueOverTime
