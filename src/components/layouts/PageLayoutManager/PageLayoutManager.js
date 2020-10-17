/**
 * Page Layout component manages which layout component will be applied to the mdx pages
 */
import React from 'react'
import PropTypes from 'prop-types'

import DefaultLayout from '../DefaultLayout'
import DataFilterProviderWrapper from '../../DataFilterProviderWrapper'
import PatternLibraryLayout from '../../pattern-library/PatternLibraryLayout'

import ContactUs from '../../content-partials/ContactUs'
import SEO from '../../seo'

const PageLayoutManager = ({ children, location, pageContext, ...props }) => {
  if (location.pathname === '/offline-plugin-app-shell-fallback/') return null

  const layout = pageContext.frontmatter && pageContext.frontmatter.layout
  const includeDataProvider = pageContext.frontmatter && pageContext.frontmatter.includeDataProvider
  const title = pageContext.frontmatter && pageContext.frontmatter.title
  const keywords = pageContext.frontmatter && pageContext.frontmatter.tag

  if (layout === 'pattern-library' || location.pathname.includes('/patterns')) {
    const pageTitle = title || (pageContext.componentMetadata && `Pattern Library - ${ pageContext.componentMetadata.displayName }`)
    return (
      <PatternLibraryLayout path={location.pathname}>
        <SEO title={pageTitle} keywords={keywords} />
        {children}
      </PatternLibraryLayout>
    )
  }

  if (location.pathname.includes('/downloads')) {
    return (
      <DefaultLayout
        includeToc={pageContext.frontmatter && pageContext.frontmatter.includeToc}>
        <SEO title={title} keywords={keywords} />
        {children}
        <ContactUs />
      </DefaultLayout>
    )
  }

  if (includeDataProvider) {
    return (
      <DefaultLayout
        includeToc={pageContext.frontmatter && pageContext.frontmatter.includeToc}>
        <SEO title={title} keywords={keywords} />
        <DataFilterProviderWrapper>
          {children}
        </DataFilterProviderWrapper>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout
      includeToc={pageContext.frontmatter && pageContext.frontmatter.includeToc}>
      <SEO title={title} keywords={keywords} />
      {children}
    </DefaultLayout>
  )
}

PageLayoutManager.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PageLayoutManager
