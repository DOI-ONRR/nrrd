import React from 'react'
import { Box, Typography, Link } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  h3: {
    marginTop: '0.5rem',
    marginBottom: '1rem'
  },
})

export default function LPMonthlyFactSheet() {
  const classes = useStyles();

  return (
    <Box bgcolor="primary.main" mb={2} pt={0.5} pb={2} pl={3} pr={3} borderRadius={10}>
      <Typography variant="h3" className={classes.h3}>
        Monthly Fact Sheet
      </Typography>
      <Typography variant='inherit'>
        <Link href='/fact-sheet'>Fact sheet</Link> summarizing disbursements, revenue, and production data by month on federal and Native American lands.
      </Typography>
    </Box>
  )
}