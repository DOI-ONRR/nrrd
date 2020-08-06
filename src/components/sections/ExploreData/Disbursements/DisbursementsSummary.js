import React, { useContext } from 'react'

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

const DisbursementsSummary = props => {
  const { state: filterState } = useContext(DataFilterContext)
  const classes = useStyles()
  const year = filterState[DFC.YEAR]
  const dataSet = 'FY ' + year
  const {
    distinctCommodities,
    highlightIndex,
    sparkMin,
    sparkMax,
    sparkData,
    topCommodities,
    total
  } = props

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
                data={sparkData}
                highlightIndex={highlightIndex}
              />
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
              {topCommodities &&
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
                                  key={'DsS' + dataSet }
                                  data={row.data}
                                  highlightIndex={row.data.findIndex(
                                    x => x[0] === parseInt(year)
                                  )}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Typography style={{ fontSize: '.8rem' }}>
                                  {utils.formatToSigFig_Dollar(
                                    Math.floor(
                                      // eslint-disable-next-line standard/computed-property-even-spacing
                                      topCommodities[i].data[
                                        row.data.findIndex(x => x[0] === parseInt(year))
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
  )
}

export default DisbursementsSummary
