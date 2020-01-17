/**
 * Page Layout component manages which layout component will be applied to the mdx pages
 */

import DefaultLayout from '../DefaultLayout'
import DownloadsLayout from '../DownloadsLayout'
import PatternLibraryLayout from '../PatternLibraryLayout'

import React from 'react'
import PropTypes from 'prop-types'

const PageLayoutManager = ({ path, children, ...rest }) => {
  if (path.includes('/downloads/')) {
    return <DownloadsLayout>{children}</DownloadsLayout>
  }
  if (path.includes('/patterns/')) {
    return <PatternLibraryLayout>{children}</PatternLibraryLayout>
  }

  return (
    <DefaultLayout>
      {children}
    </DefaultLayout>
  )
}

PageLayoutManager.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PageLayoutManager
