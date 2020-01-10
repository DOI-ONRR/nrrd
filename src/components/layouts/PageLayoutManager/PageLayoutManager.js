/**
 * Page Layout component manages which layout component will be applied to the mdx pages
 */

import DefaultLayout from '../DefaultLayout'
import DownloadsLayout from '../DownloadsLayout'

import React from 'react'
import PropTypes from 'prop-types'

const PageLayoutManager = ({ path, children, ...rest }) => {
  switch (path) {
  case '/downloads/':
    return <DownloadsLayout>{children}</DownloadsLayout>
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
