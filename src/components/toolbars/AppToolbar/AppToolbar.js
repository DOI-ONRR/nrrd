import React from 'react'

import {
  AppBar,
  InputBase,
  IconButton,
  useScrollTrigger,
  Slide
} from '@material-ui/core'

import {
  makeStyles,
  fade
} from '@material-ui/core/styles'

import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'

import BaseToolbar from '../BaseToolbar'
import Header from '../../content-partials/Header'
import Link from '../../Link'
import { SearchSite } from '../../inputs/SearchSite'

import NrrdLogoPlaceholderImg from '../../images/NrrdLogoPlaceholderImg'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#0a314d !important',
    position: 'relative',
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0a314d',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.05),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.10),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${ theme.spacing(4) }px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '4ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))

const AppToolbar = props => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ position: 'relative' }}>
        <BaseToolbar style={{ alignItems: 'center', backgroundColor: '#0a314d', justifyContent: 'space-between', minHeight: 65 }}>
          {/* <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon style={{ color: 'white' }} />
          </IconButton> */}
          <div style={{ width: 250 }}>
            <Link href='/' linkType='Header' style={{ display: 'block' }}><NrrdLogoPlaceholderImg style={{ width: 250 }} /></Link>
          </div>
          <div>
            {/* <Link href='/' linkType='Header' style={{ color: 'white' }}>Home</Link> */}
            <Link href='/explore' linkType='Header' style={{ color: 'white' }}>Explore data</Link>
            <Link href='/query-data' linkType='Header' style={{ color: 'white' }}>Query data</Link>
            <Link href='/downloads' linkType='Header' style={{ color: 'white' }}>Download data</Link>
            <Link href='/how-revenue-works' linkType='Header' style={{ color: 'white' }}>How revenue works</Link>
            <Link href='/about' linkType='Header' style={{ color: 'white' }}>About</Link>
          </div>
          <div>
            <SearchSite />
          </div>
        </BaseToolbar>
      </AppBar>
    </div>
  )
}

export default AppToolbar
