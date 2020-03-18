import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Box,
  Paper,
  Slide,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core'

import MinimizeIcon from '@material-ui/icons/Minimize'
import CloseIcon from '@material-ui/icons/Close'

import Sparkline from '../../data-viz/Sparkline'

// import { graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import utils from '../../../js/utils'

import { StoreContext } from '../../../store'

import CONSTANTS from '../../../js/constants'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '20px'
  },
  card: {
    width: 285,
    margin: '10px',
    position: 'absolute',
    right: 0,
    transform: 'translate3d(0, 0px, 0px)',
    minHeight: 325,
    '@media (max-width: 768px)': {
      width: '100%',
      height: 'auto',
    },
  },
  cardMinimized: {
    minHeight: 0,
    position: 'absolute',
    bottom: -20,
    width: 285,
    '& .MuiCardContent-root': {
      padding: 0,
    }
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    padding: 10,
    height: 40,
    fontSize: '1.2rem',
    '& .MuiCardHeader-action': {
      marginTop: 0,
    },
    '& span': {
      margin: 0,
    },
  },
  cardHeaderContent: {
    fontSize: theme.typography.h4.fontSize,
  },
  close: {
    position: 'relative',
    top: -3,
    right: '10px',
    cursor: 'pointer',
    maxWidth: 20,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  menuButton: {
    marginRight: '4px'
  },
  table: {
    width: '100%',
    marginBottom: 0,
    '& th': {
      padding: 5,
      lineHeight: 1
    },
    '& td': {
      padding: 0,
    },
  },
  paper: {
    width: '100%'
  },
}))

const APOLLO_QUERY = gql`
  query StateTrend($state: String!, $year: Int!, $period: String!) {
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
      limit: 3
      where: { fiscal_year: { _eq: $year }, state_or_area: { _eq: $state } }
      order_by: { fiscal_year: asc, total: desc }
    ) {
      fiscal_year
      commodity
      state_or_area
      total
    }

    commodity_sparkdata: revenue_commodity_summary(
      where: { state_or_area: { _eq: $state } }
      order_by: { fiscal_year: asc }
    ) {
      fiscal_year
      commodity
      total
    }

    period(where: {period: {_ilike: $period }}) {
      fiscal_year
    }
  }
`

