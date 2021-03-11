import React, { useState } from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'
import { useTheme } from '@material-ui/core/styles'

import Legend from '../Legend'
import { Circles } from '../svg/Circles'
import { Translate } from '../svg/Translate'

export const CircleChart2 = ({ data, key, ...options }) => {
  console.log('CircleChart2: ', CircleChart2)
  const [activeNode, setActiveNode] = useState(null)

  // sizing
  const width = 500
  const height = 500
  const theme = useTheme()

  // color range
  const colorRange = options.colorRange || [
    theme.palette.explore[600],
    theme.palette.explore[500],
    theme.palette.explore[400],
    theme.palette.explore[300],
    theme.palette.explore[200],
    theme.palette.explore[100]
  ]

  const maxCircles = options.maxCircles - 1
  const yAxis = options.yAxis
  const xAxis = options.xAxis

  // roll up other data
  const rollUpOther = data => {
    try {
      // console.debug('-------------------------------------------------------------',data)
      if (maxCircles + 1 < data.length) {
        const tmp = data
        const other = tmp.reduce((sum, row, i) => {
          // console.debug("maxcircles: ",sum,row,i)
          if (i + 1 >= maxCircles) {
            return sum + row[yAxis] || 0
          }
        }, 0)
        // console.debug(other)
        const o = data[maxCircles]
        data = data.filter((row, i) => i < maxCircles)
        o[xAxis] = 'Other'
        o[yAxis] = other
        data.push(o)
        // console.debug("OTHER :", o);
      }

      return data
    }
    catch (err) {
      console.warn('Errror: ', err)
    }
  }

  // hierarchy
  const hierarchy = data => {
    try {
      const r = d3.hierarchy(data)
        .sum(d => d[yAxis])
        .sort((a, b) => b[yAxis] - a[yAxis])
      // console.debug(r)
      return r
    }
    catch (err) {
      console.warn('Errror: ', err)
    }
  }

  // pack
  const pack = data => {
    try {
      const r = d3.pack()
        .size([width - 2, height - 2])
        .padding(3)(hierarchy(data))
      return r
    }
    catch (err) {
      console.warn('Errror: ', err)
    }
  }

  const dataset = rollUpOther(data)
  const root = pack({ name: 'root', children: dataset })

  // xDomain
  const xDomain = () => {
    try {
      const r = data.map((row, i) => {
        return row[xAxis]
      })
      const domain = [...(new Set(r.sort((a, b) => a - b)))]
      return domain
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  // yDomain
  const yDomain = () => {
    try {
      const r = d3.nest()
        .key(k => k[xAxis])
        .rollup(v => d3.sum(v, i => i[yAxis]))
        .entries(data)
        .map(y => y.value)
      const domain = [...(new Set(r.sort((a, b) => a - b)))]
      return domain
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  // color scale
  const colorScale = d3.scaleOrdinal()
    .range(colorRange)

  const onHover = d => {
    console.log('handleOnHover: ', d)
    setActiveNode(d)
  }

  return (
    <>
      <svg width="100%" height="300" viewBox={`${ -width * 0.5 } ${ -height * 0.5 } ${ width } ${ height }`}>
        <Circles
          key={`circles__${ key }`}
          data={xDomain}
          root={root.descendants()}
          width={width}
          height={height}
          colorScale={colorScale}
          domains={[xDomain, yDomain]}
          onHover={onHover}
        />
      </svg>
      <Legend
        data={data}
        activeNode={activeNode}
      />
    </>
  )
}
