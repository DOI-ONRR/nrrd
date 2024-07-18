import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

const stateData = [
  { name: 'Alaska Offshore Region', href: 'https://revenuedata.doi.gov/explore/offshore-regions/alaska/' },
  { name: 'Atlantic Offshore Region', href: 'https://revenuedata.doi.gov/explore/offshore-regions/atlantic/' },
  { name: 'Gulf Offshore Region', href: 'https://revenuedata.doi.gov/explore/offshore-regions/gulf/' },
  { name: 'Pacific Offshore Region', href: 'https://revenuedata.doi.gov/explore/offshore-regions/pacific/' }
]

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing(20),
  },
  button: {
    minWidth: '200px',
    marginBottom: theme.spacing(2),
    margin: theme.spacing(0.5),
    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: 'transparent',
    },
  },
}))

const DatabyOffshoreRegionButtons = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      {stateData.map((state, index) => (
        <Button
          key={index}
          className={classes.button}
          variant="contained"
          color="primary"
          href={state.href}
        >
          {state.name}
        </Button>
      ))}
    </div>
  )
}

export default DatabyOffshoreRegionButtons
