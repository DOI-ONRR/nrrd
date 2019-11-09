import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { Fragment } from "react"
import { isIE } from 'react-device-detect'

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import { BrowserBanner } from '../BrowserBanner'
import { Search } from '../../utils/Search'

import NRRDLogo from '../../../img/NRRD-logo.svg'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  toolbar: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    // borderBottom: '2px solid #cde3c3',
    maxHeight: '130px'
  },
  menuLink: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
    cursor: 'pointer',
    textDecoration: 'none',
    color: theme.palette.common.black
  },
  menuButton: {
    marginRight: theme.spacing(2),
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

const Header = ({ siteTitle }) => {
  const classes = useStyles()

  return (
    <Fragment>
      {isIE && <BrowserBanner />}
      <AppBar position="static" className={classes.root}>
        <Toolbar className={classes.toolbar}>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" className={classes.title}>
            <Link to="/">
              <img
                className={classes.headerImage}
                src={NRRDLogo}
                alt="US Department of the Interior Natural Resources Revenue Data"
              />
            </Link>
          </Typography>
          <div className={classes.headerRight}>
            <nav className={`${ classes.headerRight } ${ classes.top }`}>
              <ul>
                <li>
                  <a
                    href="#"
                    className={classes.menuLink}
                    alt="this is the glossary drawer"
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
                </ul>
              </nav>
              </div>
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
