import React, { Fragment, useState, useContext, useEffect, useRef } from 'react'
// import { Link } from "gatsby"
import { graphql } from 'gatsby'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Fade from '@material-ui/core/Fade'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'
import { ExploreDataLink } from '../../layouts/IconLinks/ExploreDataLink'

import { StoreContext } from '../../../store'
import { ThemeConsumer } from 'styled-components'
import utils from '../../../js/utils'
import CONSTANTS from '../../../js/constants'
import { classicNameResolver } from 'typescript'
import { set } from 'd3'

const TOTAL_REVENUE_QUERY = gql`
  query TotalYearlyRevenue($period: String!) {
    total_yearly_revenue(where: { fiscal_year: { _gt: 2009 },  period: { _eq: $period } }) { 
      federal_offshore
      federal_onshore
      native_american
      not_tied_to_a_lease
      fiscal_year
    }
  }
`
const TOGGLE_VALUES = {
  Year: 'year',
  Month: 'month'
}

const DROPDOWN_VALUES = {
  Recent: 'recent',
  Fiscal: 'fiscal',
  Calendar: 'calendar'
}

const YEARLY_DROPDOWN_VALUES = {
  Fiscal: 'fiscal_year',
  Calendar: 'calendar_year'
}

const CHART_LEGEND_TITLE = 'Source'

const useStyles = makeStyles(theme => ({
  titleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  titleLink: {
    fontSize: '1.2rem',
    marginBottom: 0,
    fontWeight: 'normal',
    '& span': {
      marginRight: 0,
    }
  },
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
    textAlign: 'right',
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}))

// Total Revenu Controls, Menu
const TotalRevenueControls = props => {
  const classes = useStyles()

  const inputLabel = useRef(null)

  const [period, setPeriod] = useState('')
  const [labelWidth, setLabelWidth] = useState(0)
  const [toggle, setToggle] = useState('year')

  const handleToggle = (event, newVal) => {
    setToggle(newVal)
  }

  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth)
  }, [])

  const handleChange = event => {
    setPeriod(event.target.value)
  }

  return (
    <>
      <Grid item xs={6}>
        <ToggleButtonGroup
          value={toggle}
          exclusive
          onChange={handleToggle}
          aria-label="Toggle between Yearly and Monthly data">
          {
            Object.values(TOGGLE_VALUES).map((item, i) => (
              <ToggleButton key={i} value={item} aria-label={item} disableRipple={true}>{ item === 'year' ? CONSTANTS.YEARLY : CONSTANTS.MONTHLY }</ToggleButton>
            ))
          }
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={6} style={{ textAlign: 'right' }}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
          Period
          </InputLabel>
          <Select
            labelId="Period label"
            id="period-label-select-outlined"
            value={period}
            onChange={handleChange}
            labelWidth={labelWidth}
          >
            {
              (toggle === 'year')
                ? Object.values(YEARLY_DROPDOWN_VALUES).map((item, i) => (
                  <MenuItem value={item}>{ item === 'calendar_year' ? CONSTANTS.CALENDAR_YEAR : CONSTANTS.FISCAL_YEAR }</MenuItem>
                ))
                : Object.values(DROPDOWN_VALUES).map((item, i) => (
                  <MenuItem value={item}>
                    {(() => {
                      switch (item) {
                      case 'fiscal':
                        return 'Fiscal year + [REVENUES_FISCAL_YEAR_OLD]'
                      case 'calendar':
                        return 'Calendar year + [REVENUES_CALENDAR_YEAR]'
                      default:
                        return 'Most recent 12 months'
                      }
                    })()}
                  </MenuItem>
                ))
            }
          </Select>
        </FormControl>
      </Grid>
    </>
  )
}

// TotalRevenue component
const TotalRevenue = props => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)

  const [period, setPeriod] = useState(state.period)

  // const period = state.period

  const chartTitle = props.chartTitle || `${ CONSTANTS.REVENUE } (dollars)`
  const columns = props.columns || ['fiscal_year', 'federal_onshore', 'federal_offshore', 'native_american', 'not_tied_to_a_lease']
  const columnNames = props.columnNames || [CHART_LEGEND_TITLE, '', state.year]

  const yLabels = props.yLabels || ['Federal onshore', 'Federal offshore', 'Native American', 'Federal - Not tied to a lease']
  const xLabels = props.xLabels || ["'10", "'11", "'12", "'13", "'14", "'15", "'16", "'17", "'18", "'19"]
  const xRotate = props.xRotate || 0

  const { loading, error, data } = useQuery(TOTAL_REVENUE_QUERY, {
    variables: { period }
  })

  if (loading) {
    return 'Loading...'
  }

  if (error) return `Error! ${ error.message }`
  if (data) {
    console.debug('DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', data)
  }

  return (
    <Box>
      <Typography variant="h3" className={`header-bar green ${ classes.titleBar }`}>
          Total Revenue
        <Box component="span" className={classes.titleLink}>
          <ExploreDataLink
            to="/query-data?dataType=Revenue"
            icon="filter">Filter revenue data</ExploreDataLink>
        </Box>
      </Typography>
      <Grid container spacing={4}>
        <TotalRevenueControls />
        <Grid item xs={12}>
          <StackedBarChart
            chartTitle={chartTitle}
            data={data.total_yearly_revenue}
            legendDataFormatFunc={utils.formatToDollarFloat}
            columns={columns}
            columnNames={columnNames}
            xRotate={xRotate}
            yLabels={yLabels}
            xLabels={xLabels}
            onClick={d => {
              dispatch({ type: 'YEAR', payload: { year: data.total_yearly_revenue[d.selectedIndex].fiscal_year } })
            }} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default TotalRevenue
