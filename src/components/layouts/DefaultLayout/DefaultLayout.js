/**
 * Default Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql, withPrefix } from 'gatsby'
import SEO from '../../seo'
import { makeStyles } from '@material-ui/core/styles'

import { Banner } from '../Banner'
import { Header } from '../Header'
import { Footer } from '../Footer'

import './DefaultLayout.css'
import GlossaryDrawer from '../GlossaryDrawer/GlossaryDrawer'

// Render Meta Image with Prefix SVG
function renderMetaImage () {
  return withPrefix('/img/unfurl_image.png')
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      background: (theme.paletteType === 'light') ? '#000' : '#fff',
      margin: 0,
      fontFamily: theme.typography.fontFamily
    },
    a: {
      color: '#1478a6',
      textDecoration: 'underline'
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
        }
      }
    }
  `)

  return (
    <Fragment>
      <SEO
        htmlAttributes={{ lang: 'en' }}
        meta={[
          { name: 'google-site-verification', content: 'OxyG3U-Vtui-uK6wHUeOw83OgdfcfxvsWWZcb5x7aZ0' },
          // Mobile Specific Metas
          { name: 'HandheldFriendly', content: 'True' },
          { name: 'MobileOptimized', content: '320' },

          // type
          { name: 'og:type', content: 'website' },

          // title
          { name: 'og:title', content: 'Home | Natural Resources Revenue Data' },
          { name: 'twitter:title', content: 'Home | Natural Resources Revenue Data' },

          // img
          { name: 'og:image', content: renderMetaImage() },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:image', content: renderMetaImage() },

          // description
          { name: 'og:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
          { name: 'twitter:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
        ]}
      ></SEO>

      <a href="#main-content" className={classes.skipNav}>Skip to main content</a>

      <Banner />

      <Header siteTitle={data.site.siteMetadata.title} />
      
      
        <GlossaryDrawer />
      

      <div
        style={{
          margin: `0 auto`,
          maxWidth: `100%`,
          padding: `0`,
          paddingTop: 0,
        }}
      >
        <main>{children}</main>
      </div>

      <Footer version={data && data.site.siteMetadata.version} />
    </Fragment>
  )
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DefaultLayout
