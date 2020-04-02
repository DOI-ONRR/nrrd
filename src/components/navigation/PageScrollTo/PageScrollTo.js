import React, { useState, useEffect } from 'React'
import PropTypes from 'prop-types'
import { StickyWrapper } from '../../utils/StickyWrapper'

import Link from '../../Link'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Menu,
  MenuList,
  MenuItem,
  Paper
} from '@material-ui/core'

const REVENUE_SUB_MENU = [
  ['Compare revenue', 'compare-revenue'],
  ['National revenue summary', 'national-revenue-summary'],
  ['Top locations', 'top-locations'],
  ['Top commodities', 'top-commodities'],
  ['Revenue by company', 'revenue-by-company'],
]

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-block',
    color: theme.palette.links.default,
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    width: '100%',
    '& ul': {
      display: 'flex',
      padding: 0,
    },
    '& a': {
      fontWeight: 'bold',
      textDecoration: 'none'
    },
  },
}))

const getMenuItems = dataType => {
  let menuItems
  switch (dataType) {
  case 'Revenue':
  case 'Disbursements':
    menuItems = REVENUE_SUB_MENU
    break

  default:
    throw new Error()
  }

  return menuItems
}

const PageScrollTo = props => {
  const classes = useStyles()
  const { menuItems, ...rest } = props
  const items = menuItems || getMenuItems(rest.dataType)

  return (
    <Box className={classes.root}>
      <StickyWrapper enabled={true} top={0} bottomBoundary={0} innerZ="1000" activeClass="sticky">
        <Paper elevation={1} square>
          <MenuList>
            <MenuItem key={0} className="active">
              <Link href="/explore#" title="Top">
              Top
              </Link>
            </MenuItem>
            { items.map((item, i) => <MenuItem key={i + 1}><Link href={`/explore#${ item[1] }`} title={item[0]}>{item[0]}</Link></MenuItem>) }
          </MenuList>
        </Paper>
      </StickyWrapper>
    </Box>
  )
}

export default PageScrollTo

PageScrollTo.propTypes = {
  // Main menu items
  menuItems: PropTypes.array
}
