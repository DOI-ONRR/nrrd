import React from 'react'

import { makeStyles } from '@material-ui/styles'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/react-hooks'
import { Box, Grid, Paper } from '@material-ui/core'
import DisbursementsPieChart from './DisbursementsPieChart'

const GET_FY_DISBURSEMENTS_BY_RECIPIENT = gql`
  query GetFyDisbursementsByRecipient {
    disbursements: fiscal_year_disbursements_by_recipient_v {
      totalDisbursements: total
      recipient: grouped_recipients
    }
  }
`

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
  disbursementsDiffer: {
    marginLeft: '0.25rem',
    fontStyle: 'italic',
  },
  introText: {
    fontSize: '1rem',
    marginBottom: '1rem',
  },
  chartHeader: {
    fontWeight: 'bold',
    fontSize: '1rem',
    borderBottom: '2px solid #000',
    marginBottom: '1.5rem',
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
          Disbursement by recipient for Fiscal Year 2025 (cumulative total through October 2024)
        </Box>
        <Box>
          <DisbursementsPieChart data={data.disbursements} />
        </Box>
      </Paper>
    </Box>
  )
}

export default DisbursementsFactSheet
