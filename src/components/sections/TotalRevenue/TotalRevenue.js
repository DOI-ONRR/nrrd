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
  query TotalYearlyRevenue {
    total_yearly_fiscal_revenue2(where: {  period: { _eq: "Monthly" }, fiscal_year: { _gt: 2009,  _lt: 2020 } }) { 
      fiscal_year,
      revenue_source,
      sum
    }
    total_monthly_fiscal_revenue2(where: {  period: { _eq: "Monthly" }, fiscal_year:  { _eq: 2019 } }) {
      source
      sum
      month_long
      period_date
      fiscal_month
     fiscal_year
  } 
}

`
const TOGGLE_VALUES = {
  Year: 'Yearly',
  Month: 'Monthly'
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
  },
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}))

// Toggle Component
const ToggleGroup = props => {
  const [toggle, setToggle] = useState('Yearly')

  const handleToggle = (event, newVal) => {
    console.debug('handleToggle', event, newVal)
    setToggle(newVal)
  }

  return (
    <ToggleButtonGroup
      value={toggle}
      exclusive
      onChange={handleToggle}
      aria-label="Toggle between Yearly and Monthly data">
      {
        Object.values(TOGGLE_VALUES).map((item, i) => (
          <ToggleButton key={i} value={item} aria-label={item} disableRipple={true}>{item}</ToggleButton>
        ))
      }
    </ToggleButtonGroup>
  )
}

// Form control gridColumnGroup
const FormControlGroup = props => {
  const classes = useStyles()
  const inputLabel = useRef(null)
  const [period, setPeriod] = useState('')
  const [labelWidth, setLabelWidth] = useState(0)

  useEffect(() => {
    // setLabelWidth(inputLabel.current.offsetWidth)
  }, [])

  const handleChange = event => {
    setPeriod(event.target.value)
  }

  return (
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
        <MenuItem value="">None</MenuItem>
        <MenuItem value="Calendar Year">Calendar Year</MenuItem>
        <MenuItem value="Fiscal Year">Fiscal Year</MenuItem>
      </Select>
    </FormControl>
  )
}

// TotalRevenue component
const TotalRevenue = props => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)

  const [period, setPeriod] = useState(state.period)
  const [toggle, setToggle] = useState('Yearly')

  // const period = state.period

  const chartTitle = props.chartTitle || `${ CONSTANTS.REVENUE } (dollars)`
  const columns = props.columns || ['fiscal_year', 'federal_onshore', 'federal_offshore', 'native_american', 'not_tied_to_a_lease']
  const columnNames = props.columnNames || [CHART_LEGEND_TITLE, '', state.year]

  const yLabels = props.yLabels || ['Federal onshore', 'Federal offshore', 'Native American', 'Federal - Not tied to a lease']
  const xRotate = props.xRotate || 0
  const yOrderBy =  ['Federal onshore', 'Federal offshore', 'Native American', 'Federal - Not tied to a lease']
  
  const { loading, error, data } = useQuery(TOTAL_REVENUE_QUERY)

  if (loading) {
    return 'Loading...'
  }

  if (error) return `Error! ${ error.message }`
  let chartData
  let xAxis
  let yAxis ='sum'
  let yGroupBy='source'
  let xLabels='fiscal_month'
  
  if (data) {
    let p='Monthly'
    console.debug('---------------------------------------period:',toggle,  period)
    if(p === 'Monthly') {
      chartData=data.total_monthly_fiscal_revenue2
      xAxis='month_long'
      xLabels= (x,i) =>
                {
                  console.debug(x)
                  return x.map( v => '\''+v.toString().substr(0))
                }   
      
    } else {
      chartData=data.total_yearly_fiscal_revenue2
      xAxis='fiscal_year'
      xLabels= (x,i) =>
                {
                  console.debug(x)
                  return x.map( v => '\''+v.toString().substr(2))
                }
              

      console.debug('esle')
    }
    
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
        <Grid item xs={6}>
          <ToggleGroup
            onChange={ ()=> (e,newVal) => { console.debug('in tltoal revenue', e, newVal) }}
            />
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <FormControlGroup />
        </Grid>
        <Grid item xs={12}>
          <StackedBarChart
            title={chartTitle}
            data={chartData}
            xAxis={xAxis}
            yAxis={yAxis}
            yGroupBy={yGroupBy}
            yOrderBy={yOrderBy}
            legendFormat={utils.formatToDollarFloat}
            onClick={d => {
              dispatch({ type: 'YEAR', payload: { year: data.total_yearly_revenue[d.selectedIndex].fiscal_year } })
            }} />
        </Grid>
      </Grid>
    </Box>
  )

  
}

export default TotalRevenue
