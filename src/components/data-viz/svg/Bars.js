import React from 'react'
import Bar from './Bar'

const Bars = ({ data, height, width, xScale, yScale, colorScale, chartTooltip, onHover, showTooltips, isClickable, ...rest }) => {
  console.log('Bars data: ', data)

  const bars = data.map((d, i) => (
    <Bar
      key={`bar__${ i }`}
      data={d}
      x={xScale(d[0][0]) || 0}
      y={yScale(d[0][1]) || 0}
      height={yScale.bandwidth()}
      width={(xScale(d[0][1]) - xScale(d[0][0])) || 0}
      fill={colorScale(i)}
      chartTooltip={chartTooltip}
      onHover={onHover}
      showTooltips={showTooltips}
      isClickable={isClickable}
      { ...rest }
    />
  ))

  return (
    <g className="bars">
      {bars}
    </g>
  )
}

export default Bars
