import React from 'react'
import { Circle } from './Circle'

export const Circles = ({ data, root, width, height, colorScale, onHover, ...rest }) => {
  console.log('Circles root: ', root)

  // fill, transform, radius, circles, circle, and g
  const k = width / (root[0].r * 2)

  const circles = root.map((d, i) => (
    <Circle
      key={`circle__${ i }`}
      data={d}
      className="circle"
      transform={`translate(${ (d.x - root[0].x) * k },${ (d.y - root[0].y) * k })`}
      r={d.r * k}
      fill={(i === 0) ? '#f5f5f5' : colorScale(i)}
      isClickable={(i !== 0)}
      showTooltip={(i !== 0)}
      onHover={onHover} />
  ))

  return (
    <g className="circle-group">
      {circles}
    </g>
  )
}
