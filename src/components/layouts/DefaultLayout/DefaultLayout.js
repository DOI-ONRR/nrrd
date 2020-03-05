/**
 * Default Layout component
 *
 */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'

import { ThemeProvider, makeStyles } from '@material-ui/core/styles'

import CssBaseline from '@material-ui/core/CssBaseline'
import Box from '@material-ui/core/Box'

import nrrdTheme from '../../../js/mui/theme'

import { Banner } from '../Banner'
import { Header } from '../Header'
import { Footer } from '../Footer'

import GlossaryDrawer from '../GlossaryDrawer/GlossaryDrawer'
import { classicNameResolver } from 'typescript'

console.log('nrrdTheme: ', nrrdTheme)

const useStyles = makeStyles(theme => (
  {
    '@global': {
      p: {
        margin: '0.5rem 0rem'
      },
      hr: {
        borderWidth: '0px 0px 10px 0px',
        borderColor: theme.palette.secondary.main,
        marginBottom: '1rem',
      },
      ul: {
        paddingInlineStart: '22.5px',
      },
      'ul ul': {
        listStyleType: 'square',
      },
      a: {
        color: nrrdTheme.palette.text.secondary,
        textDecoration: 'underline',
        '&:hover': {
          textDecoration: 'none',
        }
      },
      h1: { ...nrrdTheme.typography.h1 },
      h2: { ...nrrdTheme.typography.h2 },
      h3: { ...nrrdTheme.typography.h3 },
      h4: { ...nrrdTheme.typography.h4 },
      h5: { ...nrrdTheme.typography.h5 },
      h6: { ...nrrdTheme.typography.h6 },
      img: {
        maxWidth: '100%',
      },
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
  })
)

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
    <ThemeProvider theme={nrrdTheme}>
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
    </ThemeProvider>
  )
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DefaultLayout
