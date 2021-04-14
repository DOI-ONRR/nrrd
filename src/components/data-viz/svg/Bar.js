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

const Bar = ({
  data,
  selectedData,
  barIndexes,
  x,
  y,
  width,
  height,
  fill,
  chartTooltip,
  onHover,
  showTooltips,
  isClickable,
  ...rest
}) => {
  // console.log('bar data: ', data)
  const [isActive, setIsActive] = useState(undefined)

  const handleMouseEnter = () => {
    setIsActive(true)
    if (typeof data !== 'undefined') onHover(selectedData, barIndexes[1])
  }

  const handleMouseLeave = () => {
    setIsActive(false)
    onHover(selectedData, barIndexes[0])
  }

  return (
    <WithTooltip
      showTooltips={showTooltips}
      chartTooltip={chartTooltip}
      circleIsActive={isActive}
      data={data}>
      <rect
        pointerEvents="all"
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
