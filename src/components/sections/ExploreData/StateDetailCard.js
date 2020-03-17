import React, { useContext } from 'react'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
// utility functions
import utils from '../../../js/utils'
import { StoreContext } from '../../../store'

import { makeStyles } from '@material-ui/core/styles'
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Box,
  CircularProgress
} from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'
import IconMap from '-!svg-react-loader!../../../img/svg/icon-us-map.svg'
import { ExploreDataLink } from '../../layouts/IconLinks/ExploreDataLink'

import PieChart from '../../data-viz/PieChart/PieChart.js'
import CircleChart from '../../data-viz/CircleChart/CircleChart.js'

import Sparkline from '../../data-viz/Sparkline'
import LandPercent from './Ownership'
import Link from '../../../components/Link'

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
    color: 'white',
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
    '& span > div': {
      fontSize: theme.typography.caption.fontSize,
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
  revenueTypeBox: {
    minHeight: 430,
  },
  circularProgressRoot: {
    color: theme.palette.primary.dark,
  },
  usLocationIcon: {
    fill: theme.palette.common.white,
    marginRight: theme.spacing(1.5),
    height: 75,
    width: 75,
  },
  cardLocationIcon: {
    maxHeight: 50,
    marginRight: theme.spacing(1.5),
    filter: 'invert(1)',
  },
  boxTopSection: {
    minHeight: 150,
  },
  boxSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // border: '1px solid deeppink',
    '& > div:last-child': {
      minHeight: 550,
    },
  }
}))

const APOLLO_QUERY = gql`
  query DetailCard($state: String!, $year: Int!) {
    fiscal_revenue_summary(
      where: { state_or_area: { _eq: $state } }
      order_by: { fiscal_year: asc, state_or_area: asc }
    ) {
      fiscal_year
      state_or_area
      sum
      distinct_commodities
    }
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
    fiscalYears: fiscal_revenue_summary(where: {state_or_area: {_nin: [""]}}, distinct_on: fiscal_year) {
      fiscal_year
    }
  }
`

const StateIcon = props => {
  const classes = useStyles()

  const stateTitle = props.stateTitle
  const stateAbbr = props.stateAbbr

  let svgImg
  if (stateTitle === 'Nationwide Federal' || stateTitle === 'Native American') {
    svgImg = <IconMap className={classes.usLocationIcon} alt="US Icon" />
  }
  else {
    svgImg = <img src={`/maps/states/${ stateAbbr }.svg`} alt={`${ stateAbbr } State Icon`} className={classes.cardLocationIcon} />
  }

  return (
    <div className={classes.detailCardHeaderContent}>
      {svgImg}
      <span>
        {props.stateTitle}
        <LandPercent stateAbbr={props.stateAbbr} />
      </span>
    </div>
  )
}

const StateDetailCard = props => {
  const classes = useStyles()

  const { state } = useContext(StoreContext)
  const year = state.year
  const location = props.abbr
  const stateAbbr = props.state

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
  const dataSet = `FY ${ year }`

  let sparkData = []
  let sparkMin
  let sparkMax
  let highlightIndex = 0

  if (data) {
    chartData = data
    sparkMin = data.fiscalYears.reduce((min, p) => p.fiscal_year < min ? p.fiscal_year : min, data.fiscalYears[0].fiscal_year)
    sparkMax = data.fiscalYears.reduce((max, p) => p.fiscal_year > max ? p.fiscal_year : max, data.fiscalYears[data.fiscalYears.length - 1].fiscal_year)

    sparkData = data.fiscal_revenue_summary.map((item, i) => [
      item.fiscal_year,
      item.sum
    ])

    console.log('sparkData: ', sparkData)

    highlightIndex = data.fiscal_revenue_summary.findIndex(
      x => x.fiscal_year === year
    )
  }

  return (
    <Card className={`${ classes.root } ${ props.cardCountClass }`}>
      <CardHeader
        title={<StateIcon stateTitle={props.cardTitle} stateAbbr={stateAbbr} />}
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
          <Box textAlign="center" className={classes.boxTopSection}>
            <Box component="h2" mt={0} mb={0}>{props.total}</Box>
            <Box component="span" mb={4}>{props.year && <span>FY {props.year} revenue</span>}</Box>
            {sparkData.length > 1 && (
              <Box mt={4}>
                <Sparkline
                  data={sparkData}
                  highlightIndex={highlightIndex}
                />
                Revenue trend ({sparkMin} - {sparkMax})
              </Box>
            )}
          </Box>
          { chartData.revenue_commodity_summary.length > 0 ? (
            <>
              <Box className={classes.boxSection}>
                <Box component="h4" fontWeight="bold">Commodities</Box>
                <Box>
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
                  <Box mt={3}>
                    <ExploreDataLink to="/query-data/?dataType=Revenue" icon="filter">
                      Query revenue by commodity
                    </ExploreDataLink>
                  </Box>
                </Box>
              </Box>
            </>
          )
            : (
              <>
                <Box className={classes.boxSection}>
                  <Box component="h4" fontWeight="bold">Commodities</Box>
                  <Box fontSize="subtitle2.fontSize">No commodities generated revenue on federal land in {props.cardTitle} in FY {props.year}.</Box>
                </Box>
              </>
            )
          }
          { chartData.revenue_type_summary.length > 0 ? (
            <>
              <Box className={classes.boxSection}>
                <Box component="h4" fontWeight="bold">Revenue types</Box>
                <Box>
                  <CircleChart data={chartData.revenue_type_summary} xAxis='revenue_type' yAxis='total'
                    format={ d => utils.formatToDollarInt(d) }
                    yLabel={`FY ${ state.year }`}
                    maxCircles={4}
                    maxColor='#B64D00' minColor='#FCBA8B' />
                  <Box mt={3}>
                    <ExploreDataLink to="/query-data/?dataType=Revenue" icon="filter">
                  Query revenue by type
                    </ExploreDataLink>
                  </Box>
                </Box>
              </Box>
            </>
          )
            : (
              (
                <>
                  <Box className={classes.boxSection}>
                    <Box component="h4" fontWeight="bold">Revenue types</Box>
                    <Box fontSize="subtitle2.fontSize">There was no revenue on federal land in {props.cardTitle} in FY {props.year}.</Box>
                  </Box>
                </>
              )
            )
          }
        </>

      </CardContent>
      <CardActions></CardActions>
    </Card>
  )
}

export default StateDetailCard
