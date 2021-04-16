import React, { useRef, useLayoutEffect } from 'react'
import * as d3 from 'd3'

export const LeftAxis = ({ yScale, width }) => {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const [start, end] = d3.extent(yScale.range())
    if (start == null || end == null) {
      return
    }
    const pxPerTick = 30
    const tickCount = Math.ceil((end - start) / pxPerTick)
    const createYAxis = () => (d3.axisLeft(yScale).ticks(3).tickSize(0).tickFormat(d => {
      if (d > 1000000000) {
        return `${ d / 1000000000 }B`
      }
      else if (d >= 1000000 && d < 1000000000) {
        return `${ d / 1000000 }M`
      }
      else if (d < 1000000 && d >= 1000) {
        return `${ d / 1000 }K`
      }
      else if (d < 1000 && d >= 0) {
        return `${ d / 100 }`
      }
      else if (d > -1000 && d < 0) {
        return `${ d / 100 }`
      }
      else if (d <= -1000 && d > -1000000) {
        return `${ d / 1000 }K`
      }
      else if (d <= -1000000 && d > -1000000000) {
        return `${ d / 1000000 }M`
      }
      else if (d > parseFloat(-1000000000)) {
        return `${ d / 1000000000 }B`
      }
    }))

    const host = d3.select(ref.current)
    host.select('g').remove()
    const group = host.append('g')
    // the upper-right corner of a d3 left axis sits at (0, 0), so
    // we need to position that at the right edge of our axis 'box'
    group.attr('transform', `translate(${ width }, 0)`)
    group.call(createYAxis())
      .selectAll('text')
      .style('font-size', '.95rem')
  }, [yScale, width])

  return (
    <g className='y-axis' ref={ref} />
  )
}

export const BottomAxis = ({ data, xScale, width, xGroups, xLabels, dimensions, activeIndex }) => {
  const xAxisRef = useRef(null)
  const xAxisGroupRef = useRef(null)

  useLayoutEffect(() => {
    const [start, end] = d3.extent(xScale.range())
    if (start == null || end == null) {
      return
    }
    const x = 0
    const y = 8
    const pxPerTick = 200
    const tickCount = Math.ceil((end - start) / pxPerTick)

    const axisGenerator = (d3.axisBottom(xScale).tickSize(0).tickFormat((d, i) => {
      return xLabels[i]
    }))
    axisGenerator.ticks(tickCount)

    const host = d3.select(xAxisRef.current)
    host.select('g').remove()

    const group = host.append('g')
    group.call(axisGenerator)
      .selectAll('text')
      .attr('x', x)
      .attr('y', y)
      .style('font-size', '1rem')
      .attr('font-weight', (d, i) => {
        return i === activeIndex ? 'bold' : 'normal'
      })
  }, [xScale, width, activeIndex])

  useLayoutEffect(() => {
    if (xGroups) {
      const xAxisLabels = d3.select(xAxisRef.current)
      const xAxisNode = xAxisLabels.node().getBBox()
      console.log('xAxisNode: ', xAxisNode)
      const groupLines = d3.select(xAxisGroupRef.current)
      const groupItemWidth = (dimensions.width / data.length)
      const padding = (xScale.bandwidth() * 0.2)
      let xPos = 0

      Object.keys(xGroups).sort().map((name, index) => {
        const groupLineWidth = xPos + (groupItemWidth * xGroups[name].length) - (padding + dimensions.margin.right)

        groupLines.append('line')
          .attr('x1', xPos + padding)
          .attr('x2', groupLineWidth - dimensions.margin.right)
          .attr('stroke', '#a7bcc7')
          .attr('stroke-width', 1)
          .attr('transform', `translate(0, ${ xAxisNode.height + 2 })`)

        groupLines.append('text')
          .attr('x', ((xPos + padding) / 2) + (groupLineWidth / 2))
          .attr('y', dimensions.margin.bottom + xAxisNode.height - padding)
          .attr('text-anchor', 'middle')
          .text(name)
          .style('font-weight', '400')

        xPos = groupLineWidth + padding
      })
    }
  }, [xGroups])

  return (
    <>
      <g className='x-axis' ref={xAxisRef} />
      <g className='x-axis-groups' ref={xAxisGroupRef} />
    </>
  )
}

export const CenterAxis = ({ xScale, yScale }) => {
  const centerAxisRef = useRef(null)
  useLayoutEffect(() => {
    const host = d3.select(centerAxisRef.current)

    const centerLine = () => d3.axisBottom(xScale)
      .tickSize(1)
      .tickFormat('')

    host.append('g')
      .attr('class', 'x-centerline')
      .attr('fill', '#bdbdbd')
      .attr('stroke-width', 1)
      .call(centerLine())
  }, [xScale])

  return (
    <g className='x-centerline' ref={centerAxisRef} />
  )
}
