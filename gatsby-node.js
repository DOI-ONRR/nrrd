/* eslint-disable indent */

const path = require('path')
const GRAPHQL_QUERIES = require('./src/js/graphql-queries')

// Page Templates
const CONTENT_DEFAULT_TEMPLATE = path.resolve('src/templates/content-default.js')
const DOWNLOADS_TEMPLATE = path.resolve('src/templates/downloads-default.js')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return Promise.all([
    createDownloadPages(createPage, graphql)
  ])
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
