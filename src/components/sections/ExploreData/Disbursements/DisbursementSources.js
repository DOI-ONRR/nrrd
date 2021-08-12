import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { CircleChart } from '../../../data-viz/CircleChart'
import QueryLink from '../../../../components/QueryLink'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'
import { formatToDollarInt } from '../../../../js/utils'
import { useInView } from 'react-intersection-observer'
import { makeStyles } from '@material-ui/core/styles'
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

  const state = props.fipsCode
  const xAxis = 'source'
  const yAxis = 'total'
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true
  })

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: state, year: year, period: DFC.FISCAL_YEAR_LABEL },
    skip: inView === false
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
        <Box className={classes.root} ref={ref}>
          <Box component="h4" fontWeight="bold">Disbursements by source</Box>
          <Box>
            <CircleChart
              key={`DS__${ dataSet }`}
              data={chartData.DisbursementSourceSummary}
              xAxis={xAxis}
              yAxis={yAxis}
              legendHeaders={['Source', 'Total']}
              showLabels={false}
              showTooltips={true}
              legendFormat={d => formatToDollarInt(d)}
              chartTooltip={
                d => {
                  const r = []
                  r[0] = d.data[xAxis]
                  r[1] = formatToDollarInt(d.data[yAxis])
                  return r
                }
              } />
            <QueryLink
              groupBy={DFC.SOURCE}
              linkType="FilterTable"
              recipient="Historic Preservation Fund,Land and Water Conservation Fund,Other,Reclamation,State and local governments,U.S. Treasury"
              {...props}>
              Query disbursements by source
            </QueryLink>
          </Box>
        </Box>
      )
    }
    else if (chartData.DisbursementSourceSummary.length === 1) {
	  const source = chartData.DisbursementSourceSummary[0].source
      return (
        <Box className={classes.boxSection} ref={ref}> >
          <Box component="h4" fontWeight="bold">Disbursements by source</Box>
          <Box fontSize="subtitle2.fontSize">
          All of  disbursements were from {source.toLowerCase()} production.</Box>
        </Box>
      )
    }
  }

  return (
    <Box className={classes.root} ref={ref}>&nbsp;</Box>
  )
}

export default DisbursementSources
