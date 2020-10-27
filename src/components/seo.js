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
            googleAnalyticsId
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

        {/* Digital Analytics Program roll-up, see the data at https://analytics.usa.gov */}
        <script src="https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js" id="_fed_an_ua_tag"></script>

        {defaults.googleAnalyticsId &&
          <script>
            {`(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', '${ defaults.googleAnalyticsId }', 'auto');ga('set', 'anonymizeIp', true);ga('set', 'forceSSL', true);ga('send', 'pageview');`}
          </script>
        }
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
