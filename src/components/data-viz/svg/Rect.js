import React from 'react'
import PropTypes from 'prop-types'

export const Rect = ({
  width = 'auto',
  height = 'auto',
  x = 0,
  y = 0,
  styles
}) => {
  return (
    <svg width={width} height={height} style={styles}>
      <rect
        className="rect"
        width={width}
        height={height}
        x={x}
        y={y}
        style={styles} />
    </svg>
  )
}

Rect.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}
