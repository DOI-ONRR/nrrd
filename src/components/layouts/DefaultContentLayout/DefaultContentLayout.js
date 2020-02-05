/**
 * Downloads Layout component is applied to all downloads pages in the downloads directory
 * unless specified by a page using the layout fronmatter property.
 *
 * This layout includes:
 * - DefaultLayout
 */

import DefaultLayout from '../DefaultLayout'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import React from 'react'
import PropTypes from 'prop-types'

const DefaultContentLayout = ({ children }) => {
  console.log("DefaultContentLayout")
  return (
    <DefaultLayout>
      <Container maxWidth="lg">
        {children}
      </Container>
    </DefaultLayout>
  )
}

DefaultContentLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DefaultContentLayout
