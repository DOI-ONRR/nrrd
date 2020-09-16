/* eslint-disable no-undef */
import slugify from 'slugify'
const React = require('react')
const gatsby = jest.requireActual('gatsby')

module.exports = {
  ...gatsby,
  graphql: ([queryString]) => getQueryName(queryString),
  Link: jest.fn().mockImplementation(({ to, ...rest }) =>
    React.createElement('a', {
      ...rest,
      href: to,
    })
  ),
  StaticQuery: jest.fn(),
  useStaticQuery: function (queryName) {
    console.log(queryName)
    const filePath = './queries/reer.json'

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
/*
${ slugify(queryName, {
      lower: true,
      // eslint-disable-next-line no-useless-escape
      remove: /[$*_+~.()'"!\:@,?]/g
    }).replace('-and-', '-') }
    */
