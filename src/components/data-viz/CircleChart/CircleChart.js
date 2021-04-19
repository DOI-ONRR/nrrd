import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'
import { Grid } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'

import { Legend } from '../Legend'
import Circles from '../svg/Circles'
import CircleLabel from '../svg/CircleLabel'

/**
 * Circle charts provide  a way to visualize hierarchically structured data.
 *
 * An example exists in the “Compare revenue” section in [Explore data](https://revenuedata.doi.gov/explore?dataType=Revenue&location=NF&mapLevel=State&offshoreRegions=false&period=Calendar%20Year&year=2019#top-nationwide-locations).
 */
const CircleChart = ({ data, legendHeaders, legendPosition = 'bottom', showLabels = true, showTooltips = true, ...options }) => {
  // console.log('CircleChart: ', options)
  const [activeNode, setActiveNode] = useState({
    key: ''
  })
  const ccRef = useRef()

  // sizing
  const width = options.width || 500
  const height = options.height || 500
  const theme = useTheme()

  // color range
  const colorRange = options.colorRange || [
    theme.palette.explore[700],
    theme.palette.explore[600],
    theme.palette.explore[500],
    theme.palette.explore[400],
    theme.palette.explore[300],
    theme.palette.explore[200],
    theme.palette.explore[100]
  ]

  const minColor = options.minColor || 'lightblue'
  const maxColor = options.maxColor || 'darkblue'

  const maxCircles = options.maxCircles - 1 || 6
  const yAxis = options.yAxis
  const xAxis = options.xAxis

  const format = options.labelFormat || function () {
    console.debug('format func')
  }

  const legendFormat = options.legendFormat || function () {
    console.debug('format func')
  }

  const legendLabel = options.legendLabel || function (d) {
    return d
  }

  const chartTooltip = options.chartTooltip || function (d) {
    return [d.data[xAxis], d.data[yAxis]]
  }

  const circleLabel = options.circleLabel || function (d) {
    return [d.data[xAxis], d.data[yAxis]]
  }

  // roll up other dat
  const rollUpOther = data => {
    console.log('rollUpOther data: ', data)
    try {
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
        console.debug('OTHER :', o)
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

  // dataset, root data
  const [otherDataSet, setOtherDataSet] = useState([])
  useEffect(() => {
    const dataset = rollUpOther(data)
    setOtherDataSet(dataset)
  }, [data])

  const root = pack({ name: 'root', children: otherDataSet })

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

  const color = () => {
    const domain = d3.min([yDomain().length, maxCircles])
    const colorScale = colorRange
      ? d3.scaleOrdinal().domain(yDomain().length + 1).range(colorRange)
      : d3.scaleLinear().domain([-1, domain]).range([minColor, maxColor])
    return colorScale
  }

  // color scale
  const colorScale = color()

  const onHover = d => {
    console.log('CC handleOnHover: ', d)
    if (d && d.data) {
      setActiveNode({ ...activeNode, key: d.data[xAxis] })
    }
    else {
      setActiveNode({ ...activeNode, key: '' })
    }
  }

  return (
    <>
      {(legendPosition === 'right') &&
        <Grid container spacing={3}>
          <Grid item xs={7}>
            <svg viewBox={`${ -width * 0.5 } ${ -height * 0.5 } ${ width } ${ height }`} ref={ccRef}>
              <Circles
                data={root.descendants()}
                width={width}
                height={height}
                colorScale={colorScale}
                onHover={onHover}
                showTooltips={showTooltips}
                chartTooltip={chartTooltip}
              />
              {showLabels &&
                <CircleLabel
                  data={root.descendants()}
                  width={width}
                  height={height}
                  onHover={onHover}
                  xAxis={xAxis}
                  yAxis={yAxis}
                  circleLabel={circleLabel}
                />
              }
            </svg>
          </Grid>
          <Grid item xs={5}>
            <Legend
              data={otherDataSet}
              activeNode={activeNode}
              legendHeaders={legendHeaders}
              legendFormat={legendFormat}
              legendLabel={legendLabel}
              legendType={'circle'}
              xAxis={xAxis}
              yAxis={yAxis}
              colorScale={colorScale}
            />
          </Grid>
        </Grid>
      }
      {(legendPosition === 'bottom') &&
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <svg viewBox={`${ -width * 0.5 } ${ -height * 0.5 } ${ 500 } ${ 500 }`} ref={ccRef}>
              <Circles
                data={root.descendants()}
                width={width}
                height={height}
                colorScale={colorScale}
                onHover={onHover}
                showTooltips={showTooltips}
                chartTooltip={chartTooltip}
              />
              {showLabels &&
                <CircleLabel
                  data={root.descendants()}
                  width={width}
                  height={height}
                  onHover={onHover}
                  xAxis={xAxis}
                  yAxis={yAxis}
                  circleLabel={circleLabel}
                />
              }
            </svg>
          </Grid>
          <Grid item xs={12}>
            <Legend
              data={otherDataSet}
              activeNode={activeNode}
              legendHeaders={legendHeaders}
              legendFormat={legendFormat}
              legendLabel={legendLabel}
              legendType={'circle'}
              xAxis={xAxis}
              yAxis={yAxis}
              colorScale={colorScale}
            />
          </Grid>
        </Grid>
      }
    </>
  )
}

export default CircleChart
