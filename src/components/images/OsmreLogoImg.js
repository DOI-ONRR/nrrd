import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
/*
 * This component is built using `gatsby-image` to automatically serve optimized
 * images with lazy loading and reduced file sizes. The image is loaded using a
 * `useStaticQuery`, which allows us to load the image from directly within this
 * component, rather than having to pass the image data down from pages.
 *
 * For more information, see the docs:
 * - `gatsby-image`: https://gatsby.dev/gatsby-image
 * - `useStaticQuery`: https://www.gatsbyjs.org/docs/use-static-query/
 */

export default ({ alt, ...rest }) => {
  const data = useStaticQuery(graphql`
  query {
      imageSharp(fluid: {originalName: {eq: "OSMRE-mark.png"}}) {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
  `)
  if (!data.imageSharp) {
    console.warn('OSMRE-mark.png did not load from graphql')
    return <></>
  }
  return (
    <>
      {data.imageSharp.fluid &&
        <Img fluid={data.imageSharp.fluid} alt={alt || 'Office of Surface Mining Reclamation and Enforcement (O S M R E) logo. U.S. Department of the Interior'}
          {...rest} />
      }
    </>
  )
}
