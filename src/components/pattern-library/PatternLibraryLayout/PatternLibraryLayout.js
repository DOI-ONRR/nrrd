import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql, Link } from 'gatsby'

import CssBaseline from '@material-ui/core/CssBaseline'
import { fade, makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    color: 'white',
    margin: 0,
    marginRight: theme.spacing(10),
  },
  links: {
    '&  a': {
      color: 'inherit',
      textDecoration: 'none'
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.23),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.5),
    },
    margin: theme.spacing(1),
    marginLeft: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
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
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))

const palette = {
  background: { default: '#ffffff' },
  text: {
    primary: '#000000',
    secondary: '#1478a6'
  },
}
const typography = Object.freeze({
  fontSize: 18,
  fontFamily: 'Lato, "Helvetica Neue", Helvetica, arial, sans-serif',
  fontWeightBold: '600',
  // This overrides CSSBaseline for the body tag
  body2: {
    color: '#000',
    fontSize: '1.125rem',
    lineHeight: '1.6875rem',
  },
  h1: {
    margin: '0 0 1rem 0',
    fontSize: '2.125rem',
    lineHeight: '2.875rem',
    fontWeight: '600',
  },
  h2: {
    margin: '2rem 0 1rem 0',
    fontSize: '1.625rem',
    lineHeight: '2.25rem',
    fontWeight: '600',
  },
  h3: {
    margin: '2rem 0 .5rem 0',
    fontSize: '1.375rem',
    lineHeight: '2rem',
    fontWeight: '600',
  },
  h4: {
    margin: '2rem 0 0.25rem 0',
    fontSize: '1.21rem',
    lineHeight: '1.235',
    fontWeight: '600',
  },
  h5: {
    margin: '2rem 0 0.25rem 0',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  h6: {
    margin: '2rem 0 0.25rem 0',
    fontSize: '.875rem',
    fontWeight: '600',
  },
})

const overrides = {
  MuiAppBar: {
    colorDefault: {
      backgroundColor: '#90caf9'
    }
  },
  MuiToolbar: {
    root: {
      height: '48px'
    }
  },
  MuiButtonGroup: {
    groupedTextHorizontal: {
      borderRight: '1px solid rgba(0, 0, 0, 0.23)',
      '&:not(:last-child)': {
        borderLeft: '1px solid rgba(0, 0, 0,  0.23)',
      }
    }
  },
  MuiToggleButtonGroup: {
    root: {
      backgroundColor: '#90caf9',
      borderRadius: '0px'
    },
    grouped: {
      borderRight: '1px solid rgba(0, 0, 0, 0.23)',
      '&:not(:last-child)': {
        borderLeft: '1px solid rgba(0, 0, 0,  0.23)',
      }
    }
  },
  MuiToggleButton: {
    root: {
      color: 'rgba(0, 0, 0,  0.75)',
      border: 'none',
      borderRadius: '0px',
      height: '48px',
      textTransform: 'none',
      '&$selected': {
        color: 'black',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
      }
    },
  }
}

const theme = createMuiTheme({ palette, typography, overrides })

const PatternLibraryLayout = ({ path, children }) => {
  const [componentsAnchorEl, setComponentsAnchorEl] = React.useState(null)
  const handleComponentsClick = event => {
    setComponentsAnchorEl(event.currentTarget)
    setCurrentPath(event.currentTarget.value)
  }
  const handleVisualStylesClick = event => {
    setComponentsAnchorEl(null)
    setCurrentPath(event.currentTarget.value)
  }
  const handleComponentItemClick = () => {
    setComponentsAnchorEl(null)
    setCurrentPath('components')
  }
  const handleComponentsClose = () => {
    setComponentsAnchorEl(null)
    setCurrentPath(getCurrentPath())
  }

  const classes = useStyles(theme)
  const data = useStaticQuery(graphql`
    query PatternLibraryQuery {
      allComponentMetadata(sort: {fields: displayName, order: ASC}) {
        nodes {
          displayName
        }
      }
    }
  `)

  const getCurrentPath = () => {
    if (path.includes('visual')) {
      return 'visual'
    }
    if (path.includes('components')) {
      return 'components'
    }
    return undefined
  }
  const [currentPath, setCurrentPath] = React.useState(getCurrentPath())

  const pageTitle = 'NRRD Pattern Library'
  console.log(currentPath)

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" color='default'>
          <Toolbar variant="dense">
            <Typography variant="h1" className={`${ classes.title } ${ classes.links }`}>
              <Link to='/patterns'>{pageTitle}</Link>
            </Typography>
            <ToggleButtonGroup value={currentPath} aria-label="button group for visual and component pages">
              <ToggleButton value='visual' className={classes.links} onClick={handleVisualStylesClick}><Link to='/patterns/visual-styles'>Visual Styles</Link></ToggleButton>
              <ToggleButton value='components' onClick={handleComponentsClick}>Components</ToggleButton>
              <Menu
                id="simple-menu"
                anchorEl={componentsAnchorEl}
                keepMounted
                open={Boolean(componentsAnchorEl)}
                onClose={handleComponentsClose}
              >
                {data &&
                  data.allComponentMetadata.nodes.map(item =>
                    <MenuItem key={item.displayName} onClick={handleComponentItemClick} className={classes.links}>
                      <Link to={`/patterns/components/${ item.displayName }`}>
                        {item.displayName}
                      </Link>
                    </MenuItem>)
                }
              </Menu>
            </ToggleButtonGroup>
            <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" component="section">
          {children}
        </Container>
      </ThemeProvider>
    </>
  )
}

PatternLibraryLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PatternLibraryLayout
