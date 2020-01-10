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
import ContactUs from '../../content/ContactUs'
import PageToc from '../../navigation/PageToc'
import Container from '@material-ui/core/Container'

import React from 'react'
import PropTypes from 'prop-types'

const DownloadsLayout = ({ children }) => {
  return (
    <DefaultLayout>
      <Container maxWidth="lg">
        {children}
        <ContactUs />
        <PageToc scrollOffset={190}/>
      </Container>
    </DefaultLayout>
  )
}

DownloadsLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DownloadsLayout
