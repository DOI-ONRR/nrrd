/* eslint-disable quotes */
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

const Sparkline = React.memo(props => {
  // console.log('Sparkline props: ', props)
  let data = [[0, 0]]
  let highlightIndex = 0
  let lineAnimationData

  if (props && props.data.length > 0) {
    data = props.data
    highlightIndex = props.highlightIndex
    lineAnimationData = data.slice(0, highlightIndex + 1)
  }

  const elemRef = useRef(null)
  const classes = useStyles()

  useEffect(() => {
    const width = 70
    const height = 20
    const margin = ({ top: 5, right: 5, bottom: 5, left: 5 })
    const x = d3.scaleLinear().range([margin.left, width - margin.right])
    const y = d3.scaleLinear().range([height - margin.bottom, margin.top])
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
    svg.append('title')
      .text('A simple line that shows the trend of dollars over a 20-year period. These lines often show fluctuations over this period.')
    svg.append('g')
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
  }, [])

  return (
    <div ref={elemRef}></div>
  )
})

export default Sparkline

const chartData = [
  ['2010', 4515762982.65],
  ['2011', 6049822215.65],
  ['2012', 6194230491.15],
  ['2013', 8250817981.41],
  ['2014', 80817981.41],
  ['2015', 82817981.41],
  ['2015', 4393132423.47],
  ['2016', 2201599585.83],
  ['2017', 2244876355.56],
  ['2018', 3201250255.47],
  ['2019', 4904041158.92]
]

Sparkline.Preview = {
  group: 'Data Visualizations',
  demos: [
    {
      title: 'Preview',
      code: "<Sparkline data={" + JSON.stringify(chartData) + "} />",
    }
  ]
}
