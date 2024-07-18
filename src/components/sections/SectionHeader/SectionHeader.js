import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  titleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    '@media (max-width: 426px)': {
      display: 'block',
    }
  },
  titleLink: {
    fontSize: '1.2rem',
    marginBottom: 0,
    marginLeft: theme.spacing(2.5),
    fontWeight: 'normal',
    height: 24,
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
    '@media (max-width: 426px)': {
      display: 'block',
      width: '100%',
    },
    '& span': {
      marginRight: 0,
    },
  },
  linkWrap: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      marginBottom: 20,
    },
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-between',
      minHeight: 60,
    },
    '& span:first-child a svg': {
      position: 'relative',
      top: '6px',
    },
    '& span:nth-child(2) a svg': {
      position: 'relative',
      top: '-2px',
    }
  }
}))

const SectionHeader = props => {
  const {
    title
  } = props
  const classes = useStyles()
  return (
    <>
      <Box color="secondary.main" mb={2} borderBottom={2} pb={1} className={classes.titleBar}>
        <Box component="h3" m={0} color="primary.dark">{title}</Box>
      </Box>
    </>
  )
}

export default SectionHeader

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired
}
