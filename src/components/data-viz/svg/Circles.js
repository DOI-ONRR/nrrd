import React from 'react'
import PropTypes from 'prop-types'

import { Circle } from './Circle'
import { Translate } from './Translate'

export const Circles = ({ data, root, width, height, colorScale, onHover, showTooltips, ...rest }) => {
  console.log('Circles root: ', root)

  const k = width / (root[0].r * 2)

  const circles = root.map((d, i) => (
    <Translate
      x={(d.x - root[0].x) * k}
      y={(d.y - root[0].y) * k}
    >
      <Circle
        key={`circle__${ i }`}
        data={d}
        className="circle"
        r={d.r * k}
        fill={(i === 0) ? '#f5f5f5' : colorScale(i)}
        isClickable={(i !== 0)}
        showTooltips={(i !== 0 && showTooltips)}
        onHover={onHover} />
    </Translate>
  ))

  return (
    <g className="circle-group">
      {circles}
    </g>
  )
}

// propTypes
Circles.propTypes = {
  data: PropTypes.array.isRequired,
}
