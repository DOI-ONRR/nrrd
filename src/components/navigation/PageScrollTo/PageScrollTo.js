import React from 'React'
import PropTypes from 'prop-types'

import { AnchorLink } from 'gatsby-plugin-anchor-links'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Menu,
  MenuList,
  MenuItem,
  Paper
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-block',
    color: theme.palette.primary.dark,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
}))

const PageScrollTo = ({ menuItems, ...rest }) => {
  console.log('PageScrollTo menuItems: ', menuItems)
  const classes = useStyles()
  return (
    <Paper className={classes.root}>
      <MenuList>
        <MenuItem>Top</MenuItem>
        { menuItems.map(item => <MenuItem>{item}</MenuItem>) }
      </MenuList>
    </Paper>
  )
}

export default PageScrollTo

PageScrollTo.propTypes = {
  // Main menu items
  menuItems: PropTypes.array.isRequired
}
