import React, { useContext }  from 'react'
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
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import CloseIcon from '@material-ui/icons/Close'
import PieChart from '../../data-viz/PieChart/PieChart.js'
import CircleChart from '../../data-viz/CircleChart/CircleChart.js'



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
      limit: 6
      where: { fiscal_year: { _eq: $year }, state_or_area: { _eq: $state } }
      order_by: { fiscal_year: asc, total: desc }
    ) {
      fiscal_year
      commodity
      state_or_area
      total
    }
    revenue_type_summary(
      limit: 4
      where: { fiscal_year: { _eq: $year }, state_or_area: { _eq: $state } }
      order_by: { fiscal_year: asc, total: desc }
    ) {
      fiscal_year
      revenue_type
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
  const location = props.abbrev

  const { loading, data } = useQuery(APOLLO_QUERY, {
    variables: { state: location, year: year }
  })
  
  const closeCard = item => {
    props.closeCard(props.fips)
  }
  if(loading) {
    return "Loading ...."
  }
  console.debug('DWGH ----------------------------------', year)
  let chartData
  let dataSet='FY '+year
  if(data) {
    console.debug('data========================================================', data)
    chartData=data

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
        <Grid container>
          <Grid item >

            { chartData && (
              <Box >
                <CircleChart data={chartData.revenue_commodity_summary}
                  xAxis='commodity' yAxis='total'
                  format={ d => utils.formatToDollarInt(d) }
                  yLabel={dataSet}
                  minColor='#DCD2DF' maxColor='#2B1C30'/>
                  <CircleChart data={chartData.revenue_type_summary} xAxis='revenue_type' yAxis='total'
                    format={ d => utils.formatToDollarInt(d) }
                    yLabel={dataSet}
                    maxColor='#B64D00' minColor='#FCBA8B'/>
              </Box>
            )
            }
    
    </Grid>
      </Grid>
      </CardContent>
      
      <CardActions>
      {/* <Button size="small" color="primary">Learn More</Button> */}
    </CardActions>
      </Card>
  )
}

export default StateDetailCard
