import React, { useContext }  from 'react'
// import { graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
// utility functions

import { StoreContext } from '../../../store'


import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import CloseIcon from '@material-ui/icons/Close'
import PieChart from '../../data-viz/PieChart/PieChart.js'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '24%',
  },
  closeIcon: {
    color: theme.palette.common.white,
    position: 'relative',
    top: 10,
    cursor: 'pointer'
  }
}))
const APOLLO_QUERY = gql`
  query DetailCard($state: String!, $year: Int!) {
    revenue_commodity_summary(
      limit: 5
      where: { fiscal_year: { _eq: $year }, state_or_area: { _eq: $state } }
      order_by: { fiscal_year: asc, total: desc }
    ) {
      fiscal_year
      commodity
      state_or_area
      total
    }
  }
`

const StateDetailCard = props => {
  const classes = useStyles()
  console.debug(props)
  const { state } = useContext(StoreContext)
  const year = state.year
  const location=props.abbrev

  const { loading, data } = useQuery(APOLLO_QUERY, {
    variables: { state: location, year: year }
  })
  
  const closeCard = item => {
    props.closeCard(props.fips)
  }
  if(loading) {
    return "Loading ...."
  }
  let chartData
  if(data) {
    chartData=data.revenue_commodity_summary
  }
  
  return (
    <Card className={`${ classes.root } ${ props.cardCountClass }`}>
      <CardHeader
        title={props.cardTitle}
        action={<CloseIcon
          className={classes.closeIcon}
          onClick={(e, i) => {
            closeCard(i)
          }}
        />}
      />
      <CardContent>
        <Typography variant="body1" component="p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Typography>
      <PieChart data={chartData} xAxis='commodity' yAxis='total'/>
      </CardContent>
      <CardActions>
        {/* <Button size="small" color="primary">Learn More</Button> */}
      </CardActions>
    </Card>
  )
}

export default StateDetailCard
