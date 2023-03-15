import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

export default ({ alt, ...rest }) => {
  const data = useStaticQuery(graphql`
  query {
    file(relativePath: {regex: "/BOEM-mark.png/"}) {
      childImageSharp {
        gatsbyImageData(
          layout: CONSTRAINED
        )
      }
    }
  }
  `)
  if (!data.file.childImageSharp.gatsbyImageData) {
    console.warn('BOEM-mark.png did not load from graphql')
    return <></>
  }
  return (
    <>
      {data.file.childImageSharp.gatsbyImageData &&
        <GatsbyImage image={data.file.childImageSharp.gatsbyImageData} alt={alt || 'Bureau of Ocean Energy Management (B O E M) logo'} {...rest} />
      }
    </>
  )
}