const SummaryCard = props => {
  const classes = useStyles()
  const { state } = useContext(StoreContext)

  // const bull = <span className={classes.bullet}>•</span>
  const [minimized, setMinimized] = React.useState(true)
  const closeCard = item => {
    props.closeCard(props.fips)
  }

  const minimizeCard = item => {
    setMinimized(!minimized)
  }

  const year = state.year

  // let state = props.abbr
  const { loading, data } = useQuery(APOLLO_QUERY, {
    variables: { state: props.abbr, year: year, period: CONSTANTS.FISCAL_YEAR }
  })
  const minimizeIcon = Object.is(props.minimizeIcon, undefined)
    ? false
    : props.minimizeIcon
  const closeIcon = Object.is(props.closeIcon, undefined)
    ? true
    : props.closeIcon
  let sparkData = []
  let sparkMin
  let sparkMax
  let periodData
  let fiscalData
  let highlightIndex = 0
  let distinctCommodities = 0
  let topCommodities = []
  let total = 0
  if (loading) {
    return (
      <>
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
          <Card className={clsx(classes.card, minimizeIcon && { minimized: !minimized }, { [classes.cardMinimized]: !minimized })}>
            <CardHeader
              title={props.name}
              action={
                <>
                  {minimizeIcon && (
                    <MinimizeIcon
                      className={classes.close}
                      onClick={(e, i) => {
                        minimizeCard(i)
                      }}
                      key={state}
                    />
                  )}
                  {closeIcon && (
                    <CloseIcon
                      className={classes.close}
                      onClick={(e, i) => {
                        closeCard(i)
                      }}
                    />
                  )}
                </>
              }
              classes={{ root: classes.cardHeader, content: classes.cardHeaderContent }}
              disableTypography
            >
              <Typography variant="h4" color="inherit">
                {props.name}
              </Typography>
            </CardHeader>
            <Collapse in={minimized} timeout="auto" unmountOnExit>
              <CardContent>
                <Grid container>
                  <Typography style={{ fontSize: '.8rem' }}>
                  Loading....{' '}
                  </Typography>
                </Grid>
              </CardContent>
            </Collapse>
          </Card>
        </Slide>
      </>
    )
  }
  if (
    data &&
    data.fiscal_revenue_summary.length > 0 &&
    data.revenue_commodity_summary.length > 0 &&
    data.commodity_sparkdata.length > 0
  ) {
    // sparkData = data.fiscal_revenue_summary.map((item, i) => [
    //   item.fiscal_year,
    //   item.sum
    // ])

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

    // highlightIndex = data.fiscal_revenue_summary.findIndex(
    //   x => x.fiscal_year === year
    // )

    console.log('data.fiscal_revenue_summary: ', data.fiscal_revenue_summary)
    total = data.fiscal_revenue_summary[data.fiscal_revenue_summary.findIndex(x => x.fiscal_year === year)].sum
    distinctCommodities = data.fiscal_revenue_summary[data.fiscal_revenue_summary.findIndex(x => x.fiscal_year === year)].distinct_commodities

    console.log('data.revenue_commodity_summary: ', data.revenue_commodity_summary)

    topCommodities = data.revenue_commodity_summary
      .map((item, i) => item.commodity)
      .map((com, i) => {
        const r = data.commodity_sparkdata.filter(item => item.commodity === com)
        const s = r.map((row, i) => [row.fiscal_year, row.total])
        return { commodity: com, data: s }
      })

    console.log('topCommodities: ', topCommodities)
    // let first_top_commodity = topCommodities[0].data[highlightIndex][1]
    // let dwgh=topCommodities.map((com,i) => {
    // let r = data.commodity_sparkdata.filter( item=> item.commodity==com) let s=r.map((row,i)=>[row.fiscal_year,row.total]) return {com, s}}// )

    return (
      <>
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
          <Card className={clsx(classes.card, minimizeIcon && { minimized: !minimized }, { [classes.cardMinimized]: !minimized })}>
            <CardHeader
              title={props.name}
              action={
                <>
                  {minimizeIcon && (
                    <MinimizeIcon
                      className={classes.close}
                      onClick={(e, i) => {
                        minimizeCard(i)
                      }}
                      key={state}
                    />
                  )}
                  {closeIcon && (
                    <CloseIcon
                      className={classes.close}
                      onClick={(e, i) => {
                        closeCard(i)
                      }}
                    />
                  )}
                </>
              }
              classes={{ root: classes.cardHeader, content: classes.cardHeaderContent }}
              disableTypography
            >
              <Typography variant="h4" color="inherit">
                {props.name}
              </Typography>
            </CardHeader>
            <CardContent>
              <Collapse in={minimized} timeout="auto" unmountOnExit>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="caption">
                      <Box>Trend</Box>
                      <Box>({sparkMin} - {sparkMax})</Box>
                    </Typography>
                    <Box component="span">
                      {sparkData && (
                        <Sparkline
                          data={sparkData}
                          highlightIndex={highlightIndex}
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography variant="caption">
                      <Box>{state.year}</Box>
                      <Box>
                        {utils.formatToSigFig_Dollar(Math.floor(total), 3)}
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12} zeroMinWidth>
                    <Typography
                      variant="subtitle2"
                      style={{ fontWeight: 'bold', marginBottom: 10 }}
                    >
                    Top Commodities
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container>
                  <Paper className={classes.paper} style={{ marginBottom: 10 }}>
                    <Table
                      className={classes.table}
                      size="small"
                      aria-label="top commodities table"
                    >
                      <TableBody>
                        {topCommodities &&
                        topCommodities.map((row, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell component="th" scope="row">
                                <Typography style={{ fontSize: '.8rem' }}>
                                  {row.commodity}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Sparkline
                                  data={row.data}
                                  highlightIndex={row.data.findIndex(
                                    x => x[0] === year
                                  )}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Typography style={{ fontSize: '.8rem' }}>
                                  {utils.formatToSigFig_Dollar(
                                    Math.floor(
                                      // eslint-disable-next-line standard/computed-property-even-spacing
                                      topCommodities[i].data[
                                        row.data.findIndex(x => x[0] === year)
                                      ][1]
                                    ),
                                    3
                                  )}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>

                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" component="span">
                    Total Commodities: {distinctCommodities}
                    </Typography>
                  </Grid>
                </Grid>
              </Collapse>
            </CardContent>
          </Card>
        </Slide>
      </>
    )
  }
  else {
    return (
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Card className={classes.card}>
          <CardHeader
            title={props.name}
            action={
              <CloseIcon
                className={classes.close}
                onClick={(e, i) => {
                  closeCard(i)
                }}
              />
            }
            classes={{ root: classes.cardHeader, content: classes.cardHeaderContent }}
            disableTypography
          >
            <Typography variant="h4" color="inherit">
              {props.name}
            </Typography>
            <CloseIcon
              className={classes.close}
              onClick={(e, i) => {
                closeCard(i)
              }}
            />
          </CardHeader>
          <CardContent>
            <Grid container>
              <Typography style={{ fontSize: '.8rem' }}>
                {props.name} doesn't have any revenue data for the year {year}.
              </Typography>
            </Grid>
          </CardContent>
        </Card>
      </Slide>
    )
  }
}

export default SummaryCard
