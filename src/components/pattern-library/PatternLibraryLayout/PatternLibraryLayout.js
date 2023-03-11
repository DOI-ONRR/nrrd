import React from 'react'
import PropTypes from 'prop-types'
import { Link, navigate } from 'gatsby'

import CssBaseline from '@material-ui/core/CssBaseline'
import { fade, makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import * as ALL_COMPONENTS from '../../../../.cache/components'

const palette = {
  background: { default: '#A4CEE8' },
  text: {
    primary: '#004C77',
    secondary: '#630B5D'
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
    color: 'white'
  },
  h2: {
    margin: '2rem 0 1rem 0',
    fontSize: '1.625rem',
    lineHeight: '2.25rem',
    fontWeight: '600',
    color: 'white'
  },
  h3: {
    margin: '2rem 0 .5rem 0',
    fontSize: '1.375rem',
    lineHeight: '2rem',
    fontWeight: '600',
    color: 'white'
  },
  h4: {
    margin: '2rem 0 0.25rem 0',
    fontSize: '1.21rem',
    lineHeight: '1.235',
    fontWeight: '600',
    color: 'white'
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
      backgroundColor: '#004C77'
    }
  },
  MuiAutocomplete: {
    inputRoot: {
      backgroundColor: '#e3f2fa',
      height: '45px'
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
      backgroundColor: '#004C77',
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
      color: 'white',
      border: 'none',
      borderRadius: '0px',
      height: '48px',
      textTransform: 'none',
      '&$selected': {
        color: 'white',
        backgroundColor: '#630B5D',
      }
    },
  }
}

const theme = createTheme({ palette, typography, overrides })
const useStyles = makeStyles(() => ({
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

const PatternLibraryLayout = ({ path, children }) => {
  // eslint-disable-next-line no-unused-vars
  const [componentsAnchorEl, setComponentsAnchorEl] = React.useState(null)
  const handleComponentsClick = event => {
    setComponentsAnchorEl(null)
    setCurrentPath(event.currentTarget.value)
  }
  const handleVisualStylesClick = event => {
    setComponentsAnchorEl(null)
    setCurrentPath(event.currentTarget.value)
  }

  const classes = useStyles()

  const getCurrentPath = () => {
    if (path.includes('components')) {
      return 'components'
    }
    return 'visual'
  }
  const [currentPath, setCurrentPath] = React.useState(getCurrentPath())

  const pageTitle = 'NRRD Pattern Library'
  const groups = [...(new Set(Object.keys(ALL_COMPONENTS)
    .map(c => ALL_COMPONENTS[c]?.Preview?.group)
    .filter(g => g !== undefined)))]
  const componentNames = Object.keys(ALL_COMPONENTS)
    .filter(c => (ALL_COMPONENTS[c]?.name === c || ALL_COMPONENTS[c]?.type?.name === c) && ALL_COMPONENTS[c]?.Preview !== undefined)

  const handleNavigate = value => {
    switch (value) {
    case 'Guidelines':
      navigate('/patterns', { replace: true })
      break
    case 'Color':
      navigate('/patterns/visual-styles/color', { replace: true })
      break
    case 'Typography':
      navigate('/patterns/visual-styles/typography', { replace: true })
      break
    case 'Iconography':
      navigate('/patterns/visual-styles/iconography', { replace: true })
      break
    default:
      if (groups.includes(value)) {
        navigate(`/patterns/components/?type=${ value }`, { replace: true })
      }
      else if (componentNames.includes(value) && ALL_COMPONENTS[value]?.Preview?.group) {
        navigate(`/patterns/components/?type=${ ALL_COMPONENTS[value].Preview.group }#${ value }`, { replace: true })
      }
    }
  }

  const SearchBox = () => {
    const [value] = React.useState(null)

    return (
      <Autocomplete
        id="search-box"
        value={value}
        onChange={(event, newValue) => {
          handleNavigate(newValue)
        }}
        options={['Guidelines', 'Color', 'Typography', 'Iconography'].concat(groups, componentNames)}
        style={{ width: 300 }}
        freeSolo
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderInput={params => <TextField {...params} label="Search" variant="outlined" />}
      />
    )
  }

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
              <ToggleButton value='visual' className={classes.links} onClick={handleVisualStylesClick}><Link to='/patterns'>Visual Styles</Link></ToggleButton>
              <ToggleButton value='components' className={classes.links} onClick={handleComponentsClick}><Link to='/patterns/components/'>Components</Link></ToggleButton>
            </ToggleButtonGroup>
            <div className={classes.grow} />
            <div className={classes.search}>
              <SearchBox />
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
