import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Box, Grid, Paper } from '@material-ui/core'
import { RevenueLastTwelveMonths } from '../data-viz/RevenueLastTwelveMonths'
import { SOURCE, COMMODITY } from '../../constants'

const useStyles = makeStyles({
  root: {
    margin: '1rem 0 2rem 0',
    position: 'relative',
    '@media print': {
      marginBottom: 0
    }
  },
  label: {
    position: 'absolute',
    top: '-15px',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingLeft: '0.25rem',
    paddingRight: '0.25rem',
    fontWeight: '600',
    fontSize: '1.25rem',
    '@media print': {
      display: 'none'
    }
  },
  printLabel: {
    display: 'none',
    '@media print': {
      display: 'inline',
      fontWeight: 'bold',
      marginRight: '0.25rem'
    }
  },
  outline: {
    padding: '1rem 1rem 1.5rem 1rem',
    '@media print': {
      padding: 0,
      border: 'none'
    }
  },
  revenueNumbers: {
    marginLeft: '0.25rem',
    fontStyle: 'italic',
  },
  introText: {
    fontSize: '1rem',
    marginBottom: '1rem',
    '@media print': {
      marginBottom: '.2rem',
      lineHeight: '1.2'
    }
  },
})

const RevenueFactSheet = () => {
  const classes = useStyles()
  return (
    <Box className={classes.root}>
      <Paper
        variant="outlined"
        className={classes.outline}>
        <Box
          className={classes.label}>
            Revenue
        </Box>
        <Box className={classes.introText}>
          <Box
            component='span'>
            <span className={classes.printLabel}>Revenue -</span>
            The amount of money collected from energy and minerals on property owned by the federal government and Native Americans.
          </Box>
          <Box
            component='span'
            className={classes.revenueNumbers}>
            Negative numbers often indicate adjustments because this is accounting data, not sales data.
          </Box>
        </Box>
        <Grid container>
          <Grid item xs={4}>
            <Box pr={'10px'}>
              <RevenueLastTwelveMonths
                title='Revenue by commodity'
                yGroupBy={COMMODITY}
                chartHeight={130}
                skeletonHeight={293}
                disableInteraction={true}
                svgTitle='Bar chart displaying the amount of revenue collected on a monthly basis by commodity, refer to the data table following the
                chart for detailed data for each bar. [Details available in the Source Data (.csv)](https://revenuedata.doi.gov/downloads/monthly_revenue.csv/).' />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box pr={'10px'} pl={'10px'}>
              <RevenueLastTwelveMonths
                title='Revenue by source'
                yGroupBy={SOURCE}
                chartHeight={130}
                skeletonHeight={293}
                disableInteraction={true}
                svgTitle='Bar chart displaying the amount of revenue collected on a monthly basis by source, refer to the data table following the
                chart for detailed data for each bar. [Details available in the Source Data (.csv)](https://revenuedata.doi.gov/downloads/monthly_revenue.csv/).' />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box pl={'10px'}>
              <RevenueLastTwelveMonths
                title='Revenue by revenue type'
                yGroupBy={'revenue_type'}
                chartHeight={130}
                skeletonHeight={293}
                disableInteraction={true}
                svgTitle='Bar chart displaying the amount of revenue collected on a monthly basis by revenue type, refer to the data table following the
                chart for detailed data for each bar. [Details available in the Source Data (.csv)](https://revenuedata.doi.gov/downloads/monthly_revenue.csv/).' />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default RevenueFactSheet
