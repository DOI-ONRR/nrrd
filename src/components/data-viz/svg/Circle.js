import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { ChartTooltip } from './ChartTooltip'

const WithTooltip = ({ showTooltips, circleIsActive, data, xAxis, yAxis, format, children }) => (
  showTooltips
    ? <ChartTooltip
      open={circleIsActive}
      data={data}
      xAxis={xAxis}
      yAxis={yAxis}
      format={format}>
      {children}
    </ChartTooltip>
    : children
)

export const Circle = ({ data, r, fill, isClickable, showTooltips, onHover, xAxis, yAxis, format, ...rest }) => {
  // console.log('Circle data: ', data, rest)
  const [circleIsActive, setCircleIsActive] = useState(false)

  const styles = {
    default: {
      cursor: 'pointer',
    },
    active: {
      cursor: 'pointer',
      stroke: 'black',
      strokeWidth: 4
    }
  }

  const onMouseEnter = () => {
    setCircleIsActive(true)
    onHover(data)
  }

  const onMouseLeave = () => {
    setCircleIsActive(false)
    onHover(null)
  }

  return (
    <>
      {
        <WithTooltip
          showTooltips={showTooltips}
          circleIsActive={circleIsActive}
          data={data}
          xAxis={xAxis}
          yAxis={yAxis}
          format={format}>
          <circle
            data={data}
            r={r}
            fill={fill}
            style={(circleIsActive && isClickable) ? styles.active : styles.default}
            className={circleIsActive ? 'circle active' : 'circle'}
            onMouseEnter={() => onMouseEnter()}
            onMouseLeave={() => onMouseLeave()}
          />
        </WithTooltip>
      }
    </>
  )
}

// propTypes
Circle.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  transform: PropTypes.string
}
