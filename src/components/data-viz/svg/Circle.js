import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { ChartTooltip } from './ChartTooltip'

export const Circle = ({ key, data, r, fill, isClickable, showTooltips, onHover, ...rest }) => {
  // console.log('Circle data: ', data, rest)
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
        showTooltips
          ? <ChartTooltip
            open={circleIsActive}
            data={data}>
            <circle
              key={`c__${ key }`}
              data={data}
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
            r={r}
            fill={fill}
            style={styles.default}
            onMouseEnter={() => onMouseEnter()}
            onMouseLeave={() => onMouseLeave()}
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
