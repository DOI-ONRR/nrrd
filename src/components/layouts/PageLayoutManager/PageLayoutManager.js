/**
 * Page Layout component manages which layout component will be applied to the mdx pages
 */
import React from 'react'
import PropTypes from 'prop-types'

import DefaultLayout from '../DefaultLayout'
import DefaultContentLayout from '../DefaultContentLayout'
import DownloadsLayout from '../DownloadsLayout'
import PatternLibraryLayout from '../PatternLibraryLayout'

const PageLayoutManager = ({ children, location, pageContext, ...rest }) => {
  if (location.pathname === '/offline-plugin-app-shell-fallback/') return null

  const layout = pageContext.frontmatter && pageContext.frontmatter.layout

  if (layout=== 'downloads') {
    return <DownloadsLayout>{children}</DownloadsLayout>
  }
  if (layout === 'pattern-library') {
    return <PatternLibraryLayout>{children}</PatternLibraryLayout>
  }
  if (layout === 'DefaultContentLayout') {
    return <DefaultContentLayout>{children}</DefaultContentLayout>
  }
  return <DefaultLayout>{children}</DefaultLayout>
}

PageLayoutManager.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PageLayoutManager
