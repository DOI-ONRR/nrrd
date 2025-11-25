import React from 'react';
import { Box, Typography, Grid, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import millify from 'millify'
import oilIconUrl from '../../../images/icons/icon-oil.svg';
import gasIconUrl from '../../../images/icons/icon-gas.svg';
import coalIconUrl from '../../../images/icons/icon-coal.svg';
import PercentDifference from '../../utils/PercentDifference';
import { getFiscalYear, getFiscalMonthShortName } from '../../utils/nrrdUtils'

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
  }
})

function formatBigNumber(value, precision = 1) {
  const str = millify(value, { precision });

  const map = {
    K: " thousand",
    M: " million",
    B: " billion",
    T: " trillion",
  };

  const unit = str.slice(-1);            // last character
  const numberPart = str.slice(0, -1);   // everything except last character

  return map[unit] ? numberPart + map[unit] : str;
}


export default function FYProductionSummary({ currentFYData, prevFYData, fyPeriodData }) {
  const classes = useStyles()

  const currentOil = currentFYData.find((i) => i.commodity === 'Oil');
  const currentGas = currentFYData.find((i) => i.commodity === 'Gas');
  const currentCoal = currentFYData.find((i) => i.commodity === 'Coal');

  const previousOil = prevFYData.find((i) => i.commodity === 'Oil');
  const previousGas = prevFYData.find((i) => i.commodity === 'Gas');
  const previousCoal = prevFYData.find((i) => i.commodity === 'Coal');

  let fyProgressText = `FY ${ fyPeriodData.fiscalYear }`
  if (fyPeriodData.fiscalMonth < 12) {
      const fyMonthRange = fyPeriodData.fiscalMonth === 1 ? 'Oct' : `Oct - ${ getFiscalMonthShortName(fyPeriodData.fiscalMonth) }`
      fyProgressText += ` so far (${ fyMonthRange })`
  }

  return (
    <Box mb={2} borderRadius={10} border={'1px solid #3C3D3E'}>
      <Box height={'1rem'} bgcolor={'#1A227E'} borderRadius={'10px 10px 0 0'}></Box>
      <Box pt={0.5} pb={2} pl={3} pr={3}>
        <Typography variant="h3" className={classes.h3}>
          <Link href='/downloads/production-by-month/'>Production</Link>
        </Typography>
        <Typography variant='inherit' className={classes.fyProgress} >
          { fyProgressText }
        </Typography>
        <Grid container spacing={1}>
          <Grid item>
            <img src={oilIconUrl} alt="Logo" width={30}/>
          </Grid>
          <Grid item>
            <Typography component="strong" variant='inherit'>
              Oil: { formatBigNumber(currentOil.volume) } { currentOil.unit_abbr }
            </Typography>
          </Grid>
          <Grid item style={{ marginLeft: "auto" }}>
            <Typography variant='inherit'>
              <PercentDifference 
                currentAmount={currentOil.volume} 
                previousAmount={previousOil.volume} /> from FY{ (getFiscalYear() - 1) % 100 }
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item>
            <img src={gasIconUrl} alt="Logo" width={30}/>
          </Grid>
          <Grid item>
            <Typography component="strong" variant='inherit'>
              Gas: { formatBigNumber(currentGas.volume) } { currentGas.unit_abbr }
            </Typography>
          </Grid>
          <Grid item style={{ marginLeft: "auto" }}>
            <Typography variant='inherit'>
              <PercentDifference 
                currentAmount={currentGas.volume} 
                previousAmount={previousGas.volume} /> from FY{ (getFiscalYear() - 1) % 100 }
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item>
            <img src={coalIconUrl} alt="Logo" width={30}/>
          </Grid>
          <Grid item>
            <Typography component="strong" variant='inherit'>
              Coal: { formatBigNumber(currentCoal.volume) } { currentCoal.unit_abbr }
            </Typography>
          </Grid>
          <Grid item style={{ marginLeft: "auto" }}>
            <Typography variant='inherit'>
              <PercentDifference 
                currentAmount={currentCoal.volume} 
                previousAmount={previousCoal.volume} /> from FY{ (getFiscalYear() - 1) % 100 }
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}