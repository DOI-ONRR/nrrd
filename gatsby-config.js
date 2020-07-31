const fetch = require('isomorphic-fetch')
const { createHttpLink } = require('apollo-link-http')

const GOOGLE_ANALYTICS_ID = (process.env.CIRCLE_BRANCH === 'master') ? 'UA-33523145-1' : ''
const GTM_ID = (process.env.CIRCLE_BRANCH === 'master') ? 'GTM-NCRF98R' : ''

// use this for testing
// const GOOGLE_ANALYTICS_ID = 'UA-33523145-1'
// const GTM_ID = 'GTM-NCRF98R'

const config = {
  siteMetadata: {
    title: 'Natural Resources Revenue Data',
    description:
      'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.',
    googleAnalyticsId: GOOGLE_ANALYTICS_ID,
    googleTagManagerId: GTM_ID,
    version: 'v6.0.2',
    author: '',
    dataRetrieval: {
      name: 'Data Specialists',
      email: 'onrrdatarequests@onrr.gov'
    },
    officeName: 'Office of Natural Resources Revenue',
    informationDataManagement: {
      name: 'Information and Data Management',
      street: '1849 C Street NW MS 5134',
      city: 'Washington, D.C.',
      zip: '20240',
      email: 'nrrd@onrr.gov'
    },
  },
  plugins: [
    'gatsby-transformer-react-docgen',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Natural Resources Revenue Data',
        short_name: 'NRRD',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#663399',
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: 'minimal-ui',
        icon: 'src/images/icons/favicon.png', // This path is relative to the root of the site.
        // An optional attribute which provides support for CORS check.
        // If you do not provide a crossOrigin option, it will skip CORS for manifest.
        // Any invalid keyword or empty string defaults to `anonymous`
        crossOrigin: 'use-credentials',
      },
    },
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: `${ __dirname }/src/components/layouts/PageLayoutManager`
      }
    },
    {
      resolve: 'gatsby-plugin-material-ui',
      options: {
        // stylesProvider: {
        //   injectFirst: true,
        // }
      }
    },
    'gatsby-theme-apollo',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              icon: false,
              maintainCase: true,
              removeAccents: true,
              enableCustomId: true,
            },
          },
        ],
        extensions: ['.mdx', '.md']
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${ __dirname }/src/pages`,
        name: 'pages'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${ __dirname }/src/images`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'components',
        path: `${ __dirname }/src/components`
      }
    },
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        useMozJpeg: false,
        stripMetadata: true,
        defaultQuality: 75,
      },
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'hasura',
        fieldName: 'onrr',
        createLink: () => {
          return createHttpLink({
            // uri: 'https://hasura-onrr.app.cloud.gov/v1/graphql',
            uri: 'https://hasura-sandbox.app.cloud.gov/v1/graphql',
            // uri: 'https://hasura-nrrd-a.app.cloud.gov/v1/graphql',
            //uri: 'https://hasura-nrrd-b.app.cloud.gov/v1/graphql',
            headers: {},
            fetch,
            resolvers: {}
          })
        }
      }
    },
    {
      resolve: '@gatsby-contrib/gatsby-plugin-elasticlunr-search',
      options: {
        // Fields to index
        fields: ['title', 'description', 'tags'],
        // How to resolve each field's value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the fields' values
          Mdx: {
            title: node => node.frontmatter.title,
            tags: node => node.frontmatter.tag || node.frontmatter.tags,
            description: node => node.frontmatter.description,
            path: node => node.fields.slug
          }
        },
        // Optional filter to limit indexed nodes
        filter: (node, getNode) => node.frontmatter.title !== ''
      }
    },
    {
      resolve: 'gatsby-plugin-anchor-links',
      options: {
        offset: -100
      }
    },
    {
      resolve: 'gatsby-plugin-offline',
      options: {
        workboxConfig: {
          maximumFileSizeToCacheInBytes: 20000000
        },
      },
    },
    'gatsby-plugin-use-query-params',
    'gatsby-plugin-meta-redirect' // make sure to put last in the array
  ]
}

// if (BASEURL) {
//   config.pathPrefix = `${ BASEURL }`
// }

module.exports = config
