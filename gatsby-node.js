const path = require('path')
const fs = require('fs')
const appRootDir = require('app-root-dir').get()
const to = require('to-case')

const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'Mdx' && node.frontmatter.title) {
    const slug = createFilePath({ node, getNode, basePath: 'pages' })
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    })
  }
}

exports.createPages = ({ graphql, reporter, actions }) => {
  const { createRedirect } = actions

  // Explore data redirects
  createRedirect({ fromPath: '/explore/AL/', toPath: '/explore?location=01', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/AK/', toPath: '/explore?location=02', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/AZ/', toPath: '/explore?location=04', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/AR/', toPath: '/explore?location=05', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/CA/', toPath: '/explore?location=06', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/CO/', toPath: '/explore?location=08', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/CT/', toPath: '/explore?location=09', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/DE/', toPath: '/explore?location=10', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/FL/', toPath: '/explore?location=12', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/GA/', toPath: '/explore?location=13', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/HI/', toPath: '/explore?location=15', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/ID/', toPath: '/explore?location=16', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/IL/', toPath: '/explore?location=17', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/IN/', toPath: '/explore?location=18', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/IA/', toPath: '/explore?location=19', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/KS/', toPath: '/explore?location=20', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/KY/', toPath: '/explore?location=21', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/LA/', toPath: '/explore?location=22', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/MD/', toPath: '/explore?location=24', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/MA/', toPath: '/explore?location=25', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/MI/', toPath: '/explore?location=26', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/ME/', toPath: '/explore?location=23', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/MN/', toPath: '/explore?location=27', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/MS/', toPath: '/explore?location=28', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/MO/', toPath: '/explore?location=29', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/MT/', toPath: '/explore?location=30', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/NE/', toPath: '/explore?location=31', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/NV/', toPath: '/explore?location=32', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/NH/', toPath: '/explore?location=33', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/NJ/', toPath: '/explore?location=34', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/NM/', toPath: '/explore?location=35', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/NY/', toPath: '/explore?location=36', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/NC/', toPath: '/explore?location=37', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/ND/', toPath: '/explore?location=38', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/OH/', toPath: '/explore?location=39', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/OK/', toPath: '/explore?location=40', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/OR/', toPath: '/explore?location=41', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/PA/', toPath: '/explore?location=42', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/RI/', toPath: '/explore?location=44', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/SC/', toPath: '/explore?location=45', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/SD/', toPath: '/explore?location=46', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/TN/', toPath: '/explore?location=47', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/TX/', toPath: '/explore?location=48', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/UT/', toPath: '/explore?location=49', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/VT/', toPath: '/explore?location=50', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/VA/', toPath: '/explore?location=51', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/WA/', toPath: '/explore?location=53', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/WV/', toPath: '/explore?location=54', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/WI/', toPath: '/explore?location=55', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/WY/', toPath: '/explore?location=56', redirectInBrowser: true, isPermanent: true })

  // How it works redirects
  createRedirect({ fromPath: '/how-it-works/revenues/', toPath: '/how-revenue-works/revenues', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/ownership/', toPath: '/how-revenue-works/ownership', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/coal/', toPath: '/how-revenue-works/coal/', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/onshore-oil-gas/', toPath: '/how-revenue-works/onshore-oil-gas', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/onshore-renewables/', toPath: '/how-revenue-works/onshore-renewables', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/minerals/', toPath: '/how-revenue-works/minerals/', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/federal-revenue-by-company/', toPath: '/downloads/federal-revenue-by-company', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/land-and-water-conservation-fund/', toPath: '/how-revenue-works/lwcf', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/historic-preservation-fund/', toPath: '/how-revenue-works/hpf', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/', toPath: '/how-revenue-works', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/audits-and-assurances/', toPath: '/how-revenue-works/audits-and-assurances', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/aml-reclamation-program/', toPath: '/how-revenue-works/aml-reclamation-program', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/coal-excise-tax/', toPath: '/how-revenue-works/coal-excise-tax', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/offshore-oil-gas/', toPath: '/how-revenue-works/offshore-oil-gas', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/offshore-renewables/', toPath: '/how-revenue-works/offshore-renewables', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/gomesa/', toPath: '/how-revenue-works/gomesa', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/federal-laws/', toPath: '/how-revenue-works/federal-laws', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/federal-reforms/', toPath: '/how-revenue-works/federal-reforms', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/native-american-ownership-governance/', toPath: '/how-revenue-works/native-american-ownership-governance', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/native-american-production/', toPath: '/how-revenue-works/native-american-production', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/native-american-revenue/', toPath: '/how-revenue-works/native-american-revenue', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/native-american-economic-impact/', toPath: '/how-revenue-works/native-american-economic-impact', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/disbursements/', toPath: '/how-revenue-works/disbursements', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/reclamation-fund/', toPath: '/how-revenue-works/reclamation', redirectInBrowser: true, isPermanent: true })

  return Promise.all([
    createComponentsCache({ graphql, reporter }),
  ])
}

// exports.onCreateWebpackConfig = ({ actions }) => {
//   actions.setWebpackConfig({
//     node: {
//       fs: 'empty'
//     }
//   })
// }

/**
 * Creates a index file of all the components during build time so they can be easily imported for the mdx provider to use.
 * This aids in creating mdx pages since we dont have to import components in a mdx page. This is also used in creating documentation for
 * the pattern library.
 * @param {*} graphql
 */
const createComponentsCache = ({ graphql, reporter }) => {
  console.info('creating components cache index')

  return new Promise((resolve, reject) => {
	    resolve(
	      graphql(`
        {  
          allMdx(filter: {fileAbsolutePath: {regex: "/content-partials/"}}) {
            edges {
              node {
                parent {
                  ... on File {
                    name
                    absolutePath
                  }
                }
              }
            }
          }
          allComponentMetadata {
            nodes {
              id
              displayName
              description {
                text
              }
              parent {
                ... on File {
                  absolutePath
                }
              }
              props {
                name
                type {
                  name
                  raw
                  value
                }
                description {
                  text
                }
                required
              }
            }
          }
        }
      `).then(result => {
	        if (result.errors) {
          reporter.panicOnBuild('🚨  ERROR: Loading "Create Components Cache" query', result.errors)
	        }
	        else {
          const allComponents = result.data.allComponentMetadata.nodes.map(
            (node, i) =>
              Object.assign({}, node, {
                filePath: node.parent.absolutePath,
              })
          )
          const allMdx = result.data.allMdx.edges.map(
            (node, i) => Object.assign({}, node.node, {
              displayName: node.node.parent.name,
              filePath: node.node.parent.absolutePath,
            })
          )

          let exportFileContents =
              allComponents
                .reduce((accumulator, { displayName, filePath }) => {
                  if (filePath.search('components/images/index.js') >= 0) {
                    accumulator.push(
                      `export { ${ displayName } } from "${ filePath }"`
                    )
                  }
                  else {
                    accumulator.push(
                      `export { default as ${ displayName } } from "${ filePath }"`
                    )
                  }
                  return accumulator
                }, [])
                .join('\n') + '\n'

          exportFileContents = exportFileContents.concat(
            allMdx
              .reduce((accumulator, { displayName, filePath }) => {
                accumulator.push(
                  `export { default as ${ displayName } } from "${ filePath }"`
                )
                return accumulator
              }, [])
              .join('\n') + '\n'
          )

          fs.writeFileSync(
            path.join(appRootDir, '.cache/components.js'),
            exportFileContents
          )
          resolve()
	        }
	      })
	    )
	  })
}
