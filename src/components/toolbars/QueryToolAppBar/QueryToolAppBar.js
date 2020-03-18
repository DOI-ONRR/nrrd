import React from 'react'
import PropTypes from 'prop-types'

const QueryToolAppBar = ({ title, ...props }) => {
  return (
    <div>{title}</div>
  )
}

QueryToolAppBar.PropTypes = {
  /** The string for the titel on the app bar. */
  title: PropTypes.string
}

QueryToolAppBar.defaultProps = {
  title: 'Data Query Tool',
}

export default QueryToolAppBar
