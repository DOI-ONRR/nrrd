import React from 'react'

import { makeStyles } from '@material-ui/styles'

import { Box, Grid, Paper } from '@material-ui/core'
import { ProductionLastTwelveMonths } from '../data-viz/ProductionLastTwelveMonths'
import { SOURCE } from '../../constants'

const useStyles = makeStyles({
  root: {
    margin: '1rem 0 2rem 0',
    position: 'relative',
  },
  label: {
    position: 'absolute',
    top: '-15px',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem',
    fontWeight: '600',
    fontSize: '1.25rem',
  },
  outline: {
    padding: '1rem 1rem 1.5rem 1rem',
  },
  productionNumbers: {
    marginLeft: '0.25rem',
    fontStyle: 'italic',
  },
  introText: {
    fontSize: '1rem',
    marginBottom: '1rem',
  },
})

const ProductionFactSheet = () => {
  const classes = useStyles()
  return (
    <Box className={classes.root}>
      <Paper
        variant="outlined"
        className={classes.outline}>
        <Box
          className={classes.label}>
            Production
        </Box>
        <Box className={classes.introText}>
          <Box
            component='span'>
            The volume of natural resources produced on property owned by the federal government and Native Americans.
          </Box>
          <Box
            component='span'
            className={classes.productionNumbers}>
            Production numbers are behind revenue and disbursements to give time for adjustments.
          </Box>
        </Box>
        <Grid container>
          <Grid item xs={4}>
            <Box pr={'10px'}>
              <ProductionLastTwelveMonths
                title='Oil volume by source'
                filterByProduct='Oil (bbl)'
                units='bbl'
                yGroupBy={SOURCE}
                chartHeight={120}
                skeletonHeight={283}
                disableInteraction={true}
                svgTitle='Bar chart displaying the amount of oil produced on a monthly basis, refer to the data table following the chart for detailed data for each bar.
                [Details available in the Source Data (.csv)]( https://revenuedata.doi.gov/downloads/monthly_production.csv/).' />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box pl={'10px'} pr={'10px'}>
              <ProductionLastTwelveMonths
                title='Gas volume by source'
                filterByProduct='Gas (mcf)'
                units='mcf'
                yGroupBy={SOURCE}
                chartHeight={120}
                skeletonHeight={283}
                disableInteraction={true}
                svgTitle='Bar chart displaying the amount of gas produced on a monthly basis, refer to the data table following the chart for detailed data for each bar.
                [Details available in the Source Data (.csv)]( https://revenuedata.doi.gov/downloads/monthly_production.csv/).' />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box pl={'10px'}>
              <ProductionLastTwelveMonths
                title='Coal volume by source'
                filterByProduct='Coal (tons)'
                units='tons' yGroupBy={SOURCE}
                chartHeight={120}
                skeletonHeight={283}
                disableInteraction={true}
                svgTitle='Bar chart displaying the amount of coal produced on a monthly basis, refer to the data table following the chart for detailed data for each bar.
                [Details available in the Source Data (.csv)]( https://revenuedata.doi.gov/downloads/monthly_production.csv/.)' />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default ProductionFactSheet
