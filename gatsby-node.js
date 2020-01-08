const path = require('path')
const fs = require('fs')
const appRootDir = require('app-root-dir').get()

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions

  /**
   * We use the gatsby layout plugin and so if we want to use a different layout we pass in a property the default layout reads and then
   * uses the appropriate layout.
   */
  if (page.path.match(/patterns/)) {
    page.context.layout = 'pattern-library'
    createPage(page)
  }
}

exports.createPages = ({ graphql }) => {
  return Promise.all([
    createComponentsCache(graphql),
  ])
}

/**
 * Creates a index file of all the components during build time so they can be easily imported for the mdx provider to use.
 * This aids in creating mdx pages since we dont have to import components in a mdx page. This is also used in creating documentation for
 * the pattern library.
 * @param {*} graphql
 */
const createComponentsCache = graphql => {
  return new Promise((resolve, reject) => {
	    resolve(
	      graphql(`
        {
          allComponentMetadata {
            edges {
              node {
                id
                displayName
                description {
                  text
                }
                props {
                  name
                  type {
                    value
                    raw
                    name
                  }
                  description {
                    text
                  }
                  required
                }
                parent {
                  ... on File {
                    absolutePath
                  }
                }
              }
            }
          }
        }
      `).then(result => {
	        if (result.errors) {
	          reject(result.errors)
	        }
	        else {
          const allComponents = result.data.allComponentMetadata.edges.map(
            (edge, i) =>
              Object.assign({}, edge.node, {
                filePath: edge.node.parent.absolutePath,
              })
          )

          const exportFileContents =
              allComponents
                .reduce((accumulator, { displayName, filePath }) => {
                  accumulator.push(
                    `export { default as ${ displayName } } from "${ filePath }"`
                  )
                  return accumulator
                }, [])
                .join('\n') + '\n'

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
