import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Sparkline from '../../../data-viz/Sparkline'

import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

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
  query FiscalRevenue($year: Int!, $period: String!, $state: [String!]) {
    cardFiscalDisbursementSummary: disbursement_summary(
      where: { state_or_area: { _in: $state } }
      order_by: { fiscal_year: asc, state_or_area: asc }
    ) {
      fiscal_year
      state_or_area
      sum
    }

    cardDisbursementRecipientSummary: disbursement_recipient_summary(
      limit: 3
      where: { fiscal_year: { _eq: $year }, state_or_area: { _in: $state } }
      order_by: { fiscal_year: asc, total: desc }
    ) {
      fiscal_year
      recipient
      state_or_area
      total
    }

    cardDisbursementSparkdata: disbursement_recipient_summary(
      where: { state_or_area: { _in: $state } }
      order_by: { fiscal_year: asc }
    ) {
      fiscal_year
      recipient 
      total
      state_or_area
    }

    # period query
    period(where: {period: {_ilike: $period }}) {
      fiscal_year
    }
  }
`

const DisbursementRecipientSummary = props => {
  const { state: filterState } = useContext(DataFilterContext)
  const classes = useStyles()
  const year = parseInt(filterState[DFC.YEAR])
  const dataSet = 'FY ' + year

  const state = props.fipsCode

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: state, year: year, period: CONSTANTS.FISCAL_YEAR }
  })

  if (loading) {
    return 'Loading ... '
  }
  if (error) return `Error! ${ error.message }`

  let periodData

  let distinctRecipients = 0
  let topRecipients = []
  let row
  let total = 0
  // console.log('DisbursementRecipientSummary data: ', data)
  if (
    data &&
    data.cardFiscalDisbursementSummary.length > 0 &&
    data.cardDisbursementRecipientSummary.length > 0 &&
    data.cardDisbursementSparkdata.length > 0
  ) {
    periodData = data.period

    row = data.cardFiscalDisbursementSummary[data.cardFiscalDisbursementSummary.findIndex(x => x.fiscal_year === year)]
    total = row ? row.sum : 0
    distinctRecipients = data.cardFiscalDisbursementSummary[data.cardFiscalDisbursementSummary.findIndex(x => x.fiscal_year === year)].distinct_commodities

    topRecipients = data.cardDisbursementRecipientSummary
      .map((item, i) => item.recipient)
      .map((com, i) => {
        const r = data.cardDisbursementSparkdata.filter(item => item.recipient === com)
        const s = r.map((row, i) => [row.fiscal_year, row.total])
        const d = periodData.map((row, i) => {
          const t = s.find(x => x[0] === row.fiscal_year)
          return (
            [row.fiscal_year, t ? t[1] : 0]
          )
        })
        return { recipient: com, data: d }
      })

    return (
      <>
        <Grid container>
          <Grid item xs={12} zeroMinWidth>
            <Typography
              variant="subtitle2"
              style={{ fontWeight: 'bold', marginBottom: 10 }}>
              Top Recipients
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Paper className={classes.paper} style={{ marginBottom: 10 }}>
            <Table
              className={classes.table}
              size="small"
              aria-label="top Recipients table"
            >
              <TableBody>
                {topRecipients &&
                  topRecipients.map((row, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell component="th" scope="row">
                          <Typography style={{ fontSize: '.8rem' }}>
                            {row.recipient}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Sparkline
                            key={'DRS' + dataSet }
                            data={row.data}
                            highlightIndex={row.data.findIndex(
                              x => x[0] === year
                            )}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography style={{ fontSize: '.8rem' }}>
                            {utils.formatToSigFig_Dollar(
                              Math.floor(
                                // eslint-disable-next-line standard/computed-property-even-spacing
                                topRecipients[i].data[
                                  row.data.findIndex(x => x[0] === year)
                                ][1]
                              ),
                              3
                            )}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </>
    )
  }

  return (
    <Box className={classes.boxSection}>
      {data.cardFiscalDisbursementSummary.length === 0 &&
      data.cardDisbursementRecipientSummary.length === 0 &&
      data.cardDisbursementSparkdata.length === 0 &&
        <Box component="h4" fontWeight="bold">No Disbursements</Box>
      }
    </Box>
  )
}

export default DisbursementRecipientSummary
