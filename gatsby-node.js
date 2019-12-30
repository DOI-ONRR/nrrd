/* eslint-disable indent */

const path = require(`path`)
const fs = require('fs')
const appRootDir = require(`app-root-dir`).get()
const GRAPHQL_QUERIES = require(`./src/js/graphql-queries`)

// Page Templates
const CONTENT_DEFAULT_TEMPLATE = path.resolve(`src/templates/content-default.js`)
const DOWNLOADS_TEMPLATE = path.resolve(`src/templates/downloads-default.js`)

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions

  /**
   * We use the gatsby layout plugin and so if we want to use a different layout we pass in a property the default layout reads and then
   * uses the appropriate layout.
   */
  if (page.path.match(/patterns/)) {
    page.context.layout = "pattern-library"
    createPage(page)
  }
}

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage, createRedirect } = boundActionCreators

  return Promise.all([
    createComponentsCache(graphql),
    createDownloadPages(createPage, graphql)
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
                .join(`\n`) + `\n`

            fs.writeFileSync(
              path.join(appRootDir, `.cache/components.js`),
              exportFileContents
            )
            resolve()
	        }
	      })
	    )
	  })
}

const getPageTemplate = templateId => {
  switch (templateId) {
    case 'howitworks-default':
      return HOWITWORKS_DEFAULT_TEMPLATE
    case 'archive-default':
      return ARCHIVE_DEFAULT_TEMPLATE
    case 'howitworks-process':
      return HOWITWORKS_PROCESS_TEMPLATE
    case 'downloads':
      return DOWNLOADS_TEMPLATE
    case 'how-it-works-reconciliation':
      return HOWITWORKS_RECONCILIATION_TEMPLATE
    case 'howitworks-revenue-by-company':
      return HOWITWORKS_REVENUE_BY_COMPANY_TEMPLATE
    case 'case-studies':
      return CASE_STUDIES_TEMPLATE
    case 'offshore-region':
      return OFFSHORE_REGION_TEMPLATE
    }
  
    return CONTENT_DEFAULT_TEMPLATE
}

const createDownloadPages = (createPage, graphql) => {
  const graphQLQueryString = `{${ GRAPHQL_QUERIES.MARKDOWN_DOWNLOADS }}`

  return new Promise((resolve, reject) => {
    resolve(
      graphql(graphQLQueryString).then(result => {
        if (result.errors) {
        console.error(result.errors)
          reject(result.errors)
        }
        else {
        // Create pages for each markdown file.
          result.data.allMarkdownRemark.pages.forEach(({ page }) => {
            const path = page.frontmatter.permalink
            const template = getPageTemplate(page.frontmatter.layout)

            createPage({
              path,
              component: template,
              context: {
                markdown: page,
              },
            })
          })
        resolve()
        }
      })
    )
  })
}
