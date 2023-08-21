import React from 'react'

import {
  AppBar,
  // not used  Button,
  Hidden,
  // not used  Menu,
  // not used MenuItem,
  Box
} from '@material-ui/core'

import {
  makeStyles,
  fade
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
  nrrdLogo: {
    maxHeight: 60,
    height: 60,
    position: 'relative',
    top: 1,
    transition: 'height .1s',
    '@media (max-width: 600px)': {
      maxHeight: 50,
      height: 50,
    }
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
    display: 'inherit',
    '& a:last-child': {
      borderLeft: '1px solid white',
      paddingLeft: theme.spacing(4),
    }
  },
  mobileMainMenu: {
    '& button': {
      color: theme.palette.common.white,
      padding: 0,
      minWidth: 'inherit',
      top: -2.5,
    },
    '& ul li a': {
      color: theme.palette.links.default
    }
  },
  baseToolbar: {
    alignItems: 'center',
    backgroundColor: theme.palette.header.secondary,
    justifyContent: 'space-between',
    minHeight: 80
  }
}))

const AppToolbar = props => {
  const classes = useStyles()
  return (
    <Box className={classes.root} displayPrint="none">
      <AppBar position="static" style={{ position: 'relative' }}>
        <BaseToolbar className={classes.baseToolbar}>
          <div>
            <Link href='/' linkType='default' style={{ display: 'block' }} aria-label="Link to home page"><NrrdLogoImg className={`${ classes.nrrdLogo } header-logo`} /></Link>
          </div>
          <Hidden mdDown>
            <div className={classes.mainMenuWrap}>
              <Link href='/explore' linkType='Header' style={{ color: 'white' }}>Explore data</Link>
              <Link href='/query-data' linkType='Header' style={{ color: 'white' }}>Query data</Link>
              <Link href='/downloads' linkType='Header' style={{ color: 'white' }}>Download data</Link>
              <Link href='/glossary' linkType='Header' style={{ color: 'white' }}>Glossary</Link>
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
              <Link href='/glossary' linkType='Header' style={{ color: 'white' }}>Glossary</Link>
              <hr style={{ borderColor: 'rgba(255, 255, 255, .25)', borderWidth: 0.5, maxWidth: '90%' }} />
              <Link href='/how-revenue-works' linkType='Header'>How revenue works</Link>
              <Link href='/about' linkType='Header'>About</Link>
              <Link href='/' linkType='Header'>Home</Link>
              <SearchSite isMobile={true} />
            </MobileMenu>
          </Hidden>
        </BaseToolbar>
      </AppBar>
    </Box>
  )
}

export default AppToolbar

/* Not used
   const DataMenu = ({ children, label, ...props }) => {
 *  const classes = useStyles()
 *  const [anchorEl, setAnchorEl] = useState(null)

 *  const handleClick = e => {
 *    setAnchorEl(e.currentTarget)
 *  }

 *  const handleClose = () => {
 *    setAnchorEl(null)
 *  }

 *  return (
 *    <div className={classes.mobileMainMenu}>
 *      <Button aria-controls="mobile-main-menu" aria-haspopup="true" onClick={handleClick}>
 *        {label}
 *      </Button>
 *      <Menu
 *        id="mobile-main-menu"
 *        anchorEl={anchorEl}
 *        keepMounted
 *        open={Boolean(anchorEl)}
 *        onClose={handleClose}
 *        {...props}
 *      >
 *        {
 *          children.map((child, i) =>
 *            <MenuItem key={i} onClick={handleClose}>{child}</MenuItem>
 *          )
 *        }
 *      </Menu>
 *    </div>
 *  )
   } */
