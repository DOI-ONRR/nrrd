import React from 'react'

import {
  AppBar,
  Hidden
} from '@material-ui/core'

import {
  makeStyles,
  fade,
  useTheme
} from '@material-ui/core/styles'

import BaseToolbar from '../BaseToolbar'
import MobileMenu from '../../navigation/MobileMenu'
import Link from '../../Link'
import { SearchSite } from '../../inputs/SearchSite'

import { NrrdLogoImg } from '../../images'

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
  mainMenuWrap: {
    '& a:nth-child(3)': {
      paddingRight: theme.spacing(1.5),
    },
    '& a:last-child': {
      borderLeft: '1px solid white',
      paddingLeft: theme.spacing(4),
    }
  }
}))

const AppToolbar = props => {
  const classes = useStyles()
  const theme = useTheme()
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ position: 'relative' }}>
        <BaseToolbar style={{ alignItems: 'center', backgroundColor: theme.palette.header.secondary, justifyContent: 'space-between', minHeight: 80 }}>
          <div>
            <Link href='/' linkType='default' style={{ display: 'block' }}><NrrdLogoImg style={{ maxHeight: 60, height: 60, position: 'relative', top: 1 }} /></Link>
          </div>
          <Hidden mdDown>
            <div className={classes.mainMenuWrap}>
              <Link href='/explore' linkType='Header' style={{ color: 'white' }}>Explore data</Link>
              <Link href='/query-data' linkType='Header' style={{ color: 'white' }}>Query data</Link>
              <Link href='/downloads' linkType='Header' style={{ color: 'white' }}>Download data</Link>
              <Link href='/how-revenue-works' linkType='Header' style={{ color: 'white' }}>How revenue works</Link>
            </div>
          </Hidden>
          <Hidden mdDown>
            <div>
              <SearchSite />
            </div>
          </Hidden>
          <Hidden lgUp>
            <MobileMenu>
              <Link href='/explore' linkType='Header'>Explore data</Link>
              <Link href='/query-data' linkType='Header'>Query data</Link>
              <Link href='/downloads' linkType='Header'>Download data</Link>
              <hr style={{ borderColor: 'rgba(255, 255, 255, .25)', borderWidth: 0.5, maxWidth: '90%' }} />
              <Link href='/how-revenue-works' linkType='Header'>How revenue works</Link>
              <Link href='/about' linkType='Header'>About</Link>
              <Link href='/' linkType='Header'>Home</Link>
              <SearchSite isMobile={true} />
            </MobileMenu>
          </Hidden>
        </BaseToolbar>
      </AppBar>
    </div>
  )
}

export default AppToolbar
