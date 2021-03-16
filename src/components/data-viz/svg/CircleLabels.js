import React from 'react'

import { Translate } from './Translate'
import { Label } from './Label'

export const CircleLabels = ({ data, root, width, height, xAxis, yAxis, colorScale, onHover, format, ...rest }) => {
  const k = width / (root[0].r * 2)

  const getDataStr = (d, axis) => {
    const calcStrLength = (d.r / 4)
    let dataStr
    if (axis === xAxis) {
      const strLength = (d.data[axis] !== undefined) ? d.data[axis].length : ''
      const str = (d.data[axis] !== undefined) ? d.data[axis].substring(0, calcStrLength) : ''
      dataStr = (calcStrLength > strLength) ? str : `${ str }...`
    }
    else {
      dataStr = format(d.data[axis])
    }

    return dataStr
  }

  const xLabels = root.map((d, i) => (
    <Translate
      x={(d.x - root[0].x) * k}
      y={(d.y - root[0].y) * k}
    >
      {i !== 0 &&
      <Label
        key={`xLabel__${ i }`}
        data={getDataStr(d, xAxis)}
        className="text"
        fill={'white'}
        fontSize={`${ Math.round(d.r / 6) }px`}
        isClickable={(i !== 0)}
        showTooltip={(i !== 0)}
        onHover={onHover}
        format={format} />
      }
    </Translate>
  ))

  const yLabels = root.map((d, i) => (
    <Translate
      x={(d.x - root[0].x) * k}
      y={(d.y - root[0].y) * k + d.r / 5}
    >
      {i !== 0 &&
      <Label
        key={`yLabel__${ i }`}
        data={getDataStr(d, yAxis)}
        className="text"
        fill={'white'}
        fontSize={`${ Math.round(d.r / 6) }px`}
        isClickable={(i !== 0)}
        showTooltip={(i !== 0)}
        onHover={onHover}
        format={format} />
      }
    </Translate>
  ))

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
