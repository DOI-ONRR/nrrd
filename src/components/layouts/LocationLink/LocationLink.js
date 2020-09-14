import React from 'react'
import PropTypes from 'prop-types'

import Link from '../../../components/Link'

const LocationLink = props => {
  const { linkTitle, linkUrl } = props
  return (
    <Link
      href={linkUrl}
      linkType="Location"
      mt={1}>
      {linkTitle}
    </Link>
  )
}

LocationLink.propTypes = {
  linkTitle: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
}

export default LocationLink
