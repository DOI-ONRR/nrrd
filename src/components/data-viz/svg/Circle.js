import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { ChartTooltip } from '../ChartTooltip'

const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',
    '&:hover': {
      stroke: 'black',
      strokeWidth: 4
    }
  }
}))

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

const Circle = ({ data, r, fill, isClickable, showTooltips, onHover, chartTooltip, ...rest }) => {
  // console.log('Circle data: ', data, rest)
  const [isActive, setIsActive] = useState(undefined)
  const classes = useStyles()

  const handleMouseEnter = () => {
    setIsActive(true)
    onHover(data)
  }

  const handleMouseLeave = () => {
    setIsActive(false)
    onHover(undefined)
  }

  return (
    <>
      {
        <WithTooltip
          showTooltips={showTooltips}
          chartTooltip={chartTooltip}
          circleIsActive={isActive}
          data={data}>
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

export default Circle

// propTypes
Circle.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  transform: PropTypes.string
}
