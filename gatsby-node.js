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
  createRedirect({ fromPath: '/explore/AL/', toPath: '/explore?location=AL', isPermanent: true })
  createRedirect({ fromPath: '/explore/AK/', toPath: '/explore?location=AK', isPermanent: true })
  createRedirect({ fromPath: '/explore/AZ/', toPath: '/explore?location=AZ', isPermanent: true })
  createRedirect({ fromPath: '/explore/AR/', toPath: '/explore?location=AR', isPermanent: true })
  createRedirect({ fromPath: '/explore/CA/', toPath: '/explore?location=CA', isPermanent: true })
  createRedirect({ fromPath: '/explore/CO/', toPath: '/explore?location=CO', isPermanent: true })
  createRedirect({ fromPath: '/explore/CT/', toPath: '/explore?location=CT', isPermanent: true })
  createRedirect({ fromPath: '/explore/DE/', toPath: '/explore?location=DE', isPermanent: true })
  createRedirect({ fromPath: '/explore/FL/', toPath: '/explore?location=FL', isPermanent: true })
  createRedirect({ fromPath: '/explore/GA/', toPath: '/explore?location=GA', isPermanent: true })
  createRedirect({ fromPath: '/explore/HI/', toPath: '/explore?location=HI', isPermanent: true })
  createRedirect({ fromPath: '/explore/ID/', toPath: '/explore?location=ID', isPermanent: true })
  createRedirect({ fromPath: '/explore/IL/', toPath: '/explore?location=IL', isPermanent: true })
  createRedirect({ fromPath: '/explore/IN/', toPath: '/explore?location=IN', isPermanent: true })
  createRedirect({ fromPath: '/explore/IA/', toPath: '/explore?location=IA', isPermanent: true })
  createRedirect({ fromPath: '/explore/KS/', toPath: '/explore?location=KS', isPermanent: true })
  createRedirect({ fromPath: '/explore/KY/', toPath: '/explore?location=KY', isPermanent: true })
  createRedirect({ fromPath: '/explore/LA/', toPath: '/explore?location=LA', isPermanent: true })
  createRedirect({ fromPath: '/explore/ME/', toPath: '/explore?location=ME', isPermanent: true })
  createRedirect({ fromPath: '/explore/MD/', toPath: '/explore?location=MD', isPermanent: true })
  createRedirect({ fromPath: '/explore/MA/', toPath: '/explore?location=MA', isPermanent: true })
  createRedirect({ fromPath: '/explore/MI/', toPath: '/explore?location=MI', isPermanent: true })
  createRedirect({ fromPath: '/explore/MN/', toPath: '/explore?location=MN', isPermanent: true })
  createRedirect({ fromPath: '/explore/MS/', toPath: '/explore?location=MS', isPermanent: true })
  createRedirect({ fromPath: '/explore/MO/', toPath: '/explore?location=MO', isPermanent: true })
  createRedirect({ fromPath: '/explore/MT/', toPath: '/explore?location=MT', isPermanent: true })
  createRedirect({ fromPath: '/explore/NE/', toPath: '/explore?location=NE', isPermanent: true })
  createRedirect({ fromPath: '/explore/NV/', toPath: '/explore?location=NV', isPermanent: true })
  createRedirect({ fromPath: '/explore/NH/', toPath: '/explore?location=NH', isPermanent: true })
  createRedirect({ fromPath: '/explore/NJ/', toPath: '/explore?location=NJ', isPermanent: true })
  createRedirect({ fromPath: '/explore/NM/', toPath: '/explore?location=NM', isPermanent: true })
  createRedirect({ fromPath: '/explore/NY/', toPath: '/explore?location=NY', isPermanent: true })
  createRedirect({ fromPath: '/explore/NC/', toPath: '/explore?location=NC', isPermanent: true })
  createRedirect({ fromPath: '/explore/ND/', toPath: '/explore?location=ND', isPermanent: true })
  createRedirect({ fromPath: '/explore/OH/', toPath: '/explore?location=OH', isPermanent: true })
  createRedirect({ fromPath: '/explore/OK/', toPath: '/explore?location=OK', isPermanent: true })
  createRedirect({ fromPath: '/explore/OR/', toPath: '/explore?location=OR', isPermanent: true })
  createRedirect({ fromPath: '/explore/PA/', toPath: '/explore?location=PA', isPermanent: true })
  createRedirect({ fromPath: '/explore/RI/', toPath: '/explore?location=RI', isPermanent: true })
  createRedirect({ fromPath: '/explore/SC/', toPath: '/explore?location=SC', isPermanent: true })
  createRedirect({ fromPath: '/explore/SD/', toPath: '/explore?location=SD', isPermanent: true })
  createRedirect({ fromPath: '/explore/TN/', toPath: '/explore?location=TN', isPermanent: true })
  createRedirect({ fromPath: '/explore/TX/', toPath: '/explore?location=TX', isPermanent: true })
  createRedirect({ fromPath: '/explore/UT/', toPath: '/explore?location=UT', isPermanent: true })
  createRedirect({ fromPath: '/explore/VT/', toPath: '/explore?location=VT', isPermanent: true })
  createRedirect({ fromPath: '/explore/VA/', toPath: '/explore?location=VA', isPermanent: true })
  createRedirect({ fromPath: '/explore/WA/', toPath: '/explore?location=WA', isPermanent: true })
  createRedirect({ fromPath: '/explore/WV/', toPath: '/explore?location=WV', isPermanent: true })
  createRedirect({ fromPath: '/explore/WI/', toPath: '/explore?location=WI', isPermanent: true })
  createRedirect({ fromPath: '/explore/WY/', toPath: '/explore?location=WY', isPermanent: true })

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
