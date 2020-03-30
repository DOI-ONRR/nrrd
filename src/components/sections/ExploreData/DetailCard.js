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
import LandPercent from './LandPercent'
import Link from '../../Link'

import CONSTANTS from '../../../js/constants'

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
    maxWidth: 50,
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
  query DetailCard($state: String!, $year: Int!, $period: String!) {
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
    period(where: {period: {_ilike: $period }}) {
      fiscal_year
    }
  }
`

const nonStateOrCountyCards = [
  CONSTANTS.NATIONWIDE_FEDERAL,
  CONSTANTS.NATIVE_AMERICAN
]

const CardTitle = props => {
  const classes = useStyles()

  const stateTitle = props.stateTitle
  const stateAbbr = props.state ? props.state : props.stateAbbr
  const isCounty = props.stateAbbr.length > 2
  let cardTitle = `${ props.stateTitle }`

  if (isCounty && !nonStateOrCountyCards.includes(stateTitle)) {
    cardTitle = `${ stateTitle }, ${ stateAbbr }`
  }

  let svgImg

  if (nonStateOrCountyCards.includes(stateTitle)) {
    svgImg = <IconMap className={classes.usLocationIcon} alt="US Icon" />
  }
  else {
    svgImg = (!isCounty) ? <img src={`/maps/states/${ stateAbbr }.svg`} alt={`${ stateAbbr } State Icon`} className={classes.cardLocationIcon} /> : ''
  }

  return (
    <div className={classes.detailCardHeaderContent}>
      {svgImg}
      <span>
        {cardTitle}
        <LandPercent stateAbbr={stateAbbr} />
      </span>
    </div>
  )
}

const DetailCard = props => {
  const classes = useStyles()

  const { state } = useContext(StoreContext)
  const year = state.year

  const stateAbbr = (props.abbr.length > 2) ? props.abbr : props.state

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: stateAbbr, year: year, period: CONSTANTS.FISCAL_YEAR }
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

  let chartData
  const dataSet = `FY ${ year }`

  let sparkData = []
  let sparkMin
  let sparkMax
  let highlightIndex = 0
  let periodData
  let fiscalData

  if (
    data
  ) {
    chartData = data

    periodData = data.period

    // set min and max trend years
    sparkMin = periodData.reduce((min, p) => p.fiscal_year < min ? p.fiscal_year : min, periodData[0].fiscal_year)
    sparkMax = periodData.reduce((max, p) => p.fiscal_year > max ? p.fiscal_year : max, periodData[periodData.length - 1].fiscal_year)

    fiscalData = data.fiscal_revenue_summary.map((item, i) => [
      item.fiscal_year,
      item.sum
    ])

    // map sparkline data to period fiscal years, if there is no year we set the year and set the sum to 0
    sparkData = periodData.map((item, i) => {
      const sum = fiscalData.find(x => x[0] === item.fiscal_year)
      return ([
        item.fiscal_year,
        sum ? sum[1] : 0
      ])
    })

    // sparkline index
    highlightIndex = sparkData.findIndex(
      x => x[0] === year
    )
  }

  return (
    <Card className={`${ classes.root } ${ props.cardCountClass }`}>
      <CardHeader
        title={<CardTitle stateTitle={props.cardTitle} stateAbbr={stateAbbr} state={props.state} />}
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
            <Box component="span" mb={4}>{year && <span>{dataSet} revenue</span>}</Box>
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
                  <Box fontSize="subtitle2.fontSize">No commodities generated revenue on federal land in {props.cardTitle} in {dataSet}.</Box>
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
                    yLabel={dataSet}
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
                    <Box fontSize="subtitle2.fontSize">There was no revenue on federal land in {props.cardTitle} in {dataSet}.</Box>
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

export default DetailCard
