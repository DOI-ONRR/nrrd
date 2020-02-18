import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import logo from '../../../img/us-flag-small.png'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#f0f6fa',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    textAlign: 'center',
    height: 'auto',
    width: '100%',
    boxSizing: 'border-box',
    zIndex: 100,
  },
  bannerImage: {
    paddingLeft: '0.20833em',
    marginBottom: '-1px',
    marginRight: theme.spacing(1)
  }
}))

const Banner = () => {
  const classes = useStyles()
  return (
    <Container component="section" className={classes.root} maxWidth={false}>
      <Box component="span">
        <img
          className={classes.bannerImage}
          src={logo} alt="U.S. flag signifying that this is a United States Federal Government website" />
          An official website of the U.S. government
      </Box>
    </Container>
  )
}

export default Banner
