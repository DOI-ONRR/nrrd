import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import CircleChart from '../../../data-viz/CircleChart/CircleChart'
import { ExploreDataLink } from '../../../layouts/IconLinks/ExploreDataLink'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Box
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    '& .chart-container': {
      // display: 'grid',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'top',
    }
  }
}))

const APOLLO_QUERY = gql`
  query RevenueTypes($state: String!, $year: Int!, $period: String!) {
    revenue_type_summary(
      where: { year: { _eq: $year }, location: { _eq: $state }, period: { _eq: $period} },
      order_by: { year: asc, total: desc }
    ) {
      year
      revenue_type
      location
      total
    }
  }
`

const RevenueDetailTypes = props => {
  const classes = useStyles()
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR
  const dataSet = (period === DFC.PERIOD_FISCAL_YEAR) ? `FY ${ year }` : `CY ${ year }`

  const state = (props.fipsCode === DFC.NATIONWIDE_FEDERAL_ABBR || props.fipsCode === DFC.NATIVE_AMERICAN_ABBR) ? props.name : props.fipsCode

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: state, year: year, period: period }
  })
  const dataKey = dataSet + '-' + props.name
  let chartData

  if (loading) return ''

  if (error) return `Error! ${ error.message }`

  if (data) {
    chartData = data
  }

  return (
    <>
      { chartData && chartData.revenue_type_summary.length > 0
        ? (
          <Box className={classes.root}>
            <Box component="h4" fontWeight="bold">Revenue types</Box>
            <Box>
              <CircleChart
                key={'RDTY' + dataKey }
                data={chartData.revenue_type_summary} xAxis='revenue_type' yAxis='total'
                format={ d => utils.formatToDollarInt(d) }
                yLabel={dataSet}
                maxCircles={4}
                minColor='#FCBA8B'
                maxColor='#B64D00'
                circleTooltip={
                  d => {
                    // console.debug('circleLABLE yo: ', d)
                    const r = []
                    r[0] = d.revenue_type
                    r[1] = utils.formatToDollarInt(d.total)
                    return r
                  }
                } />
              {/*  <Box mt={3}>
                 <ExploreDataLink to="/query-data/?dataType=Revenue" icon="filter">
                Query revenue by type
                </ExploreDataLink>
                </Box>
             */}
            </Box>
          </Box>
        )
        : (
          <Box className={classes.boxSection}>
            <Box component="h4" fontWeight="bold" mb={2}>Revenue types</Box>
            <Box fontSize="subtitle2.fontSize">There was no revenue on federal land in {props.cardTitle} in {dataSet}.</Box>
          </Box>
        )
      }
    </>
  )
}

export default RevenueDetailTypes
