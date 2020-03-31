import React, { useEffect } from 'React'
import PropTypes from 'prop-types'
import { StickyWrapper } from '../../utils/StickyWrapper'

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
    color: theme.palette.links.default,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    width: '100%',
    '& ul': {
      display: 'flex',
      padding: 0,
    }
  },
}))

const PageScrollTo = ({ menuItems, ...rest }) => {
  const classes = useStyles()

  return (
    <>
      <StickyWrapper top={1000} bottomBoundary={200} innerZ="1000" activeClass="sticky">
        <Paper elevation={1} square className={classes.root}>
          <MenuList>
            <MenuItem>Top</MenuItem>
            { menuItems.map(item => <MenuItem>{item}</MenuItem>) }
          </MenuList>
        </Paper>
      </StickyWrapper>
    </>
  )
}

export default PageScrollTo

PageScrollTo.propTypes = {
  // Main menu items
  menuItems: PropTypes.array.isRequired
}
