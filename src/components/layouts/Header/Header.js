import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React, { Fragment, useContext, useState } from 'react'
import { isIE } from 'react-device-detect'
import { StoreContext } from '../../../store'

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import Hidden from '@material-ui/core/Hidden'
import Drawer from '@material-ui/core/Drawer'

import { BrowserBanner } from '../BrowserBanner'
import { Search } from '../../utils/Search'

import NRRDLogo from '../../../img/NRRD-logo.svg'

// Header Styles
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxHeight: '130px'
  },
  toolbar: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    borderBottom: '2px solid #cde3c3',
    maxHeight: '130px'
  },
  menuLink: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
    cursor: 'pointer',
    textDecoration: 'none',
    color: theme.palette.common.black,
    fontWeight: 400,
    fontSize: theme.typography.body1.fontSize,
    '&:hover': {
      textDecoration: 'underline',
    }
  },
  menuActiveLink: {
    fontWeight: 600,
    textDecoration: 'underline',
  },
  menuButton: {
    marginRight: theme.spacing(0),
    cursor: 'pointer'
  },
  mobileMenu: {
    padding: theme.spacing(2),
    '& ul': {
      listStyle: 'none',
      margin: theme.spacing(0),
      padding: theme.spacing(0)
    },
    '& li:first-child': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4)
    },
    '& li': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    },
    '& a:hover': {
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  },
  mobileMenuCloseButton: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    color: theme.palette.common.black
  },
  link: {
    color: theme.palette.common.black
  },
  headerImage: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(0),
    width: '325px',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(4),
      width: '200px',
    },
  },
  headerRight: {
    width: 'auto',
    textAlign: 'right',
    marginRight: '0',
    fontFamily: theme.typography.fontFamily,
    listStyle: 'none',
    marginTop: theme.spacing(0),
    '& li > a': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(2),
      paddingTop: theme.spacing(0),
      cursor: 'pointer',
      textDecoration: 'none',
      color: theme.palette.common.black
    },
    '& li': {
      listStyle: 'none',
      display: 'inline-block',
      margin: theme.palette.margin
    },
    '& li a:hover': {
      textDecoration: 'underline'
    }
  },
  headerNavItem: {
    fontSize: theme.typography.h4.fontSize
  },
  top: {
    position: 'relative',
    top: theme.spacing(-0.5),
    '& li > a': {
      fontSize: theme.typography.button.fontSize,
      paddingRight: theme.spacing(2),
      display: 'table-cell',
      verticalAlign: 'middle'
    },
    '& li': {
      position: 'relative',
      top: theme.spacing(0)
    },
    '& li:last-child': {
      position: 'relative',
      top: theme.spacing(0)
    }
  },
  bottom: {
    '& li > a': {
      fontSize: '1.2rem'
    },
    '& li.active a': {
      fontWeight: theme.typography.button.fontSize
    },
    '& li:last-child a': {
      marginRight: theme.spacing(0)
    }
  }
}))

const Header = props => {
  const classes = useStyles()

  const { state, dispatch } = useContext(StoreContext)
  const [ mobileMenuState, setMobileMenuState ] = useState({
    right: false,
  })

  const toggleMobileDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setMobileMenuState({ ...mobileMenuState, [side]: open })

    dispatch({ type: 'GLOSSARY_TERM_SELECTED', payload: { glossaryTerm: '', glossaryOpen: false } })
  }

  return (
    <Fragment>
      {isIE && <BrowserBanner />}
      <AppBar position="static" className={classes.root}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            <Link to="/">
              <img
                className={classes.headerImage}
                src={NRRDLogo}
                alt="US Department of the Interior Natural Resources Revenue Data"
              />
            </Link>
          </Typography>
          <Hidden only={['xs', 'sm']}>
            <div className={classes.headerRight}>
              <nav className={`${ classes.headerRight } ${ classes.top }`}>
                <ul>
                  <li>
                    <Link
                      className={classes.menuLink}
                      to="/"
                      activeClassName={classes.menuActiveLink}>
                      Home{' '}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={classes.menuLink}
                      to="/about"
                      activeClassName={classes.menuActiveLink}>
                      About{' '}
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={classes.menuLink}
                      alt="this is the glossary drawer"
                      onClick={() => dispatch({ type: 'GLOSSARY_TERM_SELECTED', payload: { glossaryTerm: '', glossaryOpen: true } })}
                    >
                      Glossary
                    </a>
                  </li>
                  <li>
                    <Search />
                  </li>
                </ul>
              </nav>
              <nav className={`${ classes.headerRight } ${ classes.bottom }`}>
                <ul>
                  <li>
                    <Link
                      className={classes.menuLink}
                      to="/explore/"
                      activeClassName={classes.menuActiveLink}>
                        Explore data
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={classes.menuLink}
                      to="/query-data/"
                      activeClassName={classes.menuActiveLink}>
                        Query data
                    </Link>
                  </li>
                  <li>
                    <Link className={classes.menuLink}
                      to="/downloads/"
                      activeClassName={classes.menuActiveLink}>
                      Download data{' '}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={classes.menuLink}
                      to="/how-it-works/"
                      activeClassName={classes.menuActiveLink}>
                        How revenue works
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </Hidden>

          <Hidden mdUp>
            <IconButton edge="start" onClick={toggleMobileDrawer('right', true)} className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={mobileMenuState.right} onClose={toggleMobileDrawer('right', false)} onOpen={toggleMobileDrawer('right', true)}>
              <CloseIcon className={classes.mobileMenuCloseButton} onClick={toggleMobileDrawer('right', false)} />
              <nav className={`${ classes.mobileMenu }`}>
                <ul>
                  <li>
                    <Search />
                  </li>
                  <li>
                    <Link
                      className={classes.menuLink}
                      to="/"
                      activeStyle={{ backgroun: 'pink' }}
                      partiallyActive={true}>
                        Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={classes.menuLink}
                      to="/explore/"
                      partiallyActive={true}>
                        Explore data
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={classes.menuLink}
                      to="/query-data/"
                      partiallyActive={true}>
                        Query data
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={classes.menuLink}
                      to="/how-it-works/"
                      partiallyActive={true}>
                        How revenue works
                    </Link>
                  </li>
                  <li>
                    <Link className={classes.menuLink} to="/downloads/">
                      Download data{' '}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={classes.menuLink}
                      to="/about/"
                      partiallyActive={true}>
                        About{' '}
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={classes.menuLink}
                      alt="this is the glossary drawer"
                      onClick={() => dispatch({ type: 'GLOSSARY_TERM_SELECTED', payload: { glossaryTerm: '', glossaryOpen: true } })}
                    >
                      Glossary
                    </a>
                  </li>
                </ul>
              </nav>
            </Drawer>
          </Hidden>

        </Toolbar>
      </AppBar>
    </Fragment>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: 'Natural Resources Revenue Data',
}

export default Header
