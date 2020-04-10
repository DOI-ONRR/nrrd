import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'


import Sparkline from '../../../data-viz/Sparkline'

import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'

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
import { makeStyles } from '@material-ui/styles'

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
  query FiscalDisbursement($year: Int!, $period: String!, $state: [String!]) {
     fiscalDisbursementSummary: fiscal_disbursement_summary(
      where: { state_or_area: { _in: $state } }
      order_by: { fiscal_year: asc, state_or_area: asc }
    ) {
      fiscal_year
      state_or_area
      sum
      distinct_commodities
    }

    # period query
    period(where: {period: {_ilike: $period }}) {
      fiscal_year
    }
  }
`

const DisbursementTrend = props => {

  const { state } = useContext(StoreContext)
  const classes = useStyles()
  const year = state.year
  
const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: props.abbr, year: year, period: CONSTANTS.FISCAL_YEAR }
  })

  if (loading) { return 'Loading ... ' }
  if (error) return `Error! ${ error.message }`

  let sparkData = []
  let sparkMin
  let sparkMax
  let periodData
  let fiscalData
  let highlightIndex = 0
  if (
    data &&
    data.fiscalDisbursementSummary.length > 0 ) {
    periodData = data.period

    // set min and max trend years
    sparkMin = periodData.reduce((min, p) => p.fiscal_year < min ? p.fiscal_year : min, periodData[0].fiscal_year)
    sparkMax = periodData.reduce((max, p) => p.fiscal_year > max ? p.fiscal_year : max, periodData[periodData.length - 1].fiscal_year)

    fiscalData = data.fiscalDisbursementSummary.map((item, i) => [
      item.fiscal_year,
      item.sum
    ])

    // map sparkline data to period fiscal years, if there is no year we set the year and set the sum to 0
    sparkData = periodData.map((item, i) => {
      const sum = fiscalData.find(x => x[0] === item.fiscal_year)
      return ([
        item.fiscal_year,
        sum ? sum[1] : 0
      ])
    })

    // sparkline index
    highlightIndex = sparkData.findIndex(
      x => x[0] === year
    )

  
  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="caption">
            <Box>Trend</Box>
            <Box>({sparkMin} - {sparkMax})</Box>
          </Typography>
          <Box component="span">
            {
              sparkData && (
                <Sparkline
                  data={sparkData}
                  highlightIndex={highlightIndex}
                  />
              )}
           </Box>
      </Grid>
      </Grid>
      </>
  )
  }
}

export default DisbursementTrend
