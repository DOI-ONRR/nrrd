import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon
} from '@material-ui/core'

import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
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
    '& div:last-child': {
      display: 'flex',
      justifyContent: 'center',
    },
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
    >
      <List classes={{ root: classes.listRoot }}>
        {
          React.Children.map(children, (child, index) => {
            if (child.props.href) {
              return (
                <ListItem button key={index} disableGutters>
                  <ListItemLink href={child.props.href} className={classes.listItemLink}>{child.props.children}</ListItemLink>
                </ListItem>
              )
            }
            return (
              <>
                {child}
              </>
            )
          })
        }
        <ListItem button key={children.length + 1} disableGutters>
          <ListItemIcon onClick={toggleDrawer(anchor, false)}>
            <CloseIcon />
          </ListItemIcon>
        </ListItem>
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
