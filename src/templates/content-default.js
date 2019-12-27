import React, { Fragment } from 'react'
import SEO from '../components/seo'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import DefaultLayout from '../components/layouts/DefaultLayout'

const DefaultTemplate = props => {
  let title = props.pageContext.markdown.frontmatter.title || 'Natural Resources Revenue Data'

  return (
    <Fragment>
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
            <Box component="article">
              {hastReactRenderer(this.props.pageContext.markdown.htmlAst)}
            </Box>
          </Grid>
          <Grid item md={3}>
            <PageToc scrollOffset={190}/>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  )
}

export default DefaultTemplate