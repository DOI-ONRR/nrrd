import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

export default ({ alt, ...rest }) => {
  const data = useStaticQuery(graphql`
  query {
    file(relativePath: {eq: "BSEE-mark.png"}) {
      childImageSharp {
        gatsbyImageData(
          layout: CONSTRAINED
        )
      }
    }
  }
  `)
  if (!data.file.childImageSharp.gatsbyImageData) {
    console.warn('BSEE-mark.png did not load from graphql')
    return <></>
  }
  return (
    <>
      {data.file.childImageSharp.gatsbyImageData &&
        <GatsbyImage image={data.file.childImageSharp.gatsbyImageData} alt={alt || 'Bureau of Safety and Environmental Enforcement (B S E E) logo'} {...rest} />
      }
    </>
  )
}
