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
  createRedirect({ fromPath: '/explore/AL/', toPath: '/explore?location=01', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/AK/', toPath: '/explore?location=02', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/AZ/', toPath: '/explore?location=04', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/AR/', toPath: '/explore?location=05', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/CA/', toPath: '/explore?location=06', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/CO/', toPath: '/explore?location=08', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/CT/', toPath: '/explore?location=09', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/DE/', toPath: '/explore?location=10', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/FL/', toPath: '/explore?location=12', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/GA/', toPath: '/explore?location=13', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/HI/', toPath: '/explore?location=15', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/ID/', toPath: '/explore?location=16', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/IL/', toPath: '/explore?location=17', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/IN/', toPath: '/explore?location=18', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/IA/', toPath: '/explore?location=19', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/KS/', toPath: '/explore?location=20', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/KY/', toPath: '/explore?location=21', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/LA/', toPath: '/explore?location=22', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/MD/', toPath: '/explore?location=24', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/MA/', toPath: '/explore?location=25', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/MI/', toPath: '/explore?location=26', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/ME/', toPath: '/explore?location=23', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/MN/', toPath: '/explore?location=27', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/MS/', toPath: '/explore?location=28', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/MO/', toPath: '/explore?location=29', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/MT/', toPath: '/explore?location=30', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/NE/', toPath: '/explore?location=31', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/NV/', toPath: '/explore?location=32', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/NH/', toPath: '/explore?location=33', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/NJ/', toPath: '/explore?location=34', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/NM/', toPath: '/explore?location=35', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/NY/', toPath: '/explore?location=36', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/NC/', toPath: '/explore?location=37', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/ND/', toPath: '/explore?location=38', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/OH/', toPath: '/explore?location=39', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/OK/', toPath: '/explore?location=40', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/OR/', toPath: '/explore?location=41', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/PA/', toPath: '/explore?location=42', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/RI/', toPath: '/explore?location=44', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/SC/', toPath: '/explore?location=45', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/SD/', toPath: '/explore?location=46', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/TN/', toPath: '/explore?location=47', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/TX/', toPath: '/explore?location=48', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/UT/', toPath: '/explore?location=49', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/VT/', toPath: '/explore?location=50', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/VA/', toPath: '/explore?location=51', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/WA/', toPath: '/explore?location=53', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/WV/', toPath: '/explore?location=54', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/WI/', toPath: '/explore?location=55', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/WY/', toPath: '/explore?location=56', redirectBrowser: true })

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
