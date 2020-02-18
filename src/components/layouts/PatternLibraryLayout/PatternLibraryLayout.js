import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import Drawer from './ResponsiveDrawer'
import Box from '@material-ui/core/Box'
import SEO from '../../seo'
// import './PatternLibraryLayout.css'

const PatternLibraryLayout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery2 {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <SEO
          title={`Pattern Library - ${ data.site.siteMetadata.title }`}
          htmlAttributes={{ lang: 'en' }}
        />
        <Drawer title={`Pattern Library - ${ data.site.siteMetadata.title }`}>
          <Box component="main">
            {children}
          </Box>
        </Drawer>
      </>
    )}
  />
)

PatternLibraryLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PatternLibraryLayout
