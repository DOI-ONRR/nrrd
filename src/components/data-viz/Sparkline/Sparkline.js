import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
// import styles from './Sparkline.module.scss'
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
  sparkline: {
    strokeWidth: '1px',
    stroke: '#5c737f',
    fill: 'none',
  },

  sparkcircle: {
    fill: theme.palette.grey['900']
  }

}))

const Sparkline = props => {
  let data = [[0, 0]]
  let highlightIndex = -1
  let lineAnimationData
  if (props.data.length > 0) {
    data = props.data
    highlightIndex = props.highlightIndex || props.data.length - 1
    lineAnimationData = data.slice(0, highlightIndex + 1)
  }

  const elemRef = useRef(null)
  const classes = useStyles()

  useEffect(() => {
    const width = 70
    const height = 20
    const x = d3.scaleLinear().range([0, width - 3])
    const y = d3.scaleLinear().range([height - 3, 0])
    const line = d3.line()
      .curve(d3.curveCardinal)
      .x(function (d) {
        return x(d[0])
      })
      .y(function (d) {
        return y(d[1])
      })

    x.domain(d3.extent(data, function (d) {
      return +d[0]
    }))
    y.domain(d3.extent(data, function (d) {
      return +d[1]
    }))

    d3.select(elemRef.current).selectAll('*').remove()

    const svg = d3.select(elemRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('height', (height + 2))
      .append('g')
      .attr('transform', 'translate(0, 2)')
    svg.append('path')
      .datum(data)
      .attr('class', classes.sparkline)
      .attr('d', line)

    if (highlightIndex >= 0) {
      svg.append('circle')
        .attr('class', classes.sparkcircle)
        .attr('cx', x(data[highlightIndex][0]))
        .attr('cy', y(data[highlightIndex][1]))
        .attr('r', 2.5)
    }

    const path = svg
      .append('path')
      .attr('d', line(lineAnimationData))
      .attr('stroke', '#424242')
      .attr('stroke-width', '2')
      .attr('fill', 'none')

    const totalLength = path.node().getTotalLength()

    path
      .attr('stroke-dasharray', `${ totalLength } ${ totalLength }`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)
  })

  return (
    <div ref={elemRef}></div>
  )
}

export default Sparkline
