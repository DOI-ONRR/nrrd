import React, { Fragment, useState, useContext } from 'react'
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

import StackedBarChart from '../../data-viz/StackedBarChart/StackedBarChart'
import { ExploreDataLink } from '../../layouts/IconLinks/ExploreDataLink'

import { StoreContext } from '../../../store'
import { ThemeConsumer } from 'styled-components'
import utils from '../../../js/utils'
import CONSTANTS from '../../../js/constants'
import { classicNameResolver } from 'typescript'

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
  }
}))

const TotalRevenue = props => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)
  const period = state.period

  const chartTitle = props.chartTitle || `${ CONSTANTS.REVENUE } (dollars)`
  const columns = props.columns || ['fiscal_year', 'federal_onshore', 'federal_offshore', 'native_american', 'not_tied_to_a_lease']
  const columnHeaders = props.columnHeaders || ['Source', 'Year']

  const yLabels = props.yLabels || ['Federal onshore', 'Federal offshore', 'Native American', 'Not tied to a lease']
  const xLabels = props.xLabels
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
        <Grid item xs>
          <StackedBarChart
            chartTitle={chartTitle}
            data={data.total_yearly_revenue}
            legendDataFormatFunc={utils.formatToDollarFloat}
            columns={columns}
            columnHeaders={columnHeaders}
            xRotate={xRotate}
            yLabels={yLabels}
            xLabels={xLabels}
            selected={4} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default TotalRevenue
