/**
 * Default Layout component
 *
 */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'

import Box from '@material-ui/core/Box'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'

import Footer from '../../content-partials/Footer'
// import Header from '../../content-partials/Header'
import ErrorMessage from '../../info/ErrorMessage'
import ShutdownBanner from '../../content-partials/ShutdownBanner'
import LoadingStatusBackdrop from '../../info/LoadingStatusBackdrop'
import PageToc from '../../navigation/PageToc'

import StickyHeader from '../StickyHeader'

import { isIE } from 'react-device-detect'

const useStyles = makeStyles(theme => (
  {
    '@global': {
      p: {
        margin: '0.5rem 0rem'
      },
      hr: {
        border: `5px solid ${ theme.palette.secondary.main }`,
        marginBottom: '1rem',
      },
      ul: {
        paddingInlineStart: '22.5px'
      },
      'ul ul': {
        listStyleType: 'square'
      },
      h1: { ...theme.typography.h1 },
      h2: { ...theme.typography.h2 },
      h3: { ...theme.typography.h3 },
      h4: { ...theme.typography.h4 },
      h5: { ...theme.typography.h5 },
      h6: { ...theme.typography.h6 },
    },
    img: {
      width: '100%'
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
    },
    mainContent: {
      minHeight: 575,
      marginTop: 110,
      [theme.breakpoints.down('xs')]: {
        marginTop: 60
      },
      top: isIE ? 140 : 0,
      position: isIE ? 'relative' : 'inherit',
      '@media print': {
        marginTop: 0,
      },
    },
    mainColumn: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
  })
)

const DefaultLayout = ({ includeToc, children }) => {
  const [isClient, setIsClient] = useState(false);
  const theme = useTheme()
  const classes = useStyles(theme)

  const data = useStaticQuery(graphql`
    query DefaultLayoutQuery {
      site {
        siteMetadata {
          isShutdown
          version
          officeName
          informationDataManagement {
            name
            city
            zip
            street
            email
            contact
          }
        }
      }
    }
  `)

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null
  }
  
  return (
    <>
      <a href="#main-content" className={classes.skipNav}>Skip to main content</a>
      <LoadingStatusBackdrop />
      <StickyHeader data={data} />
      <CssBaseline />
      <main id='main-content' className={classes.mainContent}>
        <Container maxWidth="xl">
          <Grid container spacing={0} >
            <Grid item xs={12}>
               <ShutdownBanner />
            </Grid>
          </Grid>
        </Container>
        <ErrorMessage />
        {includeToc
          ? <Container maxWidth="lg" component="section">
            <Grid container>
              <Grid item xs={12} sm={3}>
                <PageToc scrollOffset={190}></PageToc>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Box className={classes.mainColumn}>
                  {children}
                </Box>
              </Grid>
            </Grid>
          </Container>
          : <>{ children }</>
        }
      </main>
      {data &&
        <Box>
          <Footer data={data} />
        </Box>
      }
    </>
  )
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DefaultLayout
