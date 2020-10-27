import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'

import {
  Drawer,
  List,
  ListItem
} from '@material-ui/core'

import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  mobileMenu: {
    backgroundColor: theme.palette.header.secondary,
    height: '100%',
    '@media (maxWidth: 600px)': {
      maxWidth: '90%',
    }
  },
  listItemLink: {
    textAlign: 'left',
    display: 'block',
    fontSize: theme.typography.h3.fontSize,
    '&:hover': {
      color: theme.palette.common.white,
      background: 'rgba(41, 75, 99, .5)',
      textAlign: 'left',
    },
  },
  listRoot: {
    color: theme.palette.common.white,
    '& div:last-child': {
      display: 'flex',
      justifyContent: 'center',
    },
  },
  menuButton: {
    color: theme.palette.common.white,
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
      className={classes.mobileMenu}
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
        {/* <ListItem button key={children.length + 1} disableGutters>
          <ListItemIcon onClick={toggleDrawer(anchor, false)}>
            <CloseIcon />
          </ListItemIcon>
        </ListItem> */}
      </List>
    </div>
  )

  return (
    <Fragment>
      <IconButton
        className={classes.menuButton}
        aria-label="mobile-menu"
        onClick={toggleDrawer('right', true)}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor={'right'}
        open={menuState.right}
        onClose={toggleDrawer('right', false)}
        classes={{ root: classes.drawerRoot }}>
        {list('right')}
      </Drawer>
    </Fragment>
  )
}

export default MobileMenu

MobileMenu.prototypes = {
  children: PropTypes.element.isRequired
}
