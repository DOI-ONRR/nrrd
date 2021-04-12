import React from 'react'

import Translate from './Translate'
import Label from './Label'

const CircleLabel = ({ data, width, height, xAxis, yAxis, colorScale, onHover, circleLabel, ...rest }) => {
  const k = width / (data[0].r * 2)

  const getDataStr = (d, key) => {
    const calcStrLength = (d.r / 4)
    const dataStr = []
    if (key[0]) {
      const strLength = (key[0] !== undefined) ? key[0].length : ''
      const str = (key[0] !== undefined) ? key[0].substring(0, calcStrLength) : ''
      dataStr[0] = (calcStrLength > strLength) ? str : `${ str }...`
    }
    if (key[1]) {
      dataStr[1] = key[1]
    }

    return dataStr
  }

  const xLabels = data.map((d, i) => {
    console.log('xLabels d: ', d)
    const xLabel = (i > 0) ? circleLabel(d) : ''
    return (
      <Translate
        x={(d.x - data[0].x) * k}
        y={(d.y - data[0].y) * k}
      >
        {i !== 0 &&
      <Label
        key={`xLabel__${ i }`}
        data={getDataStr(d, xLabel)[0]}
        className="text"
        fill={'white'}
        fontSize={`${ Math.round(d.r / 6) }px`}
        isClickable={(i !== 0)}
        showTooltip={(i !== 0)}
        onHover={onHover} />
        }
      </Translate>
    )
  })

  const yLabels = data.map((d, i) => {
    const yLabel = (i > 0) ? circleLabel(d) : ''
    return (
      <Translate
        x={(d.x - data[0].x) * k}
        y={(d.y - data[0].y) * k + d.r / 5}
      >
        {i !== 0 &&
      <Label
        key={`yLabel__${ i }`}
        data={getDataStr(d, yLabel)[1]}
        className="text"
        fill={'white'}
        fontSize={`${ Math.round(d.r / 6) }px`}
        isClickable={(i !== 0)}
        showTooltip={(i !== 0)}
        onHover={onHover} />
        }
      </Translate>
    )
  })

  return (
    <>
      <g pointer-events="none" text-anchor="middle" className="text-group">
        {xLabels}
      </g>
      <g pointer-events="none" text-anchor="middle" className="text-group">
        {yLabels}
      </g>
    </>
  )
}

export default CircleLabel
