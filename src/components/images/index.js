import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

import HowMainIconOilSvg from '-!svg-react-loader!../../images/how-it-works/how-main-icon-oil.svg'
import HowMainIconHardrockSvg from '-!svg-react-loader!../../images/how-it-works/how-main-icon-hardrock.svg'
import HowMainIconWindSvg from '-!svg-react-loader!../../images/how-it-works/how-main-icon-wind.svg'
import HowMainIconCoalSvg from '-!svg-react-loader!../../images/how-it-works/how-main-icon-coal.svg'
import HowItWorksRibbonGraphicSvg from '-!svg-react-loader!../../images/how-it-works/how-it-works-ribbon-graphic.svg'

export const HowMainIconOilImg = props => <HowMainIconOilSvg {...props} />
export const HowMainIconHardrockImg = props => <HowMainIconHardrockSvg {...props} />
export const HowMainIconWindImg = props => <HowMainIconWindSvg {...props} />
export const HowMainIconCoalImg = props => <HowMainIconCoalSvg {...props} />
export const HowItWorksRibbonGraphicImg = props => <HowItWorksRibbonGraphicSvg {...props} />

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

export const UsFlagImg = ({ alt, ...rest }) => {
  const data = useStaticQuery(graphql`
    query {
      imageSharp(fixed: {originalName: {eq: "us-flag-small.png"}}) {
        fixed(width: 16) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  `)
  return <Img fixed={data.imageSharp.fixed} alt={alt || 'US Flag'} {...rest} />
}

