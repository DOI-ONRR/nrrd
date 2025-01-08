import React from 'react'

import { makeStyles } from '@material-ui/styles'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/react-hooks'
import { Box, Paper } from '@material-ui/core'
import DisbursementsPieChart from './DisbursementsPieChart'

const GET_FY_DISBURSEMENTS_BY_RECIPIENT = gql`
  query GetFyDisbursementsByRecipient {
    disbursements: fiscal_year_disbursements_by_recipient_v {
      totalDisbursements: total
      recipient: grouped_recipients
    }
    max_fy: max_fy_period_v {
      fy: fiscal_year
      cy: calendar_year
      month: month_long
    }
  }
`

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
  disbursementsDiffer: {
    marginLeft: '0.25rem',
    fontStyle: 'italic',
  },
  introText: {
    fontSize: '1rem',
    marginBottom: '1rem',
    '@media print': {
      marginBottom: '0',
      lineHeight: '1.2'
    }
  },
})

const DisbursementsFactSheet = () => {
  const classes = useStyles()
  const { loading, error, data } = useQuery(GET_FY_DISBURSEMENTS_BY_RECIPIENT)

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  return (
    <Box className={classes.root}>
      <Paper
        variant="outlined"
        className={classes.outline}>
        <Box
          className={classes.label}>
            Disbursements
        </Box>
        <Box className={classes.introText}>
          <Box
            component='span'>
            <span className={classes.printLabel}>Disbursements -</span>
            The amount of money paid to federal and local governments and Native Americans. Federal fiscal year runs from October through September.
          </Box>
          <Box
            component='span'
            className={classes.disbursementsDiffer}>
            Disbursements differs from revenue each month because revenue is processed before disbursements are distributed.
          </Box>
        </Box>
        <Box
          className={classes.chartHeader}>
          Disbursement by recipient for Fiscal Year {data.max_fy[0]?.fy} (cumulative total through {data.max_fy[0]?.month} {data.max_fy[0]?.cy})
        </Box>
        <Box>
          <DisbursementsPieChart data={data.disbursements} fy={data.max_fy[0]?.fy}/>
        </Box>
      </Paper>
    </Box>
  )
}

export default DisbursementsFactSheet
