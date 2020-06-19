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
  createRedirect({ fromPath: '/explore/AL/', toPath: '/explore?location=AL', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/AK/', toPath: '/explore?location=AK', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/AZ/', toPath: '/explore?location=AZ', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/AR/', toPath: '/explore?location=AR', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/CA/', toPath: '/explore?location=CA', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/CO/', toPath: '/explore?location=CO', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/CT/', toPath: '/explore?location=CT', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/DE/', toPath: '/explore?location=DE', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/FL/', toPath: '/explore?location=FL', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/GA/', toPath: '/explore?location=GA', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/HI/', toPath: '/explore?location=HI', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/ID/', toPath: '/explore?location=ID', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/IL/', toPath: '/explore?location=IL', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/IN/', toPath: '/explore?location=IN', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/IA/', toPath: '/explore?location=IA', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/KS/', toPath: '/explore?location=KS', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/KY/', toPath: '/explore?location=KY', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/LA/', toPath: '/explore?location=LA', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/ME/', toPath: '/explore?location=ME', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/MD/', toPath: '/explore?location=MD', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/MA/', toPath: '/explore?location=MA', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/MI/', toPath: '/explore?location=MI', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/MN/', toPath: '/explore?location=MN', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/MS/', toPath: '/explore?location=MS', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/MO/', toPath: '/explore?location=MO', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/MT/', toPath: '/explore?location=MT', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/NE/', toPath: '/explore?location=NE', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/NV/', toPath: '/explore?location=NV', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/NH/', toPath: '/explore?location=NH', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/NJ/', toPath: '/explore?location=NJ', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/NM/', toPath: '/explore?location=NM', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/NY/', toPath: '/explore?location=NY', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/NC/', toPath: '/explore?location=NC', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/ND/', toPath: '/explore?location=ND', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/OH/', toPath: '/explore?location=OH', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/OK/', toPath: '/explore?location=OK', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/OR/', toPath: '/explore?location=OR', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/PA/', toPath: '/explore?location=PA', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/RI/', toPath: '/explore?location=RI', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/SC/', toPath: '/explore?location=SC', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/SD/', toPath: '/explore?location=SD', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/TN/', toPath: '/explore?location=TN', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/TX/', toPath: '/explore?location=TX', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/UT/', toPath: '/explore?location=UT', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/VT/', toPath: '/explore?location=VT', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/VA/', toPath: '/explore?location=VA', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/WA/', toPath: '/explore?location=WA', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/WV/', toPath: '/explore?location=WV', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/WI/', toPath: '/explore?location=WI', redirectBrowser: true })
  createRedirect({ fromPath: '/explore/WY/', toPath: '/explore?location=WY', redirectBrowser: true })

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
