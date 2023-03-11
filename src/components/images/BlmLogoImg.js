import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

export default ({ alt, ...rest }) => {
  const data = useStaticQuery(graphql`
  query {
      file(relativePath: {eq: "BLM-mark.png"}) {
        childImageSharp {
          gatsbyImageData(
            layout: CONSTRAINED
          )
        }
      }
    }
  `)
  if (!data.file.childImageSharp.gatsbyImageData) {
    console.warn('BLM-mark.png did not load from graphql')
    return <></>
  }
  return (
    <>
      {data.file.childImageSharp.gatsbyImageData &&
        <GatsbyImage image={data.file.childImageSharp.gatsbyImageData} alt={alt || 'Bureau of Land Management (B L M) logo. U.S. Department of the Interior'} {...rest} />
      }
    </>
  )
}
