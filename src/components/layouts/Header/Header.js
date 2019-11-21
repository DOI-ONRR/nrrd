import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React, { Fragment, useState, useContext } from 'react'
import { isIE } from 'react-device-detect'
import { GlossaryContext } from '../../../glossaryContext'

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
    fontWeight: 400
  },
  menuActiveLink: {
    fontWeight: 600
  },
  menuButton: {
    marginRight: theme.spacing(0),
    cursor: 'pointer'
  },
  mobileMenu: {
    padding: theme.spacing(2),
    '& ul': {
      listStyle: 'none',
      margin: theme.spacing(0)
    },
    '& li:first-child': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4)
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
  button: {
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
      width: '225px'
    }
  },
  headerRight: {
    width: 'auto',
    textAlign: 'right',
    marginRight: '0',
    fontFamily: theme.typography.fontFamily,
    listStyle: 'none',
    marginTop: theme.spacing(1),
    '& li > a': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(2),
      paddingTop: theme.spacing(2),
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
    '& li > a': {
      fontSize: theme.typography.button.fontSize,
      paddingRight: theme.spacing(2),
      display: 'table-cell',
      verticalAlign: 'middle'
    },
    '& li': {
      position: 'relative',
      top: theme.spacing(1.5)
    },
    '& li:last-child': {
      position: 'relative',
      top: theme.spacing(0)
    }
  },
  bottom: {
    '& li > a': {
      fontSize: theme.typograph
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

  const { dispatch } = useContext(GlossaryContext)
  const [state, setState ] = useState({
    right: false
  })

  const toggleMobileDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [side]: open });
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
                  <a
                    href="#"
                    className={classes.menuLink}
                    alt="this is the glossary drawer"
                    onClick={() => dispatch({ type: 'GLOSSARY_TERM_SELECTED', glossaryTerm: '', glossaryOpen: true })}
                  >
                    Glossary
                  </a>
                </li>
                <li>
                  <Link className={classes.menuLink} to="/downloads/">
                    Download data{' '}
                  </Link>
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
                      to="/"
                      activeClassName={classes.menuActiveLink}
                      partiallyActive={true}>
                        Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className={classes.menuLink} 
                      to="/how-it-works/"
                      activeClassName={classes.menuActiveLink}
                      partiallyActive={true}>
                        How it works
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className={classes.menuLink} 
                      to="/explore/"
                      activeClassName={classes.menuActiveLink}
                      partiallyActive={true}>
                        Explore data
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className={classes.menuLink} 
                      to="/about/"
                      activeClassName={classes.menuActiveLink}
                      partiallyActive={true}>
                        About{' '}
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
            <Drawer anchor="right" open={state.right} onClose={toggleMobileDrawer('right', false)}>
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
                      activeStyle={{ backgroun: "pink" }}
                      partiallyActive={true}>
                        Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className={classes.menuLink} 
                      to="/how-it-works/"
                      partiallyActive={true}>
                        How it works
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
                      to="/about/"
                      partiallyActive={true}>
                        About{' '}
                    </Link>
                  </li>
                  <li>
                    <Link className={classes.menuLink} to="/downloads/">
                      Download data{' '}
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={classes.menuLink}
                      alt="this is the glossary drawer"
                      onClick={() => dispatch({ type: 'GLOSSARY_TERM_SELECTED', glossaryTerm: '', glossaryOpen: true })}
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
  siteTitle: `Natural Resources Revenue Data`,
}

export default Header
