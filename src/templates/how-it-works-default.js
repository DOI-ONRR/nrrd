import React from 'react'
import SEO from '../components/seo'

import DefaultLayout from '../components/layouts/DefaultLayout'


const HowItWorksDefault = () => {
  return (
    <DefaultLayout>
      <div>
        <SEO
          title={title}
          meta={[
            // title
            { name: 'og:title', content: title },
            { name: 'twitter:title', content: title },
          ]}

        />
        {hastReactRenderer(this.props.pageContext.markdown.htmlAst)}
      </div>
    </DefaultLayout>
  )
}

export default HowItWorksDefault