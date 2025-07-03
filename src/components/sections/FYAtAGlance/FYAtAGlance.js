import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { getFiscalYear } from '../../utils/nrrdUtils'

const useStyles = makeStyles({
  h2: {
    marginTop: '0.5rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
})

export default function FYAtAGlance() {
  const classes = useStyles()

  return (
    <>
      <Typography variant="h2" className={classes.h2}>
        FY { getFiscalYear() } at a glance
      </Typography>
    </>
  )
}