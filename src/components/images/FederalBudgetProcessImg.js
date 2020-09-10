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
      imageSharp(fixed: {originalName: {eq: "federal-budget-process.png"}}) {
        fixed(width: 440) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  `)
  // eslint-disable-next-line max-len
  return <Img fixed={data.imageSharp.fixed} alt={alt || 'Federal budget process. First, statute (federal statutes determine the maximum amount of funds that can be appropriated). Second, appropriation (Congress determines the amount that a given entity or agency will receive). Third, grant (recipient entities determine how much the funding will be allocated for use in their budgets). Finally, disbursement (recipient entities disburse funds over the course of the fiscal year for budgeted purposes).'} {...rest} />
}
