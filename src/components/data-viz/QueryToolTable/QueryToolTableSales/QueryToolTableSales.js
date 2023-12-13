import React, { useContext, useEffect, useState } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import Backdrop from '@material-ui/core/Backdrop'
import LinearProgress from '@material-ui/core/LinearProgress'
import SalesTableBase from './SalesTableBase'
import { summarize } from './helpers/transformData'
import withQueryManager from '../../../withQueryManager'
import { QK_QUERY_TOOL, FEDERAL_SALES } from '../../../../constants'
import { DataFilterContext, QueryToolTableProvider } from '../../../../stores'

import {
  withStyles,
  makeStyles,
  Box,
  Grid
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    margin: 0,
  }
}))

const QueryToolTableSales = withQueryManager(({ data, loading }) => {
  const classes = useStyles()
  const { state: dataFilterCtx } = useContext(DataFilterContext)
  const [tableData, setTableData] = useState()
  const _tableHeight = 550

  useEffect(() => {
    if (data) {
      setTableData(summarize(data.results, dataFilterCtx.dataTypesCache[FEDERAL_SALES].breakoutBy))
    }
    else {
      setTableData()
    }
  }, [dataFilterCtx, data])

  useEffect(() => {
    if (loading) {
      setTableData()
    }
  }, [loading])

  const BorderLinearProgress = withStyles(theme => ({
    root: {
      height: 10,
      width: '-webkit-fill-available'
    },
    bar: {
      backgroundColor: theme.palette.blue[200],
    },
  }))(LinearProgress)

  return (
    <Box className={classes.root}>
      <Box zIndex="tooltip" position="absolute">
        <Backdrop open={loading} />
      </Box>

      <Grid container spacing={2}>
        {loading &&
          <Grid item xs={12}>
            <Box zIndex="snackbar" style={{ width: '-webkit-fill-available' }}>
              <BorderLinearProgress />
            </Box>
            <Box zIndex="modal">
              <Skeleton variant="rect" width={'100%'} height={_tableHeight} animation={false}/>
            </Box>
          </Grid>
        }
        {tableData &&
          <Grid item xs={12}>
            <QueryToolTableProvider>
              <SalesTableBase salesTableData={tableData} />
            </QueryToolTableProvider>
          </Grid>
        }
      </Grid>
    </Box>
  )
}, QK_QUERY_TOOL)

export default QueryToolTableSales
