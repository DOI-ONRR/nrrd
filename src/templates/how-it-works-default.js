import React from 'react'
import SEO from '../components/seo'

const HowItWorksDefault = () => {
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