import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
// import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Slide from '@material-ui/core/Slide'
import Collapse from '@material-ui/core/Collapse'
import MinimizeIcon from '@material-ui/icons/Minimize'
import AddIcon from '@material-ui/icons/Add'
// import MaxmizeIcon from '@material-ui/icons/Maximize'

// import CardActions from '@material-ui/core/CardActions'
// import IconButton from '@material-ui/core/IconButton'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
// import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'

// import AppBar from "@material-ui/core/AppBar"
// import Toolbar from "@material-ui/core/Toolbar"
// import IconButton from "@material-ui/core/IconButton"
// import MenuIcon from "@material-ui/icons/Menu"
import CloseIcon from '@material-ui/icons/Close'

import Sparkline from '../data-viz/Sparkline'

// import { graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import utils from '../../js/utils'

import { StoreContext } from '../../store'

const useStyles = makeStyles({
  root: {
    marginBottom: '20px'
  },
  card: {
    width: 285,
    margin: '10px',
    position: 'absolute',
    right: 0,
    transform: 'translate3d(0, 0px, 0px)',
    minHeight: 305,
    '@media (max-width: 768px)': {
      width: '100%',
      height: 'auto',
    }
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
    padding: 10,
    height: 40,
    '& .MuiCardHeader-action': {
      marginTop: 0,
    },
    '& span': {
      margin: 0,
    },
  },
  close: {
    position: 'relative',
    top: 0,
    right: '10px',
    cursor: 'pointer'
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
})

const APOLLO_QUERY = gql`
  query StateTrend($state: String!, $year: Int!) {
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
  }
`
// const COMMODITY_TRENDS = gql`
//   query CommmodityTrend($state: String!, $commodity: String!) {
//     revenue_commodity_summary(
//       where: { commodity: { _eq: $commodity }, state_or_area: { _eq: $state } }
//     ) {
//       fiscal_year
//       total
//     }
//   }
// `

// const TopCommodities = (state, commodity) => {
//   const { loading, error, data } = useQuery(COMMODITY_TRENDS, {
//     variables: { state: state, commodity: commodity }
//   })

//   let r = [[]]
//   if (data) {
//     r = data.revenue_commodity_summary.map((item, i) => [
//       item.fiscal_year,
//       item.total
//     ])
//   }
//   return r
// }



const StateCard = props => {
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

  // let state = props.abbrev
  const { loading, data } = useQuery(APOLLO_QUERY, {
    variables: { state: props.abbrev, year: year }
  })
  const minimizeIcon = Object.is(props.minimizeIcon, undefined)
    ? false
    : props.minimizeIcon
  const closeIcon = Object.is(props.closeIcon, undefined)
    ? true
    : props.closeIcon
  let sparkData = []
  let sparkMin = 203
  let sparkMax = 219
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
              className={classes.cardHeader}
            >
              <Typography variant="h6" color="inherit">
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
    console.debug("=========================== "+props.abbrev+" ===============================")
    console.debug(data)
    
    sparkData = data.fiscal_revenue_summary.map((item, i) => [
      item.fiscal_year,
      item.sum
    ])

    highlightIndex = data.fiscal_revenue_summary.findIndex(
      x => x.fiscal_year === year
    )
    total = data.fiscal_revenue_summary[highlightIndex].sum
    distinctCommodities =
      data.fiscal_revenue_summary[highlightIndex].distinct_commodities
    topCommodities = data.revenue_commodity_summary
      .map((item, i) => item.commodity)
      .map((com, i) => {
        const r = data.commodity_sparkdata.filter(item => item.commodity === com)
        const s = r.map((row, i) => [row.fiscal_year, row.total])
        return { commodity: com, data: s }
      })
    // let first_top_commodity = topCommodities[0].data[highlightIndex][1]
    // let dwgh=topCommodities.map((com,i) => {
    // let r = data.commodity_sparkdata.filter( item=> item.commodity==com) let s=r.map((row,i)=>[row.fiscal_year,row.total]) return {com, s}}// )

    sparkMin = sparkData[0][0]
    sparkMax = sparkData[sparkData.length - 1][0]

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
              className={classes.cardHeader}
            >
              <Typography variant="h6" color="inherit">
                {props.name}
              </Typography>
            </CardHeader>
            <CardContent>
              <Collapse in={minimized} timeout="auto" unmountOnExit>
                <Grid container>
                  <Grid item xs={7}>
                    <Typography variant="caption">
                      <Box>
                      Trend ({sparkMin} - {sparkMax})
                      </Box>
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
                  <Grid item xs={5} style={{ textAlign: 'right' }}>
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
            className={classes.cardHeader}
          >
            <Typography variant="h6" color="inherit">
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
export default StateCard
