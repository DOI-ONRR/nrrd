import React from 'react'
import PropTypes from 'prop-types'

const Rect = ({
  width = 'auto',
  height = 'auto',
  x = 0,
  y = 0,
  styles,
  title
}) => {
  return (
    <svg width={width} height={height} style={styles} title={title} aria-hidden="true">
      <title>{title}</title>
      <rect
        className="rect"
        width={width}
        height={height}
        x={x}
        y={y}
        style={styles}/>
    </svg>
  )
}

export default Rect

Rect.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string
}
