import React, { Fragment, useState, useContext } from 'react'
// import { Link } from "gatsby"

import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

import { graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Map from '../../data-viz/Map'
import StateCard from '../../layouts/StateCard'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { StoreContext } from '../../../store'
import mapJson from './us-topology.json'
// import  mapJson from './us.t2.json'

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
  toolbar: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${ theme.palette.grey[300] }`,
    boxShadow: '0 3px 6px 0 rgba(0, 0, 0, .25)',
    '& h2': {
      margin: 0,
    },
    '& label': {
      marginTop: theme.spacing(2),
    },
    '& label span': {
      margin: 0
    }
  },
  mapWrapper: {
    position: 'relative',
    height: 575,
    // marginBottom: theme.spacing(20),
    background: theme.palette.grey[200],
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    overflow: 'hidden',
  },
  mapContainer: {
    position: 'relative',
    minWidth: 280,
    flexBasis: '100%',
    height: 575,
    order: '3',
  },
  cardContainer: {
    width: '280px',
    position: 'absolute',
    right: 0,
    bottom: 0,
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
  sliderContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0),
    borderBottom: `1px solid ${ theme.palette.grey[300] }`
  },
  sliderRoot: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    top: -21,
  },
  contentWrapper: {
    paddingBottom: theme.spacing(4),
  },
  zoomButtonGroupContainer: {
    position: 'absolute',
    bottom: 200,
    left: 12,
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
  const { state, dispatch } = useContext(StoreContext)
  const [year] = useState(state.year)

  return (
    <Box className={classes.sliderRoot}>
      <Grid container spacing={4}>
        <Grid item xs>
          <Slider
            defaultValue={year}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
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
}

// Map Zoom Controls
const MapControls = props => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)

  const mapZoom = state.mapZoom

  const handleClick = val => event => {
    if (val === 'add' && mapZoom >= 1) {
      return dispatch({ type: 'MAP_ZOOM', payload: { mapZoom: mapZoom + 1 } })
    }
    if (val === 'remove' && mapZoom > 1) {
      return dispatch({ type: 'MAP_ZOOM', payload: { mapZoom: mapZoom - 1 } })
    }
  }

  return (
    <Box className={classes.zoomButtonGroupContainer}>
      <ButtonGroup
        orientation="vertical"
        variant="contained"
        aria-label="Explore data map zoom controls">
        <Button onClick={handleClick('add')}>
          <AddIcon />
        </Button>
        <Button onClick={handleClick('remove')}>
          <RemoveIcon />
        </Button>
      </ButtonGroup>
    </Box>
  )
}

const ExploreData = () => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)

  const cards = state.cards
  const year = state.year

  const handleChange = (type, name) => event => {
    console.debug('Handle change', name, event)
    return dispatch({ type: type, payload: { [name]: event.target.checked } })
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

  const { loading, error, data } = useQuery(FISCAL_REVENUE_QUERY, {
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
    console.debug('MAPJSON___________________', mapJson)
    // const timeout = 5000
    return (
      <Fragment>
        <Container maxWidth={false} className={classes.toolbar}>
          <Container>
            <Grid container>
              <Grid item sm={12} md={8}>
                <Typography variant="h2">Fiscal Year {year} Revenue</Typography>
                <Typography variant="subtitle2">
                  Select a state for detailed production, revenue, and disbursements data.
                </Typography>
              </Grid>
              <Grid item sm={12} md={2}>
                <FormControlLabel
                  control= {
                    <Switch
                      checked={state.countyLevel}
                      onChange={handleChange('COUNTY_LEVEL', 'countyLevel')}
                      value="countyLevel"
                      color="primary"
                    />
                  }
                  label="County data"
                />
              </Grid>
              <Grid item sm={12} md={2}>
                <FormControlLabel
                  control= {
                    <Switch
                      checked={state.offshore}
                      onChange={handleChange('OFFSHORE', 'offshore')}
                      value="offshore"
                      color="primary"
                    />
                  }
                  label="Offshore data"
                />
              </Grid>
            </Grid>
          </Container>
        </Container>
        <Container className={classes.mapWrapper} maxWidth={false}>
          <Grid container>
            <Grid item xs={12}>
              <Box className={classes.mapContainer}>
                <Map
                  mapFeatures={ state.countyLevel ? 'counties' : 'states' }
                  mapZoom={ state.mapZoom }
                  mapJsonObject={mapJson}
                  mapData={mapData}
                  minColor="#CDE3C3"
                  maxColor="#2F4D26"
                  onClick={(d, fips, foo, bar) => {
                    onLink(d)
                  }}
                />
                <MapControls />
              </Box>
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <Box className={classes.sliderContainer}>
                <Container>
                  <YearSlider
                    onYear={selected => {
                      onYear(selected)
                    }}
                  />
                </Container>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Container className={classes.contentWrapper}>
          <Grid container>
            <Grid item md={12}>
              <Typography variant="h2" className="header-bar green thick">
                Revenue
              </Typography>
              <Typography variant="body1">
                When companies extract natural resources on federal lands and waters, they pay royalties, rents, bonuses, and other fees, much like they would to any landowner. In fiscal year 2018, ONRR collected a total of [$9,161,704,392] in revenue.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Fragment>
    )
  }
}
export default ExploreData
