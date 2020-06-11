/* eslint-disable max-len */
/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql, withPrefix } from 'gatsby'

const SEO = ({ description, lang, meta, title }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            googleAnalyticsId
            googleTagManagerId
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const metaTitle = title || site.siteMetadata.title

  console.log('SEO component!')

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={metaTitle}
      titleTemplate={`%s | ${ metaTitle }`}
      meta={[
        {
          name: 'description',
          content: metaDescription,
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
          content: site.siteMetadata.author,
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
      {/* <title>Home | Natural Resources Revenue Data</title> */}
      <link rel="icon" type="image/x-icon" href={withPrefix('/img/favicon.ico')} />
      <link rel="icon" type="image/x-icon" href={withPrefix('/img/favicon-16x16.png')} sizes="16x16" />
      <link rel="icon" type="image/x-icon" href={withPrefix('/img/favicon-32x32.png')} sizes="32x32" />

      {/* Digital Analytics Program roll-up, see the data at https://analytics.usa.gov */}
      <script src="https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js" id="_fed_an_ua_tag"></script>

      {/* Google Tag Manager */}
      {site.siteMetadata.googleTagManagerId &&
        <script>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer', '${ site.siteMetadata.googleTagManagerId }' );`}
        </script>
      }
    </Helmet>
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
