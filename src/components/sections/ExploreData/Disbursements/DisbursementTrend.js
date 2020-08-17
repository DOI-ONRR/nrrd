import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Sparkline from '../../../data-viz/Sparkline'

import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'
import * as d3 from 'd3'

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
     fiscalDisbursementSummary: disbursement_summary(
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
  const { state: filterState } = useContext(DataFilterContext)
  const classes = useStyles()
  const year = filterState[DFC.YEAR]
  const dataSet = 'FY ' + year
  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: props.fipsCode, year: year, period: CONSTANTS.FISCAL_YEAR }
  })

  if (loading) {
    return 'Loading ... '
  }
  if (error) return `Error! ${ error.message }`

  let sparkData = []
  let sparkMin
  let sparkMax
  let periodData
  let fiscalData
  let highlightIndex = 0
  let foundIndex
  let total = 0
  if (
    data &&
    data.fiscalDisbursementSummary.length > 0) {
    periodData = data.period

    // set min and max trend years
    sparkMin = periodData.reduce((min, p) => p.fiscal_year < min ? p.fiscal_year : min, periodData[0].fiscal_year)
    sparkMax = periodData.reduce((max, p) => p.fiscal_year > max ? p.fiscal_year : max, periodData[periodData.length - 1].fiscal_year)

    /*  fiscalData = data.fiscalDisbursementSummary.map((item, i) => [
      item.fiscal_year,
      item.sum
      ])
*/
    fiscalData = d3.nest()
      .key(k => k.fiscal_year)
      .rollup(v => d3.sum(v, i => i.sum))
      .entries(data.fiscalDisbursementSummary).map(item => [parseInt(item.key), item.value])

    // console.debug('FDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD', data)

    // map sparkline data to period fiscal years, if there is no year we set the year and set the sum to 0
    sparkData = periodData.map((item, i) => {
      const sum = fiscalData.find(x => {
        // console.debug('x[0] ', x[0], 'item.fiscal_year', item.fiscal_year)
        return x[0] === item.fiscal_year
      })
      return ([
        item.fiscal_year,
        sum ? sum[1] : 0
      ])
    })
    // console.debug('WTH', sparkData)
    // sparkline index
    highlightIndex = sparkData.findIndex(
      x => x[0] === parseInt(year)
    )

    foundIndex = fiscalData.findIndex(x => x[0] === parseInt(year))
    total = (foundIndex === -1 || typeof (foundIndex) === 'undefined') ? 0 : fiscalData[foundIndex][1]

    return (
      <>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="caption">
              <Box>Trend</Box>
              <Box>({sparkMin} - {sparkMax})</Box>
            </Typography>
            <Box component="span">
              {sparkData && (
                <Sparkline
                  key={'DT' + dataSet }
                  data={sparkData}
                  highlightIndex={highlightIndex}/>
              )}
            </Box>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Typography variant="caption">
              <Box>{year}</Box>
              <Box>
                {utils.formatToSigFig_Dollar(Math.floor(total), 3)}
              </Box>
            </Typography>
          </Grid>
        </Grid>
      </>
    )
  }

  return (<></>)
}

export default DisbursementTrend
