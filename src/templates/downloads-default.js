import React from 'react'
import { useStaticQuery } from 'gatsby'
import SEO from '../components/seo'

import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import DefaultLayout from '../components/layouts/DefaultLayout'

// import hastReactRenderer from '../js/hast-react-renderer'


const useStyles = makeStyles(theme => ({
  root: {},
  mainContent: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  }
}))


const DownloadsTemplate = props => {
  const classes = useStyles()
  let title = props.pageContext.markdown.frontmatter.title || 'Natural Resources Revenue Data'

  console.log('props: ', props)

  // const data = useStaticQuery(graphql`
  //   query SiteContactQuery {
  //     site {
  //       siteMetadata {
  //         title
  //       }
  //     }
  //   }
  // `)

  return (
    <DefaultLayout>
      <main className={classes.mainContent}>
        <SEO
          title={title}
          meta={[
            // title
            { name: 'og:title', content: title },
            { name: 'twitter:title', content: title },
          ]}

        />
        <Container maxWidth="lg">
          <Grid container>
            <Grid item md={9}>
              <div dangerouslySetInnerHTML={{ __html: props.pageContext.markdown.htmlAst }} />
              {/* <p>Do you have questions about the data or need data that isn't here?

						    Contact our { CONTACT_INFO.data_retrieval.name } at <a href={'mailto:' + CONTACT_INFO.data_retrieval.email}>{CONTACT_INFO.data_retrieval.email }</a>.</p> */}
            </Grid>
            <Grid item md={3}>
              Side Menu
            </Grid>
          </Grid>
        </Container>
      </main>
    </DefaultLayout>
  )
}

export default DownloadsTemplate