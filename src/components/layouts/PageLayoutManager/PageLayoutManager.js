/**
 * Page Layout component manages which layout component will be applied to the mdx pages
 */
import React from 'react'
import PropTypes from 'prop-types'

import DefaultLayout from '../DefaultLayout'
import DataFilterProviderWrapper from '../../DataFilterProviderWrapper'
import PatternLibraryLayout from '../PatternLibraryLayout'

const PageLayoutManager = ({ children, location, pageContext, ...props }) => {
  if (location.pathname === '/offline-plugin-app-shell-fallback/') return null

  const layout = pageContext.frontmatter && pageContext.frontmatter.layout
  const includeDataProvider = pageContext.frontmatter && pageContext.frontmatter.includeDataProvider

  if (layout === 'pattern-library') {
    return <PatternLibraryLayout>{children}</PatternLibraryLayout>
  }

  if (includeDataProvider) {
    return (
      <DefaultLayout includeToc={pageContext.frontmatter && pageContext.frontmatter.includeToc}>
        <DataFilterProviderWrapper>
          {children}
        </DataFilterProviderWrapper>
      </DefaultLayout>
    )
  }

  return <DefaultLayout includeToc={pageContext.frontmatter && pageContext.frontmatter.includeToc}>{children}</DefaultLayout>
}

PageLayoutManager.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PageLayoutManager
