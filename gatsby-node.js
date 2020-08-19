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

// set custom layout for 404 page
// exports.onCreatePage = ({ page }) => {
//   if (page.path.startsWith('/404')) {
//     page.layout = '404Layout'
//   }
// }

exports.createPages = ({ graphql, reporter, actions }) => {
  const { createRedirect } = actions

  // Explore data redirects
  createRedirect({ fromPath: '/explore/AL/', toPath: '/explore?location=AL', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/AK/', toPath: '/explore?location=AK', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/AZ/', toPath: '/explore?location=AZ', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/AR/', toPath: '/explore?location=AR', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/CA/', toPath: '/explore?location=CA', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/CO/', toPath: '/explore?location=CO', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/CT/', toPath: '/explore?location=CT', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/DE/', toPath: '/explore?location=DE', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/FL/', toPath: '/explore?location=FL', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/GA/', toPath: '/explore?location=GA', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/HI/', toPath: '/explore?location=HI', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/ID/', toPath: '/explore?location=ID', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/IL/', toPath: '/explore?location=IL', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/IN/', toPath: '/explore?location=IN', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/IA/', toPath: '/explore?location=IA', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/KS/', toPath: '/explore?location=KS', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/KY/', toPath: '/explore?location=KY', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/LA/', toPath: '/explore?location=LA', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/MD/', toPath: '/explore?location=MD', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/MA/', toPath: '/explore?location=MA', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/MI/', toPath: '/explore?location=MI', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/ME/', toPath: '/explore?location=ME', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/MN/', toPath: '/explore?location=MN', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/MS/', toPath: '/explore?location=MS', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/MO/', toPath: '/explore?location=MO', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/MT/', toPath: '/explore?location=MT', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/NE/', toPath: '/explore?location=NE', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/NV/', toPath: '/explore?location=NV', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/NH/', toPath: '/explore?location=NH', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/NJ/', toPath: '/explore?location=NJ', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/NM/', toPath: '/explore?location=NM', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/NY/', toPath: '/explore?location=NY', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/NC/', toPath: '/explore?location=NC', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/ND/', toPath: '/explore?location=ND', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/OH/', toPath: '/explore?location=OH', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/OK/', toPath: '/explore?location=OK', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/OR/', toPath: '/explore?location=OR', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/PA/', toPath: '/explore?location=PA', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/RI/', toPath: '/explore?location=RI', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/SC/', toPath: '/explore?location=SC', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/SD/', toPath: '/explore?location=SD', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/TN/', toPath: '/explore?location=TN', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/TX/', toPath: '/explore?location=TX', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/UT/', toPath: '/explore?location=UT', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/VT/', toPath: '/explore?location=VT', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/VA/', toPath: '/explore?location=VA', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/WA/', toPath: '/explore?location=WA', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/WV/', toPath: '/explore?location=WV', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/WI/', toPath: '/explore?location=WI', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/explore/WY/', toPath: '/explore?location=WY', redirectInBrowser: true, isPermanent: true })

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

  createRedirect({ fromPath: '/how-it-works/federal-revenue-by-company/2018/', toPath: '/how-revenue-works', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/federal-revenue-by-company/2017/', toPath: '/how-revenue-works', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/federal-revenue-by-company/2016/', toPath: '/how-revenue-works', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/federal-revenue-by-company/2015/', toPath: '/how-revenue-works', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/federal-revenue-by-company/2014/', toPath: '/how-revenue-works', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-it-works/federal-revenue-by-company/2013/', toPath: '/how-revenue-works', redirectInBrowser: true, isPermanent: true })

  // How revenue works
  createRedirect({ fromPath: '/how-revenue-works/land-and-water-conservation-fund/', toPath: '/how-revenue-works/lwcf', redirectInBrowser: true, isPermanent: true })
  createRedirect({ fromPath: '/how-revenue-works/historic-preservation-fund/', toPath: '/how-revenue-works/hpf', redirectInBrowser: true, isPermanent: true })

  return Promise.all([
    createComponentsCache({ graphql, reporter }),
  ])
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: {
      fs: 'empty'
    }
  })
}

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
