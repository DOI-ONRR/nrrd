/**
 * Constants that are used by the application
 **/

 module.exports = Object.freeze({
  MARKDOWN_DOWNLOADS:
  `allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/downloads/"}}) {
    pages: edges {
      page: node {
        frontmatter {
          title
          permalink
          layout
          redirect_from
        }
        htmlAst
      }
    }
  }`,
 })