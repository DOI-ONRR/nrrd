import React, { useContext } from 'react'
import { useQuery, gql } from '@apollo/client'
import * as d3 from 'd3'

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

import utils from '../../../../js/utils'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

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

const QUERY = gql`
  query TopCommodities($state: String!, $period: String!) {
    revenue_summary(
      where: { location: { _eq: $state }, period: {_eq: $period} },
      order_by: { year: asc, location: asc }
    ) {
      year
      location
      total      
      commodity
    }
    period(where: {period: {_ilike: $period }},  order_by: { period_date: asc}) {
      fiscal_year
      period_date
    }
  }
`

const RevenueSummaryTopCommodities = props => {
  const classes = useStyles()
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR

  const state = props.fipsCode

  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      state,
      period
    },
  })

  let periodData
  let distinctCommodities = 0
  let topCommodities = []
  let currentCommodities = []
  const dataKey = period + '-' + year + '-' + state
  if (loading) return

  if (error) return `Error! ${ error.message }`

  if (data && data.revenue_summary.length > 0) {
    // console.debug('DWGH', data)
    periodData = data.period

    topCommodities = data.revenue_summary.filter(row => row.year === parseInt(year))
      .map(f => f.commodity)
      .map((com, i) => {
        const s = d3.nest()
          .key(k => k.year)
          .rollup(v => d3.sum(v, i => i.total))
          .entries(data.revenue_summary.filter(item => item.commodity === com))
          .map(d => [parseInt(d.key), d.value])
        const d = periodData.map((row, i) => {
          const y = parseInt(row.period_date.substr(0, 4))
          const t = s.find(x => x[0] === y)
          return (
            [y, t ? t[1] : 0]
          )
        })
        return { commodity: com, data: d }
      })

    currentCommodities = d3.nest()
      .key(k => k.commodity)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(data.revenue_summary.filter(item => item.year === parseInt(year)))
      .map(d => [d.key, d.value])
      .sort((a, b) => a[1] > b[1] ? -1 : 1)

    distinctCommodities = currentCommodities.length
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
                    currentCommodities.slice(0, 3).map((com, j) =>
                      topCommodities.filter(f => f.commodity === com[0]).map((row, i) => {
                        return (
                          <TableRow key={j}>
                            <TableCell component="th" scope="row">
                              <Typography style={{ fontSize: '.8rem' }}>
                                {row.commodity}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Sparkline
                                key={dataKey}
                                data={row.data}
                                highlightIndex={row.data.findIndex(
                                  x => x[0] === parseInt(year)
                                )}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography style={{ fontSize: '.8rem' }}>
                                {
                                  utils.formatToSigFig_DollarCompact(
                                    Math.floor(
                                      // eslint-disable-next-line standard/computed-property-even-spacing
                                      row.data[
                                        row.data.findIndex(x => x[0] === parseInt(year))
                                      ][1]
                                    )
                                  )}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )
                  }
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
