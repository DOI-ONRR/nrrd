import React, { useRef, useLayoutEffect, useState } from 'react'
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
  showTooltips,
  isClickable,
  horizontal,
  maxBarSize,
  barOffsetX,
  xDomain,
  selectedIndex,
  legendHeaders,
  ...rest
}) => {
  // console.log('Bars data: ', data)
  const barsRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(selectedIndex)
  const [currentIndex, setCurrentIndex] = useState(selectedIndex)

  const generateKey = pre => {
    return `${ pre }_${ new Date().getTime() }`
  }

  // const handleMouseEnter = () => {
  //   setCurrentIndex(currentIndex)
  // }

  // const handleMouseLeave = () => {
  //   setActiveIndex(activeIndex)
  // }

  useLayoutEffect(() => {
    const handleBarHover = (hover, index) => {
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

    const bars = d3.select(barsRef.current).selectAll('.bar')
    bars
      .on('click', (d, i) => {
        setActiveIndex(i)
        handleBarHover(true, i)
      })
      .on('mouseover', (d, i) => {
        setCurrentIndex(i)
        handleBarHover(true, i)
      })
      .on('mouseout', (d, i) => {
        setActiveIndex(activeIndex)
        handleBarHover(false, activeIndex)
      })
  }, [data, activeIndex, currentIndex])

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
        { ...rest }
      />
    ))
    : data.map((item, i) => {
      const domain = xDomain()
      // console.log('data.map item, i: ', item, i)
      return (
        <g
          key={`bar__${ i }`}
          className={`${ (i === activeIndex) ? 'bar active' : 'bar' }`}
          transform={`translate(${ xScale(domain[i]) }, 0)`}>
          { item.map((d, i) => (
            // console.log('item.map d, i: ', d)
            <Bar
              key={`sbar_bar__${ generateKey(i) }`}
              data={(d.index === 0) ? d[0].data : undefined}
              selectedData={data[currentIndex][0][0].data}
              barIndexes={[activeIndex, currentIndex]}
              x={barOffsetX()}
              y={yScale(d[0][1]) || 0}
              height={yScale(d[0][0]) - yScale(d[0][1]) || 0}
              width={maxBarSize()}
              fill={colorScale(i)}
              chartTooltip={chartTooltip}
              onHover={onHover}
              showTooltips={showTooltips}
              isClickable={isClickable}
              legendHeaders={legendHeaders}
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
