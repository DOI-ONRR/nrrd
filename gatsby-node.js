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
  const { createRedirect, createPage } = actions

  return Promise.all([
    createRedirects({ graphql, reporter, createRedirect }),
    createComponentsCache({ graphql, reporter }),
    createPatternLibraryPages({ graphql, createPage, reporter })
  ])
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: {
      fs: 'empty'
    }
  })
}

// Create redirects from Redirect.mdx frontmatter
const createPatternLibraryPages = ({ graphql, createPage, reporter }) => {
  console.info('creating pattern library pages')

  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
        query {
          allComponentMetadata(sort: {fields: displayName, order: ASC}) {
            nodes {
              displayName
              description {
                childMdx {
                  body
                }
              }
              childrenComponentProp {
                name
                docblock
                required
                parentType {
                  name
                }
                type {
                  value
                }
                defaultValue {
                  value
                  computed
                }
              }
              parent {
                ... on File {
                  relativePath
                  absolutePath
                }
              }
            }
          }
        }
      `)
    )
  }).then(result => {
    if (result.errors) {
      reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
    }
    else {
      result.data.allComponentMetadata.nodes.filter(node => !node.displayName.includes('Demos')).forEach((node, i) => {
        createPage({
          path: `/patterns/components/${ node.displayName }`,
          component: path.resolve('./src/templates/pattern-library-component.js'),
          context: {
            componentMetadata: node
          },
        })
      })
    }
  })
}

// Create redirects from Redirect.mdx frontmatter
const createRedirects = ({ graphql, reporter, createRedirect }) => {
  console.info('creating redirects')

  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
        query redirects {
          allMdx(filter: {fileAbsolutePath: {regex: "/content-partials/Redirects/"}}) {
            nodes {
              frontmatter {
                redirects {
                  newUrl
                  oldUrl
                }
              }
            }
          }
        }
      `)
    )
  }).then(result => {
    if (result.errors) {
      reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
    }
    else {
      const redirects = result.data.allMdx.nodes[0].frontmatter.redirects
      redirects.forEach(element => {
        createRedirect({
          fromPath: element.oldUrl,
          toPath: element.newUrl,
          redirectInBrowser: true,
          isPermanent: true
        })
      })
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
          const allComponents = result.data.allComponentMetadata.nodes.filter(node => (!node.displayName.includes('Demos'))).map(
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
          const exportAllFileContents =
              allComponents
                .reduce((accumulator, { displayName, filePath }) => {
                  if (filePath.search('components/images/index.js') < 0) {
                    accumulator.push(
                      `export * from "${ filePath }"`
                    )
                  }
                  return accumulator
                }, [])
                .join('\n') + '\n'

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
          fs.writeFileSync(
            path.join(appRootDir, '.cache/components-all.js'),
            exportAllFileContents
          )
	        }
	      })
	    )
	  })
}
