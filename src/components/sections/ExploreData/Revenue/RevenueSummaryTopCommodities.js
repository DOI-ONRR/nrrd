import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { makeStyles } from '@material-ui/core/styles'
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core'

import { StoreContext } from '../../../../store'
import CONSTANTS from '../../../../js/constants'
import utils from '../../../../js/utils'

import Sparkline from '../../../data-viz/Sparkline'

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
  query TopCommodities($state: String!, $year: Int!, $period: String!) {
    fiscal_revenue_summary(
      where: { state_or_area: { _eq: $state } }
      order_by: { fiscal_year: asc, state_or_area: asc }
    ) {
      fiscal_year
      state_or_area
      sum
      distinct_commodities
    }
    revenue_commodity_summary(
      limit: 3
      where: { fiscal_year: { _eq: $year }, state_or_area: { _eq: $state } }
      order_by: { fiscal_year: asc, total: desc }
    ) {
      fiscal_year
      commodity
      state_or_area
      total
    }
    commodity_sparkdata: revenue_commodity_summary(
      where: { state_or_area: { _eq: $state } }
      order_by: { fiscal_year: asc }
    ) {
      fiscal_year
      commodity
      total
    }

    period(where: {period: {_ilike: $period }}) {
      fiscal_year
    }
  }
`

const RevenueSummaryTopCommodities = props => {
  const classes = useStyles()
  const { state } = useContext(StoreContext)
  const year = state.year

  const { loading, error, data } = useQuery(APOLLO_QUERY, {
    variables: { state: props.abbr, year: year, period: CONSTANTS.FISCAL_YEAR }
  })

  let sparkData = []
  let fiscalData
  let highlightIndex = 0
  let periodData
  let distinctCommodities = 0
  let topCommodities = []

  if (loading) {}

  if (error) return `Error! ${ error.message }`

  if (
    data &&
    data.fiscal_revenue_summary.length > 0 &&
    data.revenue_commodity_summary.length > 0 &&
    data.commodity_sparkdata.length > 0
  ) {
    periodData = data.period

    fiscalData = data.fiscal_revenue_summary.map((item, i) => [
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

    distinctCommodities = data.fiscal_revenue_summary[data.fiscal_revenue_summary.findIndex(x => x.fiscal_year === year)].distinct_commodities

    topCommodities = data.revenue_commodity_summary
      .map((item, i) => item.commodity)
      .map((com, i) => {
        const r = data.commodity_sparkdata.filter(item => item.commodity === com)
        const s = r.map((row, i) => [row.fiscal_year, row.total])
        const d = periodData.map((row, i) => {
          const t = s.find(x => x[0] === row.fiscal_year)
          return (
            [row.fiscal_year, t ? t[1] : 0]
          )
        })
        return { commodity: com, data: d }
      })
  }

  return (
    <>
      {topCommodities.length > 0 &&
        <>
          <Grid container>
            <Grid item xs={12} zeroMinWidth>
              <Typography
                variant="subtitle2"
                style={{ fontWeight: 'bold', marginBottom: 10 }}
              >
            Top Commodities
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Paper className={classes.paper} style={{ marginBottom: 10 }}>
              <Table
                className={classes.table}
                size="small"
                aria-label="top commodities table"
              >
                <TableBody>
                  {
                    topCommodities.map((row, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell component="th" scope="row">
                            <Typography style={{ fontSize: '.8rem' }}>
                              {row.commodity}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Sparkline
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
                                  topCommodities[i].data[
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
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="subtitle2" component="span">
            Total Commodities: {distinctCommodities}
              </Typography>
            </Grid>
          </Grid>
        </>
      }
    </>
  )
}

export default RevenueSummaryTopCommodities
