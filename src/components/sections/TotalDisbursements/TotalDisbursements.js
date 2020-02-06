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

const TOTAL_DISBURSEMENTS_QUERY = gql`
  query TotalYearlyDisbursements($period: String!) {
    total_yearly_disbursements(where: { fiscal_year: { _gt: 2009 },  period: { _eq: $period } }) { 
      federal_offshore
      federal_onshore
      native_american
      fiscal_year
    }
  }
`

const TotalDisbursements = props => {
  const classes = useStyles()
  const { state, dispatch } = useContext(StoreContext)
  const period = state.period

  const chartTitle = props.chartTitle || `${ CONSTANTS.DISBURSEMENTS } (dollars)`
  const columns = props.columns || ['fiscal_year', 'federal_onshore', 'federal_offshore', 'native_american']
  const columnNames = props.columnNames || ['Source', '', state.year]

  const yLabels = props.yLabels || ['Federal onshore', 'Federal offshore', 'Native American']
  const xLabels = props.xLabels || ["'10", "'11", "'12", "'13", "'14", "'15", "'16", "'17", "'18", "'19"]
  const xRotate = props.xRotate || 0
  const { loading, error, data } = useQuery(TOTAL_DISBURSEMENTS_QUERY, {
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
          Total Disbursements
        <Box component="span" className={classes.titleLink}>
          <ExploreDataLink
            to="/query-data?dataType=Disbursements"
            icon="filter"
            c>Filter disbursements data</ExploreDataLink>
        </Box>
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs>
          <StackedBarChart
            chartTitle={chartTitle}
            data={data.total_yearly_disbursements}
            legendDataFormatFunc={utils.formatToDollarFloat}
            columns={columns}
            columnNames={columnNames}
            xRotate={xRotate}
            yLabels={yLabels}
            xLabels={xLabels}
            selected={4} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default TotalDisbursements
