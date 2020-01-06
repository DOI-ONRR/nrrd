import React from 'react'
import SEO from '../components/seo'
import hastReactRenderer from '../js/hast-react-renderer'

const HowItWorksDefault = props => {
  const title = this.props.pageContext.markdown.frontmatter.title || 'Natural Resources Revenue Data'
  return (
    <Fragment>
      <SEO
        title={title}
        meta={[
          // title
          { name: 'og:title', content: title },
          { name: 'twitter:title', content: title },
        ]}

      />
      {hastReactRenderer(this.props.pageContext.markdown.htmlAst)}
    </Fragment>
  )
}

export default HowItWorksDefault