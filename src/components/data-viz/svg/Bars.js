import React, { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'

import Bar from './Bar'

const Bars = ({
  data,
  height,
  width,
  xScale,
  yScale,
  colorScale,
  chartTooltip,
  onHover,
  handleBarHover,
  handleBarData,
  showTooltips,
  isClickable,
  horizontal = false,
  maxBarSize,
  barOffsetX,
  xDomain,
  selectedIndex,
  legendHeaders,
  ...rest
}) => {
  // console.log('Bars data: ', data)
  const barsRef = useRef(null)
  const barGroupRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(selectedIndex)
  const [currentIndex, setCurrentIndex] = useState(selectedIndex)

  // generate unique key
  const generateKey = pre => {
    return `${ pre }_${ new Date().getTime() }`
  }

  // handle bar active states
  const handleBarSelection = (hover, index) => {
    if (hover === true) {
      d3.selectAll('.bars .bar').filter((d, i, nodes) => {
        if (i === index) {
          const selectedElement = d3.selectAll('.bars .active')
          selectedElement.attr('class', 'bar')
        }
        d3.select(nodes[index])
          .attr('selected', true)
          .attr('class', 'bar active')
      })
    }
    else {
      d3.selectAll('.bars .bar').filter((d, i, nodes) => {
        // console.log('hover false nodes: ', nodes)
        const selectedElement = d3.selectAll('.bars .active')
        if (selectedElement) {
          selectedElement.attr('selected', false)
          selectedElement.attr('class', 'bar')
        }
        d3.select(nodes[activeIndex])
          .attr('selected', true)
          .attr('class', 'bar active')
      })
    }
  }

  // event handlers
  const handleOnClick = (d, i) => {
    // console.log('bars handleOnclick i: ', i)
    const dArr = [d, i, xDomain()[i]]
    handleBarSelection(true, i)
    setActiveIndex(i)
    handleBarHover(dArr)
    handleBarData(dArr)
  }

  const handleMouseEnter = (d, i) => {
    const dArr = [d, i, xDomain()[i]]
    handleBarSelection(true, i)
    setCurrentIndex(i)
    handleBarHover(dArr)
    handleBarData(dArr)
  }

  const handleMouseLeave = (d, i) => {
    const dArr = [d, i, xDomain()[i]]
    handleBarSelection(false)
    setActiveIndex(activeIndex)
    setCurrentIndex(activeIndex)
    handleBarHover(dArr)
    handleBarData(dArr)
  }

  useEffect(() => {
    if (data && data.length > 0 && !horizontal) handleOnClick(data[activeIndex][0][0].data, activeIndex)
  }, [data, activeIndex])

  // console.log('bars data: ', data)

  const bars = horizontal
    ? data.map((d, i) => (
      <Bar
        key={`hbar__${ i }`}
        data={d}
        x={xScale(d[0][0]) || 0}
        y={yScale(d[0][1]) || 0}
        height={yScale.bandwidth()}
        width={xScale(d[0][1]) - xScale(d[0][0]) || 0}
        fill={colorScale(i)}
        chartTooltip={chartTooltip}
        onHover={onHover}
        showTooltips={showTooltips}
        isClickable={isClickable}
        onHover={onHover}
        { ...rest }
      />
    ))
    : data.map((item, index) => {
      const domain = xDomain()
      // console.log('data.map item, i: ', item, i)
      return (
        <g
          key={`bar__${ index }`}
          className={`${ (index === activeIndex) ? 'bar active' : 'bar' }`}
          transform={`translate(${ xScale(domain[index]) }, 0)`}
          tabIndex={index}
          ref={barGroupRef}
          pointerEvents="none"
          onMouseEnter={() => handleMouseEnter(data[index][0][0].data, index)}
          onMouseLeave={() => handleMouseLeave(data[activeIndex][0][0].data, activeIndex)}
          onClick={() => handleOnClick(data[activeIndex][0][0].data, index)}>
          { item.map((d, i) => (
            <Bar
              key={`sbar_bar__${ generateKey(i) }`}
              pointerEvents="all"
              data={(d.index === 0) ? d[0].data : undefined}
              selectedData={data[currentIndex][0][0].data}
              barIndexes={[activeIndex, currentIndex]}
              x={barOffsetX()}
              y={yScale(d[0][1]) || 0}
              height={yScale(d[0][0]) - yScale(d[0][1]) || 0}
              width={maxBarSize()}
              fill={colorScale(i)}
              chartTooltip={chartTooltip}
              showTooltips={showTooltips}
              isClickable={isClickable}
              legendHeaders={legendHeaders}
              tabIndex={i}
              { ...rest }
            />
          ))
          }
        </g>
      )
    })

  return (
    <g className="bars" ref={barsRef}>
      {bars}
    </g>
  )
}

export default Bars
