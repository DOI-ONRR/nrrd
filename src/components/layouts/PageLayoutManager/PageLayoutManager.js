/**
 * Page Layout component manages which layout component will be applied to the mdx pages
 */
import React from 'react'
import PropTypes from 'prop-types'

import DefaultLayout from '../DefaultLayout'
import DefaultContentLayout from '../DefaultContentLayout'
import PatternLibraryLayout from '../PatternLibraryLayout'

const PageLayoutManager = ({ children, location, pageContext }) => {
  if (location.pathname === '/offline-plugin-app-shell-fallback/') return null

  const layout = pageContext.frontmatter && pageContext.frontmatter.layout

  if (layout === 'pattern-library') {
    return <PatternLibraryLayout>{children}</PatternLibraryLayout>
  }
  if (layout === 'DefaultContentLayout') {
    return <DefaultContentLayout>{children}</DefaultContentLayout>
  }

  return <DefaultLayout includeToc={pageContext.frontmatter && pageContext.frontmatter.includeToc}>{children}</DefaultLayout>
}

PageLayoutManager.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PageLayoutManager
