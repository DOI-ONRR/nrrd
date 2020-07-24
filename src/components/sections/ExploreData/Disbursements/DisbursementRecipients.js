import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import CircleChart from '../../../data-viz/CircleChart/CircleChart'
import { ExploreDataLink } from '../../../layouts/IconLinks/ExploreDataLink'

import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core'

import CONSTANTS from '../../../../js/constants'

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
  query DisbursementRecipientSummary($year: Int!, $period: String!, $state: [String!]) {

DisbursementRecipientSummary: disbursement_recipient_summary(
      where: { fiscal_year: { _eq: $year }, state_or_area: { _in: $state } }
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

  const year = filterState[DFC.YEAR]
  const dataSet = 'FY ' + year

  const state = props.fipsCode

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: state, year: year, period: CONSTANTS.FISCAL_YEAR }
  })

  if (loading) {
    return 'Loading ... '
  }
  if (error) return `Error! ${ error.message }`

  let chartData = []

  const total = 0
  if (
    data &&
    data.DisbursementRecipientSummary.length > 0) {
    chartData = data

    if (chartData.DisbursementRecipientSummary.length > 1) {
      return (<Box className={classes.root}>
        <Box component="h4" fontWeight="bold">Disbursements by recipient</Box>
        <Box>
          <CircleChart
            key={'DR' + dataSet }
            data={chartData.DisbursementRecipientSummary}
            xAxis='recipient'
            yAxis='total'
            minColor='#FCBA8B'
            maxColor='#B64D00'
            format={ d => {
              return utils.formatToDollarInt(d)
            }}
            circleTooltip={
              d => {
                // console.log('d: ', d)
                const r = []
                r[0] = d.recipient
                r[1] = utils.formatToDollarInt(d.total)
                return r
              }
            } />

          <Box mt={3}>
            {/*            <ExploreDataLink to="/query-data/?dataType=Disbursements" icon="filter">
              Query Disbursements by Recipients
            </ExploreDataLink>
               */}
          </Box>
        </Box>
      </Box>
      )
    }
    else if (chartData.DisbursementRecipientSummary.length === 1) {
      return (
        <Box className={classes.boxSection}>
          <Box component="h4" fontWeight="bold">Disbursements by recipients</Box>
          <Box fontSize="subtitle2.fontSize">
          All of  disbursements went to the state</Box>
        </Box>
      )
    }
  }

  return (
    <Box className={classes.root}></Box>
  )
}

export default DisbursementRecipients
