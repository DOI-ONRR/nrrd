import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

export default ({ alt, ...rest }) => {
  const data = useStaticQuery(graphql`
  query {
    file(relativePath: {regex: "/OSMRE-mark.png/"}) {
      childImageSharp {
        gatsbyImageData(
          layout: CONSTRAINED
        )
      }
    }
  }
  `)
  if (!data.file.childImageSharp.gatsbyImageData) {
    console.warn('OSMRE-mark.png did not load from graphql')
    return <></>
  }
  const altText = 'Office of Surface Mining Reclamation and Enforcement (O S M R E) logo. U.S. Department of the Interior'
  return (
    <>
      {data.file.childImageSharp.gatsbyImageData &&
        <GatsbyImage image={data.file.childImageSharp.gatsbyImageData} alt={alt || altText} {...rest} />
      }
    </>
  )
}
