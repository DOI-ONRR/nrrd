import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'

import CircleChart from '../../../data-viz/CircleChart/CircleChart'
import { ExploreDataLink } from '../../../layouts/IconLinks/ExploreDataLink'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  boxSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    '& .chart-container': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'top',
      '& .chart': {
        width: '100%',
        height: 250
      },
      '& .legend': {
        marginTop: theme.spacing(2),
        height: 'auto',
      },
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
  console.log('RevenueDetailCommodities: ', props)
  const classes = useStyles()
  const { state } = useContext(StoreContext)
  const year = state.year

  const stateAbbr = ((props.abbr.length > 2) &&
    (props.abbr !== 'Nationwide Federal' || props.abbr !== 'Native American')) ? props.abbr : props.state

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { year: year, state: stateAbbr }
  })

  const dataSet = `FY ${ year }`
  let chartData

  if (loading) return 'Loading...'
  if (error) return `Error! ${ error.message }`

  if (data) {
    console.log('data: ', data)
    chartData = data
  }

  return (
    <>
      { chartData.revenue_commodity_summary.length > 0
        ? (
          <Box className={classes.boxSection}>
                <Box component="h4" fontWeight="bold">Commodities</Box>
                <Box>
                  <CircleChart data={chartData.revenue_commodity_summary}
                    xAxis='commodity' yAxis='total'
                    format={ d => {
                      return utils.formatToDollarInt(d)
                    }
                    }
                    yLabel={dataSet}
                    maxCircles={6}
                    minColor='#DCD2DF' maxColor='#2B1C30' />
                  <Box mt={3}>
                    <ExploreDataLink to="/query-data/?dataType=Revenue" icon="filter">
                      Query revenue by commodity
                    </ExploreDataLink>
                  </Box>
                </Box>
              </Box>
        )
        : (
          <Box className={classes.boxSection}>
            <Box component="h4" fontWeight="bold">Commodities</Box>
            <Box fontSize="subtitle2.fontSize">No commodities generated revenue on federal land in {props.cardTitle} in {dataSet}.</Box>
          </Box>
        )
      }
    </>
  )
}

export default RevenueDetailCommodities
