import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'

import { Button, Collapse } from '@material-ui/core'
import { useTheme, createStyles, withStyles } from '@material-ui/core/styles'

import Translate from '../svg/Translate'
import { LeftAxis, BottomAxis } from '../svg/Axis'
import Bars from '../svg/Bars'
import { Legend } from '../Legend'

const LegendButton = withStyles(theme =>
  createStyles({
    root: {
      color: theme.palette.links.default,
      '& > span': {
        textDecoration: 'underline',
      }
    },
  })
)(Button)

const HorizontalStackedBarChart = ({
  data,
  ...options
}) => {
  const {
    legendHeaders,
    legendReverse,
    units,
    xAxis,
    yAxis,
    yGroupBy,
    yOrderBy,
    horizontal,
    showTooltips = true,
    collapsibleLegend,
    collapsedLegend
  } = options

  console.log('HorizontalStackedBarChart data: ', data)

  const theme = useTheme()
  const [dataset, setDataset] = useState({
    barData: [],
    legendData: []
  })
  const [activeNode, setActiveNode] = useState({
    key: ''
  })

  const [collapsed, setCollapsed] = useState(collapsedLegend || false)
  const buttonValue = collapsed ? 'Show details' : 'Hide details'

  const legendFormat = options.legendFormat || function (d) {
    console.debug('legend format')
    return d
  }

  const chartTooltip = options.chartTooltip || function (d) {
    return [d.data[xAxis], d.data[yAxis]]
  }

  const colorRange = options.colorRange || [
    theme.palette.explore[700],
    theme.palette.explore[500],
    theme.palette.explore[300],
    theme.palette.explore[100]
  ]

  const viewBoxWidth = 800
  const viewBoxHeight = 40

  // Dimensions
  const dimensions = {
    width: 800,
    height: 40,
    margin: {
      top: 5,
      bottom: 5,
      left: 5,
      right: 5
    }
  }

  // Container dimensions
  dimensions.ctrWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.ctrHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // Bar Scale
  const barScale = (options.barScale) ? options.barScale : 1
  dimensions.ctrWidth = d3.max([dimensions.ctrWidth * barScale, 1])

  const body = {
    pos: {
      x: dimensions.margin.left,
      y: 0,
    },
    size: {
      width: dimensions.ctrWidth,
      height: dimensions.ctrHeight,
    },
  }

  // xDomain
  const xDomain = () => {
    try {
      const r = data.map((row, i) => {
        return row[xAxis]
      })
      // const domain = [...(new Set(r.sort((a, b) => a - b)))]
      const domain = [...(new Set(r))]
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

  // yGroupData
  const yGroupData = xValue => {
    const d = xValue ? data.filter(r => r[xAxis] === xValue) : data
    const r = d3.nest()
      .key(k => k[yGroupBy])
      .rollup(v => d3.sum(v, d => d[yAxis]))
      .entries(d)
      .reduce((acc, d, i) => {
        acc[d.key] = d.value
        return acc
      }, {})
    return r
  }

  // yGroupings
  const yGroupings = xValue => {
    try {
      if (yGroupBy) {
        const d = xValue ? data.filter(r => r[xAxis] === xValue) : data
        const r = d3.nest()
          .key(k => k[yGroupBy])
          .sortKeys((a, b) => yOrderBy.indexOf(a) - yOrderBy.indexOf(b))
          .entries(d)
          .map(y => y.key)
        return r.reverse()
      }
      else {
        const d = xValue ? data.filter(r => r[xAxis] === xValue) : data
        const r = d3.nest()
          .key(k => k[yAxis])
          .entries(d)
          .map(y => y.key)
        return r.reverse()
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  // stack
  const gStack = d3.stack()
    .keys(yGroupings())
    .offset(d3.stackOffsetDiverging)

  // barData
  const barData = domain => {
    const yd = yGroupData(domain)
    const r = gStack([yd])
    return r
  }

  // xScale
  const xScale = d3.scaleLinear()
    .rangeRound([0, dimensions.ctrWidth])
    .domain([0, yDomain()])
    // .clamp(true)

  // yScale
  const yScale = d3.scaleBand()
    .rangeRound([0, dimensions.ctrHeight])
    .domain(xDomain())

  // Default colors and Color Scales
  const primaryColor = options.primaryColor || theme.palette.explore[700] // '#37253c'
  const secondaryColor = options.secondaryColor || theme.palette.explore[100] // '#c4d99b'

  const color = (flipColorRange = false, scaleLinear = false) => {
    let color

    if (colorRange) {
      color = flipColorRange ? d3.scaleOrdinal().domain(xDomain).range(colorRange.reverse()) : d3.scaleOrdinal().domain(xDomain).range(colorRange)
    }
    else {
      if (scaleLinear) {
        color = d3.scaleLinear()
          .domain([0, yOrderBy.length > 0 ? yOrderBy.length - 1 : 0 || 4])
          .range(flipColorRange ? [secondaryColor, primaryColor] : [primaryColor, secondaryColor])
      }
      else {
        const colorDomain = flipColorRange
          ? [yOrderBy.length > 0 ? yOrderBy.length - 1 : 0 || 4, 0]
          : [0, yOrderBy.length > 0 ? yOrderBy.length - 1 : 0 || 4]
        color = d3.scaleSequential(d3.interpolateViridis)
          .domain(colorDomain)
      }
    }
    return color
  }

  const colorScale = color()

  console.log('Chart data: ', barData(xDomain()[0]))

  useEffect(() => {
    const d = barData(xDomain()[0])
    const r = barData(xDomain()[0]).map((item, i) => {
      const nObj = {}
      nObj[xAxis] = item.key
      nObj.total = item[0].data[item.key]
      return nObj
    })
    setDataset({ ...dataset, barData: d, legendData: r })
  }, [data])

  const onHover = d => {
    console.log('handleOnHover: ', d)
    if (d && d.key) {
      setActiveNode({ ...activeNode, key: d.key })
    }
    else {
      setActiveNode({ ...activeNode, key: '' })
    }
  }

  return (
    <>
      <svg width="100%" height="40" viewBox={`0 0 ${ viewBoxWidth } ${ viewBoxHeight }`}>
        <Translate {...body.pos}>
          <Bars
            data={dataset.barData}
            // height={dimensions.ctrHeight}
            // width={dimensions.ctrWidth}
            xScale={xScale}
            yScale={yScale}
            xAxis={xAxis}
            yAxis={yAxis}
            isClickable={true}
            colorScale={colorScale}
            onHover={onHover}
            showTooltips={showTooltips}
            chartTooltip={chartTooltip}
          />
        </Translate>
      </svg>
      { collapsibleLegend && <LegendButton variant='text' onClick={ () => setCollapsed(!collapsed) }>{buttonValue}</LegendButton> }
      <Collapse in={!collapsed}>
        <Legend
          data={dataset.legendData}
          activeNode={activeNode}
          legendHeaders={legendHeaders}
          legendFormat={legendFormat}
          // legendReverse={true}
          legendTotal={true}
          xAxis={xAxis}
          yAxis={yAxis}
          colorScale={colorScale}
          yOrderBy={yOrderBy}
        />
      </Collapse>
    </>
  )
}

export default HorizontalStackedBarChart

HorizontalStackedBarChart.propTypes = {
  data: PropTypes.array.isRequired,
  units: PropTypes.string,
  xAxis: PropTypes.string,
  yAxis: PropTypes.string,
  yGroupBy: PropTypes.string,
  yOrderBy: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
}
