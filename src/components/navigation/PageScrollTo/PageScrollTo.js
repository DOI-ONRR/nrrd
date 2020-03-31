import React from 'React'
import PropTypes from 'prop-types'

import { AnchorLink } from 'gatsby-plugin-anchor-links'

import {
  Box
} from '@material-ui/core'

const PageScrollTo = props => {
  return (
    <>
      <Box>PageScrollTo component yo!</Box>
    </>
  )
}

export default PageScrollTo

PageScrollTo.propTypes = {
  // Main menu items
  menuItems: PropTypes.array.isRequired
}
