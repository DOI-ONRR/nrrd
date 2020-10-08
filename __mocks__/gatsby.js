/* eslint-disable no-undef */
const React = require('react')
const gatsby = jest.requireActual('gatsby')

module.exports = {
  ...gatsby,
  graphql: ([queryString]) => getQueryName(queryString),
  Link: jest.fn().mockImplementation(({ to, ...rest }) =>
    React.createElement('a', {
      ...rest,
      href: to,
      'data-testId': 'BaseLink'
    })
  ),
  StaticQuery: jest.fn(),
  useStaticQuery: function (queryName) {
    const filePath = `./__mock_queries__/${ queryName }_results.json`

    try {
      return require(filePath)
    }
    catch (err) {
      console.warn(`Failed to require mock file for ${ queryName }`)
      return {}
    }
  },
}
function getQueryName (queryString) {
  const captureGroup = queryString.match(/query\s([^\s]+).*{/)
  if (captureGroup && captureGroup.length) {
    return captureGroup[1]
  }
}
