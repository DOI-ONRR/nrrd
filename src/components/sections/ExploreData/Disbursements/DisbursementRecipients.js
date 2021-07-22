import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { CircleChart } from '../../../data-viz/CircleChart'
import QueryLink from '../../../../components/QueryLink'
import { useInView } from 'react-intersection-observer'
import CircularProgress from '@material-ui/core/CircularProgress'

import { formatToDollarInt } from '../../../../js/utils'

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
  query DisbursementRecipientSummary($year: Int!, $period: String!, $state: [String!]) {

    DisbursementRecipientSummary: disbursement_recipient_summary(
      where: { 
        fiscal_year: { _eq: $year }, 
        state_or_area: { _in: $state },
        recipient: {_neq: "Native American tribes and individuals"}
      }
      order_by: { fiscal_year: asc, total: desc }
    ) {
      fiscal_year
      recipient
      state_or_area
      total
    }
  }
`

const DisbursementRecipients = props => {
  const { state: filterState } = useContext(DataFilterContext)
  const classes = useStyles()
  const theme = useTheme()

  const year = filterState[DFC.YEAR]
  const dataSet = 'FY ' + year

  const state = props.fipsCode
  const xAxis = 'recipient'
  const yAxis = 'total'
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true
  })

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: state, year: year, period: DFC.FISCAL_YEAR_LABEL },
    skip: inView === false
  })

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" ref={ref} height={300}>
        <CircularProgress />
      </Box>
    )
  }
  if (error) return `Error! ${ error.message }`

  let chartData = []

  if (
    data &&
    data.DisbursementRecipientSummary.length > 0) {
    chartData = data

    if (chartData.DisbursementRecipientSummary.length > 1) {
      return (<Box className={classes.root} ref={ref} >
        <Box component="h4" fontWeight="bold">Disbursements by recipient</Box>
        <Box>
          <CircleChart
            key={`DR__${ dataSet }`}
            data={chartData.DisbursementRecipientSummary}
            xAxis={xAxis}
            yAxis={yAxis}
            legendHeaders={['Recipient', 'Total']}
            showLabels={false}
            legendFormat={d => formatToDollarInt(d)}
            chartTooltip={
              d => {
                const r = []
                r[0] = d.data[xAxis]
                r[1] = formatToDollarInt(d.data[yAxis])
                return r
              }
            }
            legendLabel={d => {
              if (d.match('Native')) {
                d = 'Native American'
              }
              else if (d.match('governments')) {
                d = 'State and local'
              }
              else if (d.match('Land')) {
                d = 'LWCF'
              }
              else if (d.match('Historic')) {
                d = 'HPF'
              }
              return d
            }}
          />
          <QueryLink
            groupBy={DFC.RECIPIENT}
            linkType="FilterTable" {...props}
            recipient="Historic Preservation Fund,Land and Water Conservation Fund,Other,Reclamation,State and local governments,U.S. Treasury">
            Query disbursements by recipient
          </QueryLink>
        </Box>
      </Box>
      )
    }
    else if (chartData.DisbursementRecipientSummary.length === 1) {
      return (
        <Box className={classes.boxSection} ref={ref} >
          <Box component="h4" fontWeight="bold">Disbursements by recipients</Box>
          <Box fontSize="subtitle2.fontSize">
          All of  disbursements went to the state</Box>
        </Box>
      )
    }
  }

  return (
    <Box className={classes.root} ref={ref} ></Box>
  )
}

export default DisbursementRecipients
