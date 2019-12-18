import React, { Fragment, useState, useContext } from "react"
//import { Link } from "gatsby"

import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import Slider from "@material-ui/core/Slider"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import Fade from "@material-ui/core/Fade"

import { graphql } from "gatsby"
import { useQuery } from "@apollo/react-hooks"
import gql from "graphql-tag"

import Map from "../../data-viz/Map"
import StateCard from "../../layouts/StateCard"

import { StoreContext } from "../../../store"

export const STATIC_QUERY = graphql`
  {
    onrr {
      commodity(distinct_on: fund_type) {
        fund_type
      }
    }
  }
`

const FISCAL_REVENUE_QUERY = gql`
  query FiscalRevenue($year: Int!) {
    fiscal_revenue_summary(where: { fiscal_year: { _eq: $year } }) {
      fiscal_year
      state_or_area
      sum
    }
  }
`

// const CACHE_QUERY = gql`
//   {
//     year @client
//   }
// `

/*
fiscal_revenue_summary(order_by: {fiscal_year: desc, state_or_area: asc}, where: {fiscal_year: {_eq: 2019}}) {
    fiscal_year
    state_or_area
    sum
  }
}`
*/

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    margin: 0,
  },
  section: {
    marginTop: theme.spacing(2),
    height: "600px"
  },
  fluid: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0)
  },
  heroContent: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),

    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(5),
    fontWeight: 300,
    marginTop: "5rem"
  },
  mapWrapper: {
    position: `relative`,
    height: 600,
  },
  mapContainer: {
    position: "relative",
    minWidth: "280px",
    flexBasis: "100%",
    height: "600px",
    order: "3",
  },
  cardContainer: {
    width: "280px",
    position: "absolute",
    right: 0,
    bottom: 20,
    height: 500,
    '& > div:nth-child(2)': {
      cursor: `pointer`,
      transform: `translate3d(-10%, 0px, 0px) !important`,
    },
    '& > div:nth-child(3)': {
      cursor: `pointer`,
      transform: `translate3d(-20%, 0px, 0px) !important`,
    },
    '& > div:nth-child(4)': {
      cursor: `pointer`,
      transform: `translate3d(-30%, 0px, 0px) !important`,
    },
    '& > div:nth-child(5)': {
      cursor: `pointer`,
      transform: `translate3d(-40%, 0px, 0px) !important`,
    },
    '&:hover': {
      '& > div:nth-child(2)': {
        cursor: `pointer`,
        transform: `translate3d(-100%, 0px, 0px) !important`,
      },
      '& > div:nth-child(3)': {
        cursor: `pointer`,
        transform: `translate3d(-200%, 0px, 0px) !important`,
      },
      '& > div:nth-child(4)': {
        cursor: `pointer`,
        transform: `translate3d(-300%, 0px, 0px) !important`,
      },
      '& > div:nth-child(5)': {
        cursor: `pointer`,
        transform: `translate3d(-400%, 0px, 0px) !important`,
      },
    }
  },
  sliderRoot: {
    width: `100%`,
    position: `relative`,
    top: -10,
  }
}))

const fiscalYearMarks = () => {
  return Array(17).fill(0).map((e,i) => ( 
    { label: i+2003, value: i+2003 } 
  ))
}

//const filter=false
const YearSlider = props => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)
  // const { data, client } = useQuery(CACHE_QUERY)

  //    console.debug(client)
  //    const { loading, error, data} = useQuery(FISCAL_REVENUE_QUERY)
  let year = state.year
  // if (data) {
  //   year = data.year
  // }
  
  return (
    <Box className={classes.sliderRoot}>
      <Grid container spacing={4}>
        <Grid item xs>
          <Slider
            defaultValue={year}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="on"
            step={1}
            valueLabelDisplay="on"
            onChangeCommitted={(e, yr) => {
              props.onYear(yr)
            }}
            marks={fiscalYearMarks()}
            min={2003}
            max={2019}
          />
        </Grid>
      </Grid>
    </Box>
  )

  //return(<div><div>FOO</div><div>{data && data.year}</div></div>)
}

const ExploreData = () => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)

  const cards = state.cards
  const year = state.year

  const onLink = state => {
    if (
      cards.filter(item => item.fips == state.properties.FIPS).length == 0
    ) {
      cards.push({
        fips: state.properties.FIPS,
        abbrev: state.properties.abbr,
        name: state.properties.name
      })
    }
    return dispatch({ type: 'CARDS', payload: { cards: cards }})
  }

  const onYear = selected => {
    dispatch({ type: 'YEAR', payload: { year: selected }})
  }

  const closeCard = fips => {
    dispatch({ type: 'CARDS', payload: { cards: cards.filter(item => item.fips !== fips) }})
  }

  const { loading, error, data, client } = useQuery(FISCAL_REVENUE_QUERY, {
    variables: { year }
  })

  if (loading) {
    return "Loading..."
  }

  if (error) return `Error! ${error.message}`

  if (data) {
    let mapData = data.fiscal_revenue_summary.map((item, i) => [
      item.state_or_area,
      item.sum
    ])

    let timeout = 5000
    return (
      <Fragment>
        <Container>
          <Grid container spacing={2}>
            <Grid item sm={12} md={4}>
              <Box mt={2} mb={2}>
                <Typography variant="h2">Fiscal Year {year} Revenue</Typography>
                <Typography variant="subtitle2">
                  Select a state for detailed production, revenue, and disbursements data.
                </Typography>
              </Box>
            </Grid>
            <Grid item sm={12} md={8}>
              <Box mt={6} mb={5}>
                {/* Year Slider */}
                  <YearSlider
                    onYear={selected => {
                      onYear(selected)
                    }}
                  />
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Container className={classes.mapWrapper} maxWidth="false">
          <Grid container>
            <Grid item md={10}>
              <Box className={classes.mapContainer}>
                <Map
                  mapFeatures="states"
                  mapData={mapData}
                  onClick={(d, fips, foo, bar) => {
                    onLink(d)
                  }}
                />
              </Box>
            </Grid>
            <Grid item md={2}>
              <Box className={classes.cardContainer}>
                {cards.map((state, i) => {
                  return (
                    
                      <StateCard
                        key={i}
                        fips={state.fips}
                        abbrev={state.abbrev}
                        name={state.name}
		                    minimizeIcon={state.minimizeIcon}
		                    closeIcon={state.closeIcon}
                        closeCard={fips => {
                          closeCard(fips)
                        }}
                      />
                    
                  )
                })}
              </Box>
            </Grid>
          </Grid>
      </Container>
        <Container className={classes.contentWrapper}>
          <Grid container>
            <Grid item md={12}>
              <Typography variant="h1">
                Explore the data
              </Typography>
              {/* <CounterTest /> */}
              {/* <ApolloStateTest /> */}
            </Grid>
          </Grid>
        </Container>
      </Fragment>
    )
  }
  
}
export default ExploreData
