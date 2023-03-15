import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

export default ({ alt, ...rest }) => {
  const data = useStaticQuery(graphql`
  query {
      file(relativePath: {regex: "/AML_OSMREmap.png/"}) {
        childImageSharp {
          gatsbyImageData(
            layout: FIXED
            width: 551
          )
        }
      }
    }
  `)
  if (!data.file.childImageSharp.gatsbyImageData) {
    console.warn('AML_OSMREmap.png did not load from graphql')
    return <></>
  }

  return (
    <>
      {data.file.chileImageSharp.gatsbyImageData &&
      <GatsbyImage image={data.file.childImageSharp.gatsbyImageData} alt={alt || 'Office of Surface Mining Reclamation and Enforcement\'s data site.'} {...rest} />
      }
    </>
  )
}
