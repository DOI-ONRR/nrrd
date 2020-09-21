/**
 * Page Layout component manages which layout component will be applied to the mdx pages
 */
import React from 'react'
import PropTypes from 'prop-types'
// Import font
import 'typeface-lato'

import DefaultLayout from '../DefaultLayout'
import DataFilterProviderWrapper from '../../DataFilterProviderWrapper'
import PatternLibraryLayout from '../PatternLibraryLayout'

import ContactUs from '../../content-partials/ContactUs'

const PageLayoutManager = ({ children, location, pageContext, ...props }) => {
  // console.log('PageLayoutManager pageContext: ', pageContext)
  if (location.pathname === '/offline-plugin-app-shell-fallback/') return null

  const layout = pageContext.frontmatter && pageContext.frontmatter.layout
  const includeDataProvider = pageContext.frontmatter && pageContext.frontmatter.includeDataProvider

  if (layout === 'pattern-library') {
    return <PatternLibraryLayout>{children}</PatternLibraryLayout>
  }

  if (location.pathname.includes('/downloads')) {
    return (
      <DefaultLayout
        includeToc={pageContext.frontmatter && pageContext.frontmatter.includeToc}
        title={pageContext.frontmatter && pageContext.frontmatter.title}>
        {children}
        <ContactUs />
      </DefaultLayout>
    )
  }

  if (includeDataProvider) {
    return (
      <DefaultLayout
        includeToc={pageContext.frontmatter && pageContext.frontmatter.includeToc}
        title={pageContext.frontmatter && pageContext.frontmatter.title}>
        <DataFilterProviderWrapper>
          {children}
        </DataFilterProviderWrapper>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout
      includeToc={pageContext.frontmatter && pageContext.frontmatter.includeToc}
      title={pageContext.frontmatter && pageContext.frontmatter.title}>
      {children}
    </DefaultLayout>
  )
}

PageLayoutManager.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PageLayoutManager
