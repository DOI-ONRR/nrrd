import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

export default ({ alt, ...rest }) => {
  const data = useStaticQuery(graphql`
  query {
    file(relativePath: {eq: "federal-budget-process.png"}) {
      childImageSharp {
        gatsbyImageData(
          layout: CONSTRAINED
        )
      }
    }
  }
  `)
  if (!data.file.childImageSharp.gatsbyImageData) {
    console.warn('federal-budget-process.png did not load from graphql')
    return <></>
  }

  return (
    <>
      {data.file.childImageSharp.gatsbyImageData &&
      // eslint-disable-next-line max-len
      <GatsbyImage image={data.file.childImageSharp.gatsbyImageData} alt={alt || 'Federal budget process. First, statute (federal statutes determine the maximum amount of funds that can be appropriated). Second, appropriation (Congress determines the amount that a given entity or agency will receive). Third, grant (recipient entities determine how much the funding will be allocated for use in their budgets). Finally, disbursement (recipient entities disburse funds over the course of the fiscal year for budgeted purposes).'} {...rest} />
      }
    </>
  )
}
