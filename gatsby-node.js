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
  console.info('creating components cache index')
  return new Promise((resolve, reject) => {
	    resolve(
	      graphql(`
        {
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
	          reject(result.errors)
	        }
	        else {
          const allComponents = result.data.allComponentMetadata.nodes.map(
            (node, i) =>
              Object.assign({}, node, {
                filePath: node.parent.absolutePath,
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
