import React, { Fragment } from 'react'
import { graphql } from 'gatsby'
import SEO from '../components/seo'

import { makeStyles } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import DefaultLayout from '../components/layouts/DefaultLayout'
import { PageToc } from '../components/navigation/PageToc'
import hastReactRenderer from '../js/hast-react-renderer'


const useStyles = makeStyles(theme => ({
  root: {
    '& ul.list-unstyled': {
      listStyle: `none`,
      padding: 0,
      margin: 0
    },
    '& .list-sections li': {
      paddingBottom: `1.25em`
    }
  },
  mainContent: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  }
}))


const DownloadsTemplate = ( props ) => {

  const classes = useStyles()
  const data = props.data

  let title = props.pageContext.markdown.frontmatter.title || 'Natural Resources Revenue Data'

  return (
    <Fragment>
      <Box component="main" className={`${classes.root} ${classes.mainContent}`}>
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
            <Grid item xs={12} sm={3}>
              <PageToc scrollOffset={190}/>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Typography>
                {hastReactRenderer(props.pageContext.markdown.htmlAst)}
              </Typography>
              
              <Typography variant="body1">
                Do you have questions about the data or need data that isn't here? Contact our { data.site.siteMetadata.dataRetrieval.name } at <a href={'mailto:' + data.site.siteMetadata.dataRetrieval.email}>{data.site.siteMetadata.dataRetrieval.email }</a>.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fragment>
  )
}

export const query = graphql`
  query DownloadsPageQuery {
    site {
      siteMetadata {
        title
        dataRetrieval {
          name
          email
        }
        informationDataManagement {
          name
          street
          city
          zip 
          email
        }
      }
    }
  }
`

export default DownloadsTemplate