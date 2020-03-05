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

import CloseIcon from '@material-ui/icons/Close'
import PieChart from '../../data-viz/PieChart/PieChart.js'
import CircleChart from '../../data-viz/CircleChart/CircleChart.js'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '25%',
    width: '100%',
    margin: theme.spacing(1),
    '@media (max-width: 768px)': {
      maxWidth: '100%',
    }
  },
  closeIcon: {
    color: theme.palette.common.white,
    position: 'relative',
    top: theme.spacing(1.75),
    right: theme.spacing(1),
    cursor: 'pointer',
    maxWidth: 20,
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    padding: 10,
    height: 75,
    fontSize: '1.2rem',
    '& .MuiCardHeader-action': {
      marginTop: 0,
    },
    '& span': {
      margin: 0,
    },
    '& span:first-child': {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
  cardHeaderContent: {
    fontSize: theme.typography.h3.fontSize,
  },
  detailCardHeaderContent: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '& svg': {
      maxWidth: 50,
      maxHeight: 50,
      fill: theme.palette.common.white,
    },
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
  commodityBox: {
    minHeight: 475,
  },
  circularProgressRoot: {
    color: theme.palette.primary.dark,
  },
}))

const APOLLO_QUERY = gql`
  query DetailCard($state: String!, $year: Int!) {
    revenue_commodity_summary(
      where: { fiscal_year: { _eq: $year }, state_or_area: { _eq: $state } }
      order_by: { fiscal_year: asc, total: desc }
    ) {
      fiscal_year
      commodity
      state_or_area
      total
    }
    revenue_type_summary(
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

const StateIcon = props => {
  console.log('StateIcon props: ', props)
  const classes = useStyles()

  const stateTitle = props.stateTitle
  const stateAbbr = props.stateAbbr

  let svgImg
  if (stateTitle === 'Nationwide Federal') {
    svgImg = ''
  }
  else {
    svgImg = ''
    // svgImg = `<img src={'/maps/states/${ stateAbbr }.png'} alt="${ stateAbbr } Logo" />`
  }

  return (
    <div className={classes.detailCardHeaderContent}>
      {svgImg}
      <span>{props.stateTitle}</span>
    </div>
  )
}

const StateDetailCard = props => {
  const classes = useStyles()

  const { state } = useContext(StoreContext)
  const year = state.year
  const location = props.abbr

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: location, year: year }
  })

  const closeCard = item => {
    props.closeCard(props.fips)
  }

  if (loading) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </div>
    )
  }

  if (error) return `Error! ${ error.message }`
  // console.debug('DWGH ----------------------------------', year)
  let chartData
  const dataSet = 'FY ' + year
  if (data) {
    console.debug('data========================================================', data)
    chartData = data
  }

  return (
    <Card className={`${ classes.root } ${ props.cardCountClass }`}>
      <CardHeader
        title={<StateIcon stateTitle={props.cardTitle} stateAbbr={location} />}
        action={<CloseIcon
          className={classes.closeIcon}
          onClick={(e, i) => {
            closeCard(i)
          }}
        />}
        classes={{ root: classes.cardHeader, content: classes.cardHeaderContent }}
        disableTypography
      />
      <CardContent>
        <>
          { chartData.revenue_commodity_summary.length > 0 && (

            <Box className={classes.commodityBox}>
              <h4>Commodities</h4>
              <CircleChart data={chartData.revenue_commodity_summary}
                xAxis='commodity' yAxis='total'
                format={ d => {
                // console.debug('fooormat', d)
                  return utils.formatToDollarInt(d)
                }
                }
                yLabel={dataSet}
                maxCircles={6}
                minColor='#DCD2DF' maxColor='#2B1C30' />
            </Box>
          )
          }
          { chartData.revenue_type_summary.length > 0 && (
            <Box>
              <h4>Revenue types</h4>
              <CircleChart data={chartData.revenue_type_summary} xAxis='revenue_type' yAxis='total'
                format={ d => utils.formatToDollarInt(d) }
                yLabel={'FY ' + state.year}
                maxCircles={4}
                maxColor='#B64D00' minColor='#FCBA8B' />
            </Box>
          )
          }
        </>

      </CardContent>
      <CardActions></CardActions>
    </Card>
  )
}

export default StateDetailCard
