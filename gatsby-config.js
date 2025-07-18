const fetch = require('isomorphic-fetch')
const { HttpLink } = require('@apollo/client')

const activeEnv = (process.env.CIRCLE_BRANCH === 'master') ? 'prd' : 'dev'
require('dotenv').config({
  path: `.env.${ activeEnv }`
})

const GTM_ID = process.env.GTM_ID
// eslint-disable-next-line max-len
const PATH_PREFIX = (process.env.STAGE === 'nrrd-preview') ? `/sites/${ process.env.BRANCH }` : undefined

const config = {
  pathPrefix: PATH_PREFIX,
  trailingSlash: 'always',
  siteMetadata: {
    isShutdown: process.env.isShutdown,
    title: 'Natural Resources Revenue Data',
    description:
      // eslint-disable-next-line max-len
      'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.',
    keywords: 'Oil and gas, Coal, Renewable energy, Nonenergy minerals, Natural resource policy, Natural resource data, Extractives industries, Federal revenues, Production, 8(g) offshore revenue, offshore production, abanonded mine lands fund, mining reclamation tax, onrr state disbursement data, Native American land ownership, coal extraction, Department of the Interior, DOI, BLM coal leases, gomesa, gomesa funding, energy resource revenue, ONRR, state royalty, us eiti, solar industry, geothermal',
    version: 'v8.9.0',
    author: '',
    dataRetrieval: {
      name: 'Data Specialists',
      email: 'onrrdatarequests@onrr.gov'
    },
    officeName: 'Office of Natural Resources Revenue',
    informationDataManagement: {
      name: 'Information and Data Management',
      street: 'PO Box 25165',
      city: 'Denver, CO',
      zip: '80225-0165',
      email: 'nrrd@onrr.gov',
      contact: 'onrrdatarequests@onrr.gov',
    },
    siteUrl: 'https://revenuedata.doi.gov',
  },
  plugins: [
    'gatsby-transformer-react-docgen',
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: GTM_ID
      }
    },
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
    'gatsby-plugin-mdx',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content-partials',
        path: `${ __dirname }/src/components/content-partials`,
      },
    },
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
      }
    },
    'gatsby-plugin-apollo',
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
        path: `${ __dirname }/src/pages`,
        name: 'pages'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'components',
        path: `${ __dirname }/src/components`
      }
    },
    'gatsby-plugin-image',
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
        typeName: 'ONRR',
        fieldName: 'onrr',
        createLink: () => {
          return new HttpLink({
            uri: process.env.GATSBY_HASURA_URI,
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
        fields: ['title', 'description', 'tags', 'glossary'],
        // How to resolve each field's value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the fields' values
          Mdx: {
            title: node => node.frontmatter.title,
            tags: node => node.frontmatter.tag || node.frontmatter.tags,
            description: node => node.frontmatter.description,
            path: node => node.frontmatter.path,
            glossary: node => node.frontmatter.glossary
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
          importWorkboxFrom: 'cdn',
          maximumFileSizeToCacheInBytes: 20000000,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-remove-console',
      options: {
        exclude: ['error', 'warn'], // <- will remove all console calls except these
      }
    },
    'gatsby-plugin-sitemap',
    'gatsby-plugin-use-query-params',
    'gatsby-plugin-meta-redirect' // make sure to put last in the array
  ]
}

module.exports = config
