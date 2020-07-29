/**
 * Default Layout component
 *
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'

import Box from '@material-ui/core/Box'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'

import InfoBanner from '../../content-partials/InfoBanner'
import BrowserBanner from '../BrowserBanner'
import Footer from '../../content-partials/Footer'
import Header from '../../content-partials/Header'
import ErrorMessage from '../../info/ErrorMessage'
import LoadingStatusBackdrop from '../../info/LoadingStatusBackdrop'
import PageToc from '../../navigation/PageToc'

import SEO from '../../seo'

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
    },
    mainColumn: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    }
  })
)

const DefaultLayout = ({ includeToc = true, title, children }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const data = useStaticQuery(graphql`
    query DefaultLayoutQuery {
      site {
        siteMetadata {
          title
          version
          officeName
          informationDataManagement {
            name
            city
            zip
            street
            email
          }
        }
      }
    }
  `)

  return (
    <React.Fragment>
      <SEO title={title} />
      <a href="#main-content" className={classes.skipNav}>Skip to main content</a>
      <LoadingStatusBackdrop />
      <InfoBanner />
      <BrowserBanner />
      <Header />
      <CssBaseline />
      <main id='main-content' className={classes.mainContent}>
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
    </React.Fragment>
  )
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DefaultLayout
