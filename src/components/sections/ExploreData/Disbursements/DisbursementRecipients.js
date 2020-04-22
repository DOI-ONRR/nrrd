import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'


import CircleChart from '../../../data-viz/CircleChart/CircleChart'
import { ExploreDataLink } from '../../../layouts/IconLinks/ExploreDataLink'

import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'
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
  table: {
    width: '100%',
    marginBottom: 0,
    '& th': {
      padding: 5,
      lineHeight: 1
    },
    '& td': {
      padding: 0,
    },
  },
  paper: {
    width: '100%'
  },
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

  const { state } = useContext(StoreContext)
  const classes = useStyles()
  const theme = useTheme()
  const year = state.year
  // console.debug("DT                ", state)
const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: props.abbr, year: year, period: CONSTANTS.FISCAL_YEAR }
  })

  if (loading) { return 'Loading ... ' }
  if (error) return `Error! ${ error.message }`


  let chartData=[]

  let total = 0
  if (
    data &&
    data.DisbursementRecipientSummary.length > 0 ) {
    chartData = data

    if (chartData.DisbursementRecipientSummary.length > 1) {
      return (<Box className={classes.root}>
              <Box component="h4" fontWeight="bold">Recipients</Box>
              <Box>
              <CircleChart
              data={chartData.DisbursementRecipientSummary}
              xAxis='recipient'
              yAxis='total'
              minColor={theme.palette.orange[100]}
              maxColor={theme.palette.orange[600]} />
              
              <Box mt={3}>
              <ExploreDataLink to="/query-data/?dataType=Disbursements" icon="filter">
              Query Disbursements by Recipients
              </ExploreDataLink>
              </Box>
              </Box>
              </Box>
             )
     }
    else if ( chartData.DisbursementSourceSummary.length === 1) {
      return (
          <Box className={classes.boxSection}>
          <Box component="h4" fontWeight="bold">Disbursements by Recipient</Box>
          <Box fontSize="subtitle2.fontSize">
          All of  disbursements went to the state</Box>
          </Box>
      )
    }
  }
  
  return (<Box className={classes.boxSection}>
          <Box component="h4" fontWeight="bold">No Disbursements</Box>
          </Box>
         )

  
}

export default DisbursementRecipients
