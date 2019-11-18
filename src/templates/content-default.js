import React from 'react'
import SEO from '../components/seo'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import DefaultLayout from '../components/layouts/DefaultLayout'

const DefaultTemplate = props => {
  let title = props.pageContext.markdown.frontmatter.title || 'Natural Resources Revenue Data'

  return (
    <DefaultLayout>
      <Container maxWidth="lg">
        <SEO
          title={title}
          meta={[
            // title
            { name: 'og:title', content: title },
            { name: 'twitter:title', content: title },
          ]}

        />
        <Grid container>
            <Grid item md={9}>
              <article className="container-left-9">
                {hastReactRenderer(this.props.pageContext.markdown.htmlAst)}
              </article>
            </Grid>
            <Grid item md={3}>
              <PageToc scrollOffset={190}/>
            </Grid>
          </Grid>
      </Container>
    </DefaultLayout>
  )
}

export default DefaultTemplate