import React, { Fragment, useState, useContext } from 'react'
// import { Link } from "gatsby"

import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import { graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Map from '../../data-viz/Map'
import StateCard from '../../layouts/StateCard'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { StoreContext } from '../../../store'
//import {mapJson} from './us-topology.json'
import  mapJson from './us-topology.json'

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
  query FiscalRevenue($year: Int!, $location: String!) {
    fiscal_revenue_summary(where: {state_or_area: {_nin: ["National", ""]}, fiscal_year: { _eq: $year }, location_type: { _eq: $location } }) {
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

// fiscal_revenue_summary(order_by: {fiscal_year: desc, state_or_area: asc}, where: {fiscal_year: {_eq: 2019}}) {
//     fiscal_year
//     state_or_area
//     sum
//   }
// }`

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    margin: 0,
  },
  section: {
    marginTop: theme.spacing(2),
    height: '600px'
  },
  mapWrapper: {
    position: 'relative',
    height: 600,
    marginBottom: theme.spacing(20),
  },
  mapContainer: {
    position: 'relative',
    minWidth: '280px',
    flexBasis: '100%',
    height: '600px',
    order: '3',
  },
  cardContainer: {
    width: '280px',
    position: 'absolute',
    right: 0,
    bottom: 20,
    height: 500,
    '& > div': {
      cursor: 'pointer',
    },
    '& > div:nth-child(2)': {
      transform: 'translate3d(-10%, 0px, 0px) !important',
    },
    '& > div:nth-child(3)': {
      transform: 'translate3d(-20%, 0px, 0px) !important',
    },
    '& > div:nth-child(4)': {
      transform: 'translate3d(-30%, 0px, 0px) !important',
    },
    '& > div:nth-child(5)': {
      transform: 'translate3d(-40%, 0px, 0px) !important',
    },
    '& .minimized ~ div:nth-of-type(2)': {
      transform: 'translate3d(0px, 0px, 0px) !important',
    },
    '& .minimized ~ div:nth-of-type(3)': {
      transform: 'translate3d(-10%, 0px, 0px) !important',
    },
    '& .minimized ~ div:nth-of-type(4)': {
      transform: 'translate3d(-20%, 0px, 0px) !important',
    },
    '& .minimized ~ div:nth-of-type(5)': {
      transform: 'translate3d(-30%, 0px, 0px) !important',
    },
    '&:hover': {
      cursor: 'pointer',
      '& > div:nth-child(2)': {
        transform: 'translate3d(-100%, 0px, 0px) !important',
      },
      '& > div:nth-child(3)': {
        transform: 'translate3d(-200%, 0px, 0px) !important',
      },
      '& > div:nth-child(4)': {
        transform: 'translate3d(-300%, 0px, 0px) !important',
      },
      '& > div:nth-child(5)': {
        transform: 'translate3d(-400%, 0px, 0px) !important',
      },
      '& .minimized ~ div:nth-of-type(2)': {
        transform: 'translate3d(0px, 0px, 0px) !important',
      },
      '& .minimized ~ div:nth-of-type(3)': {
        transform: 'translate3d(-100%, 0px, 0px) !important',
      },
      '& .minimized ~ div:nth-of-type(4)': {
        transform: 'translate3d(-200%, 0px, 0px) !important',
      },
      '& .minimized ~ div:nth-of-type(5)': {
        transform: 'translate3d(-300%, 0px, 0px) !important',
      },
    }
  },
  sliderRoot: {
    width: '100%',
    position: 'relative',
    top: -10,
  }
}))

const fiscalYearMarks = () => {
  return Array(17).fill(0).map((e, i) => (
    { label: i + 2003, value: i + 2003 }
  ))
}

// YearSlider
const YearSlider = props => {
  const classes = useStyles()
  const { state } = useContext(StoreContext)
  const [year] = useState(state.year)

  return (
    <Box className={classes.sliderRoot}>
      <Grid container spacing={4}>
        <Grid item xs>
          <Slider
            defaultValue={year}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="on"
            step={1}
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

  // return(<div><div>FOO</div><div>{data && data.year}</div></div>)
}

const ExploreData = () => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)

  const cards = state.cards
  const year = state.year
  const handleChange = name => event => {
    console.debug('Handle change', name, event)
    return dispatch({ type: 'COUNTY_LEVEL', payload: { [name]: event.target.checked } })
  }
  const location = state.countyLevel ? 'County' : 'State'
  const onLink = state => {
    if (
      cards.filter(item => item.fips === state.properties.FIPS).length === 0
    ) {
      cards.push({
        fips: state.properties.FIPS,
        abbrev: state.properties.abbr,
        name: state.properties.name
      })
    }
    return dispatch({ type: 'CARDS', payload: { cards: cards } })
  }

  const onYear = selected => {
    dispatch({ type: 'YEAR', payload: { year: selected } })
  }

  const closeCard = fips => {
    dispatch({ type: 'CARDS', payload: { cards: cards.filter(item => item.fips !== fips) } })
  }

  let { loading, error, data } = useQuery(FISCAL_REVENUE_QUERY, {
    variables: { year, location }
  })
 // const cache = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]

 //  cache.map((year, i) => {
 //      useQuery(FISCAL_REVENUE_QUERY, { variables: { year, location } })
 //  })



  if (loading) {
    return loading
  }

  if (error) return `Error! ${ error.message }`

  if (data) {
    const mapData = data.fiscal_revenue_summary.map((item, i) => [
      item.state_or_area,
      item.sum
    ])
    console.debug("MAPJSON___________________", mapJson);
    // const timeout = 5000
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
        <Container className={classes.mapWrapper} maxWidth={false}>
          <Grid container>
            <Grid item md={12}>
              <Box className={classes.mapContainer}>
                <FormControlLabel
                  control= {
                    <Switch
                      checked={state.countyLevel}
                      onChange={handleChange('countyLevel')}
                      value="countyLevel"
                      color="primary"
                    />
                  }
                  label="County Data"
                />
                <Map
      mapFeatures={ state.countyLevel ? 'counties' : 'states' }
      mapJsonObject={mapJson}
                  mapData={mapData}
                  minColor="#CDE3C3"
                  maxColor="#2F4D26"
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
            </Grid>
          </Grid>
        </Container>
      </Fragment>
    )
  }
}
export default ExploreData
