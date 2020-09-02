import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import CircleChart from '../../../data-viz/CircleChart/CircleChart'
import QueryLink from '../../../../components/QueryLink'

import utils from '../../../../js/utils'
import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

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
  # summary card queries
  query DisbursementSourceSummary($year: Int!, $period: String!, $state: [String!]) {

DisbursementSourceSummary: disbursement_source_summary(
      where: { fiscal_year: { _eq: $year }, state_or_area: { _in: $state } }
      order_by: { fiscal_year: asc, total: desc }
    ) {
      fiscal_year
      source
      state_or_area
      total
    }
  }
`

const DisbursementSources = props => {
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const dataSet = 'FY ' + year
  const classes = useStyles()
  const theme = useTheme()

  const state = props.fipsCode

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: state, year: year, period: DFC.FISCAL_YEAR_LABEL }
  })

  if (loading) {
    return 'Loading ... '
  }
  if (error) return (<>Error! ${ error.message }</>)

  let chartData = []

  if (
    data &&
      data.DisbursementSourceSummary.length > 0) {
    chartData = data
    if (chartData.DisbursementSourceSummary.length > 1) {
      return (
        <Box className={classes.root}>
          <Box component="h4" fontWeight="bold">Disbursements by source</Box>
          <Box>
            <CircleChart
              key={'DS' + dataSet }
              data={chartData.DisbursementSourceSummary}
              xAxis='source'
              yAxis='total'
              format={ d => {
                return utils.formatToDollarInt(d)
              }
              }
              minColor={theme.palette.blue[100]}
              maxColor={theme.palette.blue[600]}
              circleTooltip={
                d => {
                  const r = []
                  r[0] = d.source
                  r[1] = utils.formatToDollarInt(d.total)
                  return r
                }
              } />
            <QueryLink groupBy={DFC.SOURCE} linkType="FilterTable" {...props}>
              Query disbursements by source
            </QueryLink>
          </Box>
        </Box>
      )
    }
    else if (chartData.DisbursementSourceSummary.length === 1) {
      return (
        <Box className={classes.boxSection}>
          <Box component="h4" fontWeight="bold">Disbursements by source</Box>
          <Box fontSize="subtitle2.fontSize">
            All of  disbursements were from onshore production</Box>
        </Box>
      )
    }
  }

  return (
    <Box className={classes.root}>&nbsp;</Box>
  )
}

export default DisbursementSources
