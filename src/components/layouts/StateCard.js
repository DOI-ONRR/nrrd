import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import Paper from "@material-ui/core/Paper"

import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import CloseIcon from "@material-ui/icons/Close"

import Sparkline from "../data-viz/Sparkline"

import { graphql } from "gatsby"
import { useQuery } from "@apollo/react-hooks"
import gql from "graphql-tag"

import utils from "../../js/utils"

const useStyles = makeStyles({
  root: {
    marginBottom: `20px`
  },
  card: {
    width: 285,
    margin: "10px"
  },
  cardHeader: {
    padding: `4px 16px 0`
  },
  close: {
    position: "relative",
    top: `10px`,
    right: "10px",
    cursor: `pointer`
  },

  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  menuButton: {
    marginRight: "4px"
  }
})

const APOLLO_QUERY = gql`
  query StateTrend($state: String!, $year: Int!) {
    fiscal_revenue_summary(where: { state_or_area: { _eq: $state } }) {
      fiscal_year
      state_or_area
      sum
      distinct_commodities
    }

    revenue_commodity_summary(
      limit: 3
      where: { fiscal_year: { _eq: $year }, state_or_area: { _eq: $state } }
    ) {
      fiscal_year
      commodity
      state_or_area
      total
    }

    commodity_sparkdata: revenue_commodity_summary(
      where: { state_or_area: { _eq: $state } }
    ) {
      fiscal_year
      commodity
      total
    }
  }
`
const COMMODITY_TRENDS = gql`
  query CommmodityTrend($state: String!, $commodity: String!) {
    revenue_commodity_summary(
      where: { commodity: { _eq: $commodity }, state_or_area: { _eq: $state } }
    ) {
      fiscal_year
      total
    }
  }
`

const CACHE_QUERY = gql`
  {
    selectedYear @client
  }
`

const Foo = props => {
  const { data, client } = useQuery(CACHE_QUERY)

  let year = 2018
  if (data) {
    year = data.selectedYear
  }
  return year
}

const TopCommodities = (state, commodity) => {
  const { loading, error, data } = useQuery(COMMODITY_TRENDS, {
    variables: { state: state, commodity: commodity }
  })

  let r = [[]]
  if (data) {
    r = data.revenue_commodity_summary.map((item, i) => [
      item.fiscal_year,
      item.total
    ])
  }
  return r
}

const StateCard = props => {
  const classes = useStyles()
  const bull = <span className={classes.bullet}>•</span>
  const closeCard = item => {
    props.closeCard(props.fips)
  }

  let year = Foo()

  let state = props.abbrev
  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: state, year: year }
  })
  let sparkData = []
  let sparkMin = 203
  let sparkMax = 219
  let highlightIndex = 0
  let distinct_commodities = 0
  let top_commodities = []
  let total = 0

  if (data) {
    console.debug("fooooooooooooooooooooooooooooooooooooooooooooooooooooooo")
    console.debug(data)
    sparkData = data.fiscal_revenue_summary.map((item, i) => [
      item.fiscal_year,
      item.sum
    ])
    highlightIndex = data.fiscal_revenue_summary.findIndex(
      x => x.fiscal_year === year
    )
    total = data.fiscal_revenue_summary[highlightIndex].sum
    distinct_commodities =
      data.fiscal_revenue_summary[highlightIndex].distinct_commodities
    top_commodities = data.revenue_commodity_summary
      .map((item, i) => item.commodity)
      .map((com, i) => {
        let r = data.commodity_sparkdata.filter(item => item.commodity == com)
        let s = r.map((row, i) => [row.fiscal_year, row.total])
        return { commodity: com, data: s }
      })
    console.debug("TOp commodities", top_commodities)
    //	let dwgh=top_commodities.map((com,i) => {let r = data.commodity_sparkdata.filter( item=> item.commodity==com) let s=r.map((row,i)=>[row.fiscal_year,row.total]) return {com, s}})
    //	console.debug("TOp commodities dwgh", dwgh)

    sparkMin = sparkData[0][0]
    sparkMax = sparkData[sparkData.length - 1][0]
  }

  return (
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
          <Grid item xs={7}>
            <Typography variant="caption">
              <Box>Trend ({sparkMin} - {sparkMax})</Box>
            </Typography>
            <Box component="span">
              {sparkData && (
                <Sparkline data={sparkData} highlightIndex={highlightIndex} />
              )}
            </Box>
          </Grid>
          <Grid item xs={5} style={{ textAlign: `right`}}>
            <Typography variant="caption">
              <Box>FY{year}</Box> 
              <Box>{ utils.formatToSigFig_Dollar(Math.floor(total),3) }</Box>
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <Typography variant="subtitle2" style={{ fontWeight: `bold`, marginBottom: 10 }}>
              Top Commodities
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {top_commodities &&
            top_commodities.map((row, i) => {
              return (
                <Grid item xs={4}>
                  <Paper style={{ padding: `5px`, marginBottom: `1rem`}}>
                    <Typography style={{ fontSize: `.8rem` }}>
                      {row.commodity}
                    </Typography>
                    <Sparkline data={row.data} highlightIndex={highlightIndex} />
                  </Paper>
                </Grid>
              )
            })}
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <Typography variant="subtitle2" component="span">
              Total Commodities: {distinct_commodities}
            </Typography>
          </Grid>
        </Grid>

      </CardContent>
    </Card>

      //   {/*<Typography variant="h5" component="h2">
	    // {props.name}
      //       </Typography>*/}

      //   {/* <Typography
      //     className={classes.title}
      //     color="textSecondary"
      //     gutterBottom
      //   >
      //     Trend ({sparkMin} - {sparkMax} )
      //   </Typography> */}

        
      //   {/* <Typography variant="body2" component="p">
      //     <span>
      //       FY{year} {total}
      //     </span>
      //   </Typography> */}
      //   {/* <Typography variant="body2" component="p">
      //     <span>Total Commodities {distinct_commodities}</span>
      //   </Typography> */}
      //   {/* <Typography>
      //     {top_commodities &&
      //       top_commodities.map((row, i) => {
      //         return (
      //           <>
      //             <label>{row.commodity}</label>
      //             <Sparkline data={row.data} highlightIndex={highlightIndex} />
      //           </>
      //         )
      //       })}
      //   </Typography> */}
      
      // {/* <CardActions>
      //   <Button size="small">Learn More</Button>
      // </CardActions> */}
  )
}
export default StateCard
