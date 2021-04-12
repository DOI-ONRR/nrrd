import React, { useRef, useLayoutEffect } from 'react'
import * as d3 from 'd3'

export const LeftAxis = ({ scale, width }) => {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const [start, end] = d3.extent(scale.range())
    if (start == null || end == null) {
      return
    }
    const pxPerTick = 30
    const tickCount = Math.ceil((end - start) / pxPerTick)
    const axisGenerator = d3.axisLeft(scale)
    axisGenerator.ticks(tickCount)

    const host = d3.select(ref.current)
    host.select('g').remove()
    const group = host.append('g')
    // the upper-right corner of a d3 left axis sits at (0, 0), so
    // we need to position that at the right edge of our axis 'box'
    group.attr('transform', `translate(${ width }, 0)`)
    group.call(axisGenerator)
  }, [scale, width])

  return (
    <g className='axis left' ref={ref} />
  )
}

export const BottomAxis = ({ scale, width }) => {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const [start, end] = d3.extent(scale.range())
    if (start == null || end == null) {
      return
    }
    const pxPerTick = 200
    const tickCount = Math.ceil((end - start) / pxPerTick)
    const axisGenerator = d3.axisBottom(scale)
    axisGenerator.ticks(tickCount)

    const host = d3.select(ref.current)
    host.select('g').remove()
    const group = host.append('g')
    group.call(axisGenerator)
  }, [scale, width])

  return (
    <g className='axis bottom' ref={ref} />
  )
}
