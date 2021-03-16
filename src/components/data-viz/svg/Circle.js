import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { ChartTooltip } from './ChartTooltip'

const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',
    '&:hover': {
      stroke: 'black',
      strokeWidth: 4
    }
  }
}))

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

export const Circle = ({ data, r, fill, isClickable, showTooltips, onHover, xAxis, yAxis, format, stroke, strokeWidth, ...rest }) => {
  // console.log('Circle data: ', data, rest)
  const [circleIsActive, setCircleIsActive] = useState(undefined)
  const classes = useStyles()

  const handleMouseEnter = () => {
    setCircleIsActive(true)
    onHover(data)
  }

  const handleMouseLeave = () => {
    setCircleIsActive(false)
    onHover(undefined)
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
            pointerEvents="all"
            r={r}
            fill={fill}
            className={isClickable ? classes.root : {}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
