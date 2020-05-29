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
      display: 'grid',
      flexDirection: 'column',
      alignItems: 'top',
    },
  }
}))

const APOLLO_QUERY = gql`
  query RevenueCommodityQuery($year: Int!, $state: String!) {
    # Revenue commodity summary
    revenue_commodity_summary(
      where: { fiscal_year: { _eq: $year }, state_or_area: { _eq: $state } }
      order_by: { fiscal_year: asc, total: desc }
    ) {
      fiscal_year
      commodity
      state_or_area
      total
    }
  }
`

const RevenueDetailCommodities = props => {
  const classes = useStyles()
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]

  const stateAbbr = ((props.abbr.length > 2) &&
    (props.abbr !== 'Nationwide Federal' || props.abbr !== 'Native American')) ? props.abbr : props.state

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { year: year, state: stateAbbr }
  })

  const dataSet = `FY ${ year }`
  let chartData

  if (loading) return ''
  if (error) return `Error! ${ error.message }`

  if (data) {
    chartData = data
  }

  return (
    <>
      { chartData.revenue_commodity_summary.length > 0
        ? (
          <Box className={classes.root}>
            <Box component="h4" fontWeight="bold">Commodities</Box>
            <Box>
              <CircleChart key={'RDC'+dataSet}  data={chartData.revenue_commodity_summary}
                xAxis='commodity' yAxis='total'
                format={ d => {
                  return utils.formatToDollarInt(d)
                }
                }
                circleTooltip={
                  d => {
                    const r = []
                    r[0] = d.commodity
                    r[1] = utils.formatToDollarInt(d.total)
                    return r
                  }
                }
                yLabel={dataSet}
                maxCircles={6}
                minColor={theme.palette.purple[100]}
                maxColor={theme.palette.purple[600]} />
            {/*  <Box mt={3}>
                 <ExploreDataLink to="/query-data/?dataType=Revenue" icon="filter">
                      Query revenue by commodity
                </ExploreDataLink>
              </Box>
             */}
            </Box>
          </Box>
        )
        : (
          <Box className={classes.boxSection}>
            <Box component="h4" fontWeight="bold" mb={2}>Commodities</Box>
            <Box fontSize="subtitle2.fontSize">No commodities generated revenue on federal land in {props.cardTitle} in {dataSet}.</Box>
          </Box>
        )
      }
    </>
  )
}

export default RevenueDetailCommodities
