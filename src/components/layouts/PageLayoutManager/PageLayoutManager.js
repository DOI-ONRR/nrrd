/**
 * Page Layout component manages which layout component will be applied to the mdx pages
 */
import React from 'react'
import PropTypes from 'prop-types'

import DefaultLayout from '../DefaultLayout'
import DownloadsLayout from '../DownloadsLayout'
import PatternLibraryLayout from '../PatternLibraryLayout'

const PageLayoutManager = ({ children, pageContext, ...rest }) => {
  if (pageContext.layout === 'downloads') {
    return <DownloadsLayout>{children}</DownloadsLayout>
  }
  if (pageContext.layout === 'pattern-library') {
    return <PatternLibraryLayout>{children}</PatternLibraryLayout>
  }
  return <DefaultLayout>{children}</DefaultLayout>
}

PageLayoutManager.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PageLayoutManager
