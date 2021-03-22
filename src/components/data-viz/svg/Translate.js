
import React from 'react'

export const Translate = ({ x = 0, y = 0, children }) => {
  if (!x && !y) return children
  return (
    <g transform={`translate(${ x },${ y })`}>
      {children}
    </g>
  )
}
