/**
 * Default Layout component
 *
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'

import { ThemeProvider, makeStyles } from '@material-ui/core/styles'

import CssBaseline from '@material-ui/core/CssBaseline'
import Box from '@material-ui/core/Box'

import theme from '../../../js/mui/theme'

import { Banner } from '../Banner'
import { Header } from '../Header'
import { Footer } from '../Footer'

import GlossaryDrawer from '../GlossaryDrawer/GlossaryDrawer'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      background: '#fff',
      margin: 0,
      fontFamily: theme.typography.fontFamily
    },
    a: {
      color: '#1478a6',
      textDecoration: 'underline',
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'none',
      }
    },
    img: {
      maxWidth: '100%'
    },
    '.header-bar': {
      borderWidth: '2px',
      borderBottom: 'solid',
      paddingBottom: '.41667rem',
    },
    '.header-bar.green': {
      borderColor: '#cde3c3',
    }
  },
  root: {
    paddingTop: theme.spacing(2),
    paddingLeft: 0,
    paddingRight: 0,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0)
    }
  },
  site: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
  },
  siteContent: {
    margin: '0',
    maxWidth: '100%',
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    flexGrow: 1
  },
  header: {
    maxHeight: '130px'
  },
  skipNav: {
    position: 'absolute',
    top: '-1000px',
    left: '-1000px',
    height: '1px',
    width: '1px',
    textAlign: 'left',
    overflow: 'hidden',

    '&:active': {
      left: '0',
      top: '0',
      padding: '5px',
      width: 'auto',
      height: 'auto',
      overflow: 'visible'
    },
    '&:focus': {
      left: '0',
      top: '0',
      padding: '5px',
      width: 'auto',
      height: 'auto',
      overflow: 'visible'
    },
    '&:hover': {
      left: '0',
      top: '0',
      padding: '5px',
      width: 'auto',
      height: 'auto',
      overflow: 'visible'
    }
  }
}))

const DefaultLayout = ({ children }) => {
  const classes = useStyles()

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          version
        }
      }
    }
  `)

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <Box className={classes.site}>
          <a href="#main-content" className={classes.skipNav}>Skip to main content</a>

          <Banner />

          <Header className={classes.header} siteTitle={data.site.siteMetadata.title} />

          <GlossaryDrawer />

          <Box className={classes.siteContent}>
            <CssBaseline />
            <Box component="main">{children}</Box>
          </Box>

          <Footer version={data && data.site.siteMetadata.version} />
        </Box>

        <Footer version={data && data.site.siteMetadata.version} />
      </Box>
    </ThemeProvider>
  )
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DefaultLayout
