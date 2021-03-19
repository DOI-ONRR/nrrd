import React, { useState } from 'react'

import { ChartTooltip } from '../ChartTooltip'

const WithTooltip = ({ showTooltips, isActive, data, chartTooltip, children }) => (
  showTooltips
    ? <ChartTooltip
      open={isActive}
      data={data}
      chartTooltip={chartTooltip}>
      {children}
    </ChartTooltip>
    : children
)

const Bar = ({ key, data, x, y, width, height, fill, chartTooltip, onHover, showTooltips, isClickable, ...rest }) => {
  const [isActive, setIsActive] = useState(undefined)

  const handleMouseEnter = () => {
    setIsActive(true)
    onHover(data)
  }

  const handleMouseLeave = () => {
    setIsActive(false)
    onHover(undefined)
  }

  return (
    <WithTooltip
      showTooltips={showTooltips}
      chartTooltip={chartTooltip}
      circleIsActive={isActive}
      data={data}>
      <rect
        pointerEvents="all"
        aria-label={key}
        className={'rect'}
        style={isClickable ? { cursor: 'pointer' } : {}}
        x={x}
        y={y}
        height={height}
        width={width}
        // fillOpacity={fillOpacity}
        fill={fill}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        { ...rest }
      />
    </WithTooltip>
  )
}

export default Bar
