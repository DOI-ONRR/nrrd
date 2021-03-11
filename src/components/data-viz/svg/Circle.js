import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { ChartTooltip } from './ChartTooltip'

export const Circle = ({ key, data, transform, r, fill, isClickable, showTooltip, onHover, ...rest }) => {
  console.log('Circle data: ', data)
  const [circleIsActive, setCircleIsActive] = useState(false)

  const styles = {
    default: {
      cursor: 'pointer',
    },
    onHover: {
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
        showTooltip
          ? <ChartTooltip
            open={circleIsActive}
            data={data}>
            <circle
              key={`c__${ key }`}
              data={data}
              transform={transform}
              r={r}
              fill={fill}
              style={circleIsActive ? styles.onHover : styles.default}
              className={circleIsActive ? 'circle active' : 'circle'}
              onMouseEnter={() => onMouseEnter()}
              onMouseLeave={() => onMouseLeave()}
            />
          </ChartTooltip>
          : <circle
            key={`c__${ key }`}
            data={data}
            transform={transform}
            r={r}
            fill={fill}
            style={isClickable ? { cursor: 'pointer' } : {}}
          />
      }
    </>
  )
}

// propTypes
Circle.propTypes = {
  data: PropTypes.array.isRequired,
  transform: PropTypes.string
}
