import React from 'react'
import PropTypes from 'prop-types'

import Circle from './Circle'
import Translate from './Translate'

const Circles = ({ data, width, height, colorScale, onHover, showTooltips, chartTooltip, ...rest }) => {
  const k = width / (data[0].r * 2)

  const circles = data.map((d, i) => (
    <Translate
      key={`translate__${ i }`}
      x={(d.x - data[0].x) * k}
      y={(d.y - data[0].y) * k}
    >
      <Circle
        key={`circle__${ i }`}
        data={d}
        r={d.r * k}
        fill={(i === 0) ? '#f5f5f5' : colorScale(i + 1)}
        isClickable={(i !== 0)}
        showTooltips={(i !== 0 && showTooltips)}
        onHover={onHover}
        chartTooltip={chartTooltip}
        { ...rest } />
    </Translate>
  ))

  return (
    <g className="circle-group">
      {circles}
    </g>
  )
}

export default Circles

// propTypes
Circles.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.func]),
}
