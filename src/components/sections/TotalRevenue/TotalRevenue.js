import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'
import { ExploreDataLink } from '../../layouts/IconLinks/ExploreDataLink'

import utils from '../../../js/utils'
import CONSTANTS from '../../../js/constants'

const TOTAL_REVENUE_QUERY = gql`
  query TotalYearlyRevenue {
    total_yearly_fiscal_revenue2 { 
      year,
      source,
      sum
    }
    total_yearly_calendar_revenue2 { 
      year,
      source,
      sum
    }
    total_monthly_fiscal_revenue2 {
      source
      sum
      month_long
      period_date
      month
     year
    }
    total_monthly_calendar_revenue2 {
      source
      sum
      month_long
      period_date
      month
     year

  } 
 last_twelve_revenue2 {
      source
      sum
      month_long
      period_date
      month
     year

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

const useStyles = makeStyles(theme => ({
  titleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    '@media (max-width: 426px)': {
      display: 'block',
    }
  },
  titleLink: {
    fontSize: '1.2rem',
    marginBottom: 0,
    fontWeight: 'normal',
    height: 24,
    '@media (max-width: 426px)': {
      display: 'block',
      width: '100%',
    },
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
  },
  toggleButtonRoot: {
    textTransform: 'capitalize',
    '& .Mui-selected': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  toggleButtonSelected: {
    backgroundColor: `${ theme.palette.primary.dark } !important`,
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
    props.onToggleChange(newVal)
  }

  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth)
  }, [])

  const handleChange = event => {
    setPeriod(event.target.value)
    props.onMenuChange(event.target.value)
  }

  return (
    <>
      <Grid item xs={6}>
        <ToggleButtonGroup
          value={toggle}
          exclusive
          onChange={handleToggle}
          size="large"
          aria-label="Toggle between Yearly and Monthly data">
          {
            Object.values(TOGGLE_VALUES).map((item, i) => (
              <ToggleButton
                key={i}
                value={item}
                aria-label={item}
                disableRipple
                classes={{
                  root: classes.toggleButtonRoot,
                  selected: classes.toggleButtonSelected,
                }}>{ item === 'year' ? CONSTANTS.YEARLY : CONSTANTS.MONTHLY }</ToggleButton>
            ))
          }
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={6} style={{ textAlign: 'right' }}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} id="select-period-outlined-label">
          Period
          </InputLabel>
          <Select
            labelId="Period select"
            id="period-label-select-outlined"
            value={period}
            onChange={handleChange}
            labelWidth={labelWidth}
          >
            {
              (toggle === 'year')
                ? Object.values(YEARLY_DROPDOWN_VALUES).map((item, i) => (
                  <MenuItem key={i} value={item}>{ item === 'calendar_year' ? CONSTANTS.CALENDAR_YEAR : CONSTANTS.FISCAL_YEAR }</MenuItem>
                ))
                : Object.values(DROPDOWN_VALUES).map((item, i) => (
                  <MenuItem value={item} if key={i}>
                    {(() => {
                      switch (item) {
                      case 'fiscal':
                        return 'Fiscal year ' + props.maxFiscalYear
                      case 'calendar':
                        return 'Calendar year ' + props.maxCalendarYear
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
  const [period, setPeriod] = useState('fiscal_year')
  const [toggle, setToggle] = useState('year')

  // const period = state.period

  const chartTitle = props.chartTitle || `${ CONSTANTS.REVENUE } (dollars)`
  const yOrderBy = ['Federal onshore', 'Federal offshore', 'Native American', 'Federal - Not tied to a lease']
  const { loading, error, data } = useQuery(TOTAL_REVENUE_QUERY)

  if (loading) {
    return 'Loading...'
  }

  const toggleChange = value => {
    // console.debug('ON TOGGLE CHANGE: ', value)
    setToggle(value)
  }
  const menuChange = value => {
    // console.debug('ON Menu CHANGE: ', value)
    setPeriod(value)
  }

  if (error) return `Error! ${ error.message }`
  let chartData
  let xAxis
  const yAxis = 'sum'
  const yGroupBy = 'source'
  let xLabels = 'month'

  if (data) {
    if (toggle === 'month') {
      if (period === 'fiscal') {
        chartData = data.total_monthly_fiscal_revenue2
      }
      else if (period === 'calendar') {
        chartData = data.total_monthly_calendar_revenue2
      }
      else {
        chartData = data.last_twelve_revenue2
      }

      xAxis = 'month_long'
      xLabels = (x, i) => {
        // console.debug(x)
        return x.map(v => v.substr(0, 3))
      }
    }
    else {
      if (period === 'fiscal_year') {
        chartData = data.total_yearly_fiscal_revenue2
      }
      else {
        chartData = data.total_yearly_calendar_revenue2
      }
      xAxis = 'year'
      xLabels = (x, i) => {
        return x.map(v => '\'' + v.toString().substr(2))
      }
    }
  }
  return (
    <>
      <Box color="secondary.main" mb={2} borderBottom={2} pb={1} className={classes.titleBar}>
        <Box component="h3" m={0} color="primary.dark">Revenue</Box>
        <Box component="span" className={classes.titleLink}>
          <ExploreDataLink
            to="/query-data?dataType=Revenue"
            icon="filter">Filter revenue data</ExploreDataLink>
        </Box>
      </Box>
      <Grid container spacing={4}>
        <TotalRevenueControls onToggleChange={toggleChange} onMenuChange={menuChange} maxFiscalYear={2019} maxCalendarYear={2020}/>
        <Grid item xs={12}>
          <StackedBarChart
            title={chartTitle}
            data={chartData}
            xAxis={xAxis}
            yAxis={yAxis}
            yGroupBy={yGroupBy}
            yOrderBy={yOrderBy}
            xLabels={xLabels}
            legendFormat={v => {
              return utils.formatToDollarInt(v)
            }}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default TotalRevenue
