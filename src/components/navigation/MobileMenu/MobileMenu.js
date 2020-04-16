import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  Drawer,
  List,
  ListItem
} from '@material-ui/core'

import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  listItemLink: {
    textAlign: 'center',
    display: 'block',
    fontSize: theme.typography.h3.fontSize,
    '&:hover': {
      color: theme.palette.links.default,
      background: theme.palette.grey[900],
      textAlign: 'center',
    },
  },
  listRoot: {
    background: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  menuButton: {
    color: theme.palette.common.black,
    padding: theme.spacing(2)
  },
}))

// List item link
const ListItemLink = props => {
  return <ListItem button component="a" {...props} />
}

const MobileMenu = ({ children, ...rest }) => {
  const classes = useStyles()
  const [menuState, setMenuState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  })

  // Toggle menu
  const toggleDrawer = (anchor, open) => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setMenuState({ ...menuState, [anchor]: open })
  }

  // Menu list
  const list = anchor => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List classes={{ root: classes.listRoot }}>
        {
          React.Children.map(children, (child, index) => (
            <ListItem button key={index} disableGutters>
              <ListItemLink href={child.props.href} className={classes.listItemLink}>{child.props.children}</ListItemLink>
            </ListItem>
          ))
        }
      </List>
    </div>
  )

  return (
    <Fragment>
      <IconButton
        className={classes.menuButton}
        aria-label="mobile-menu"
        onClick={toggleDrawer('top', true)}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor={'top'}
        open={menuState.top}
        onClose={toggleDrawer('top', false)}
        classes={{ root: classes.drawerRoot }}>
        {list('top')}
      </Drawer>
    </Fragment>
  )
}

export default MobileMenu

MobileMenu.prototypes = {
  children: PropTypes.element.isRequired
}
