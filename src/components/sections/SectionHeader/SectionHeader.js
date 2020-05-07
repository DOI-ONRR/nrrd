import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

import { ExploreDataLink } from '../../layouts/IconLinks/ExploreDataLink'

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
    fontWeight: 'normal',
    height: 24,
    '@media (max-width: 426px)': {
      display: 'block',
      width: '100%',
    },
    '& span': {
      marginRight: 0,
    },
  },
}))

const SectionHeader = props => {
  const classes = useStyles()
  return (
    <>
      <Box color="secondary.main" mb={2} borderBottom={2} pb={1} className={classes.titleBar}>
        <Box component="h3" m={0} color="primary.dark">{props.title}</Box>
        {props.showExploreLink &&
          <Box component="span" className={classes.titleLink}>
            <ExploreDataLink
              to={`/query-data?dataType=${ props.linkLabel || props.title }`}
              icon="filter">Filter {props.linkLabel || props.title} data</ExploreDataLink>
          </Box>
        }
      </Box>
    </>
  )
}

export default SectionHeader

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired
}
