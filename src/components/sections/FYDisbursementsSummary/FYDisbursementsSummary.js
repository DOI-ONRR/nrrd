import React from 'react';
import { Box, Typography, Grid, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import millify from 'millify'
import PercentDifference from '../../utils/PercentDifference';
import { getFiscalMonthShortName } from '../../utils/nrrdUtils'

const useStyles = makeStyles({
  h3: {
    marginTop: '0.5rem',
    marginBottom: '0rem',
    textAlign: 'center'
  },
  fyProgress: {
    textAlign: 'center',
    marginBottom: '1rem',
    display: 'block'
  },
  center: {
    textAlign: 'center',
    display: 'block'
  }
})


export default function FYDisbursementsSummary({ disbursementsData, fyPeriodData }) {
  const classes = useStyles()

  let fyProgressText = `FY ${ fyPeriodData.fiscalYear }`
  if (fyPeriodData.fiscalMonth < 12) {
    const fyMonthRange = fyPeriodData.fiscalMonth === 1 ? 'Oct' : `Oct - ${ getFiscalMonthShortName(fyPeriodData.fiscalMonth) }`
    fyProgressText += ` so far (${ fyMonthRange })`
  }

  const currRevenue = disbursementsData.find((r) => r.fy === 'current').disbursement;
  const prevRevenue = disbursementsData.find((r) => r.fy === 'previous').disbursement;

  return (
    <Box mb={2} borderRadius={10} border={'1px solid #3C3D3E'}>
      <Box height={'1rem'} bgcolor={'#1A227E'} borderRadius={'10px 10px 0 0'}></Box>
      <Box pt={0.5} pb={2} pl={3} pr={3}>
        <Typography variant="h3" className={classes.h3}>
          <Link href='/downloads/disbursements-by-month/'>Disbursements</Link>
        </Typography>
        <Typography variant='inherit' className={classes.fyProgress} >
          { fyProgressText }
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography component="strong" variant='inherit' className={classes.center}>
              ${ millify(currRevenue, { precision: 1 }).replace('B', ' billion')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='inherit' className={classes.center}>
              <PercentDifference 
                currentAmount={currRevenue} 
                previousAmount={prevRevenue} /> from FY{ (fyPeriodData.fiscalYear - 1) % 100 }
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}