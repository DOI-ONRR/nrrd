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

import { StoreContext } from '../../../store'
import { ThemeConsumer } from 'styled-components'
import utils from '../../../js/utils'

const TOTAL_PRODUCTION_QUERY = gql`
  query TotalYearlyProduction($period: String!) {
    total_yearly_production(where: { fiscal_year: { _gt: 2009 },  period: { _eq: $period } }) { 
      federal_offshore
      federal_onshore
      native_american
      fiscal_year
    }
  }
`

const TotalProduction = props => {
  const { state, dispatch } = useContext(StoreContext)
  const period = state.period
  const columns = props.columns || ['fiscal_year', 'federal_onshore', 'federal_offshore', 'native_american']
  const columnHeaders = props.columnHeaders || ['Source', 'Year']

  const yLabels = props.yLabels || ['Federal onshore', 'Federal offshore', 'Native American']
  const xLabels = props.xLabels
  const xRotate = props.xRotate || 0
  const { loading, error, data } = useQuery(TOTAL_PRODUCTION_QUERY, {
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
      <Typography variant="h3" className="header-bar green">
          Total Production
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs>
          <StackedBarChart
            data={data.total_yearly_production}
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

export default TotalProduction
