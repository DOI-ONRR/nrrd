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
  onHover = d => d,
  showTooltips,
  isClickable,
  ...rest
}) => {
  // console.log('bar data: ', data)
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
        className={'rect'}
        style={isClickable ? { cursor: 'pointer' } : {}}
        x={x}
        y={y}
        height={height}
        width={width}
        fill={fill}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        { ...rest }
      />
    </WithTooltip>
  )
}

export default Bar
