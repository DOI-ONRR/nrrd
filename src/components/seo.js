/* eslint-disable max-len */
/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

function SEO ({ description, lang, meta, title, keywords }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            keywords
            author
          }
        }
      }
    `
  )

  const defaults = site.siteMetadata
  const metaDescription = description || defaults.description
  const metaTitle = title || defaults.title
  const keywordsStr = keywords && keywords.length > 0 ? keywords.join(', ') : ''
  const metaKeywords = defaults.keywords.concat(`, ${ keywordsStr }`)

  return (
    <Fragment>
      <Helmet
        htmlAttributes={{
          lang,
        }}
        title={metaTitle}
        titleTemplate={`%s | ${ defaults.title }`}
        meta={[
          {
            name: 'description',
            content: metaDescription,
          },
          {
            name: 'keywords',
            content: metaKeywords
          },
          {
            property: 'og:title',
            content: metaTitle,
          },
          {
            property: 'og:description',
            content: metaDescription,
          },
          {
            property: 'og:type',
            content: 'website',
          },
          {
            name: 'twitter:card',
            content: 'summary',
          },
          {
            name: 'twitter:creator',
            content: defaults.author,
          },
          {
            name: 'twitter:title',
            content: metaTitle,
          },
          {
            name: 'twitter:description',
            content: metaDescription,
          },
        ].concat(meta)}
      >
      </Helmet>
    </Fragment>
  )
}

SEO.defaultProps = {
  lang: 'en',
  meta: [],
  description: '',
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO
