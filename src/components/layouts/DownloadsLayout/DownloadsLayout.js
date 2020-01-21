/**
 * Downloads Layout component is applied to all downloads pages in the downloads directory
 * unless specified by a page using the layout fronmatter property.
 *
 * This layout includes:
 * - DefaultLayout
 * - TOC
 * - Contact Us
 */

import DefaultLayout from '../DefaultLayout'
import ContactUs from '../../content-partials/ContactUs'
import PageToc from '../../navigation/PageToc'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import React from 'react'
import PropTypes from 'prop-types'

const DownloadsLayout = ({ children }) => {
  return (
    <DefaultLayout>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12} sm={3}>
            <PageToc scrollOffset={190}/>
          </Grid>
          <Grid item xs={12} sm={9}>
            {children}
            <ContactUs />
          </Grid>
        </Grid>
      </Container>
    </DefaultLayout>
  )
}

DownloadsLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DownloadsLayout
