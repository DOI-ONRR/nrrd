import React from 'react'
import PropTypes from 'prop-types'

/**
 * This is to display
 */
const Arrow = ({ vertical, withArrow, ...restProps }) => {
  const height = restProps.height || 20
  const length = restProps.length || 150
  const triangleStartPoint = (length / 2) - (height / 2)
  const trianglePoints = `${ triangleStartPoint }, 0, ${ triangleStartPoint + height }, ${ height / 2 }, ${ triangleStartPoint }, ${ height }`

  const HorizontalArrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={length} height={ height }>
      <line x1="0" y1={height / 2} x2={length} y2={height / 2} stroke="black" stroke-width="4"/>
      <polygon points={trianglePoints} />
    </svg>
  )

  const HorizontalLine = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={length} height="4">
      <line x1="0" y1={4 / 2} x2={length} y2={4 / 2} stroke="black" stroke-width="4"/>
    </svg>
  )

  const VerticalArrow = () => {
    const height = restProps.height || 20
    const length = restProps.length || 150
    const triangleStartPoint = (length / 2) - (height / 2)
    const trianglePoints = `0, ${ triangleStartPoint }, ${ height / 2 }, ${ triangleStartPoint + height }, ${ height }, ${ triangleStartPoint }`
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={height} height={length} style={{ margin: '0 auto', display: 'block' }}>
        <line x1={height / 2} y1="0" x2={height / 2} y2={length} stroke="black" stroke-width="4"/>
        <polygon points={trianglePoints} />
      </svg>
    )
  }

  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {vertical
        ? < VerticalArrow />
        : <>
          {withArrow
            ? < HorizontalArrow />
            : < HorizontalLine />
          }
        </>
      }
    </div>
  )
}

export default Arrow

Arrow.propTypes = {
  /** Specify if there should be an wrrow in the middle of the line */
  withArrow: PropTypes.bool,
}

Arrow.defaultProps = {
  withArrow: true
}
