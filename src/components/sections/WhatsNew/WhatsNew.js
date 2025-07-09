import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import { FYProductionSummary } from '../FYProductionSummary';
import { FYRevenueSummary } from '../FYRevenueSummary';
import { FYDisbursementsSummary } from '../FYDisbursementsSummary'
import { Grid } from '@material-ui/core';

const useStyles = makeStyles({
  h2: {
    marginTop: '0.5rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  h3: {
    marginTop: '0.5rem',
    marginBottom: '1rem'
  },
  changes: {
    display: 'block',
    marginTop: '1rem'
  },
  changeList: {
    listStyleType: 'disc',
    paddingLeft: '1.5rem',
    '& .MuiListItem-root': {
      display: 'list-item',
      listStyleType: 'inherit',
    },
    '& .MuiListItem-gutters': {
      paddingLeft: '0.5rem',
    },
    '& .MuiListItemText-primary': {
      fontSize: '1rem',
    }
  }
})

export default function WhatsNew({data}) {
  const classes = useStyles();
  return (
    <Box mb={2} paddingX={2} borderRadius={10} border={'1px solid #3C3D3E'}>
      <Typography variant="h2" className={classes.h2}>
        What's new
      </Typography>
      <FYProductionSummary 
        currentFYData={ data.productionCurrFy }
        prevFYData={ data.productionPrevFy }
        fyPeriodData={data.datasetPeriodInfo.find((p) => p.dataset === 'production')}/>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FYRevenueSummary
            revenueData={data.fyRevenue}
            fyPeriodData={data.datasetPeriodInfo.find((p) => p.dataset === 'revenue')}/>
        </Grid>
        <Grid item xs={12} md={6}>
          <FYDisbursementsSummary
            disbursementsData={data.fyDisbursements}
            fyPeriodData={data.datasetPeriodInfo.find((p) => p.dataset === 'disbursements')}/>
        </Grid>
      </Grid>
    </Box>
  )
}