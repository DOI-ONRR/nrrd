import React, { useEffect, useState } from 'react'
// not used import PropTypes from 'prop-types'

import * as d3 from 'd3'

import { Button, Collapse } from '@material-ui/core'
import { useTheme, createStyles, withStyles } from '@material-ui/core/styles'
import Translate from '../svg/Translate'
import { LeftAxis, BottomAxis, CenterAxis } from '../svg/Axis'
import { MaxExtent } from '../svg/MaxExtent'
import Bars from '../svg/Bars'
import { Legend } from '../Legend'
import ChartTitle from '../ChartTitle'

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

const StackedBarChart2 = ({ data, ...options }) => {
  const {
    barSize,
    // not used legendReverse,
    units,
    yGroupBy,
    yOrderBy,
    horizontal = false,
    collapsibleLegend,
    collapsedLegend,
    svgTitle
  } = options
  // console.log('StackedBarChart2 options: ', options)
  const theme = useTheme()
  const [dataset, setDataset] = useState({
    barData: [],
    legendData: [],
    legendHeaders: []
  })

  const hideLegend = options.hideLegend || false

  const [collapsed, setCollapsed] = useState(collapsedLegend || false)
  const title = options.title || ''
  const buttonValue = collapsed ? 'Show details' : 'Hide details'

  const legendHeaders = options.legendHeaders || function (d) {
    return d
  }

  const legendFormat = options.legendFormat || function (d) {
    // console.debug('legend format')
    return d
  }

  const chartTooltip = options.chartTooltip || function (d) {
    // console.debug('chartTooltip debug')
    return d
  }

  const showTooltips = options.showToolips || false

  const extentPercent = options.extentPercent || 0.05
  const extentMarginOfError = options.extentMarginOfError || 0.10
  const maxExtentLineY = options.maxExtentLineY || 20

  const colorRange = options.colorRange || [
    theme.palette.explore[700],
    theme.palette.explore[500],
    theme.palette.explore[300],
    theme.palette.explore[100]
  ]

  // xGroups
  const xGroups = options.xGroups || undefined
  const xLabels = options.xLabels || function (d) {
    return d
  }

  const viewBoxWidth = 800
  const viewBoxHeight = 225

  // Dimensions
  const dimensions = {
    width: 800,
    height: 200,
    margin: {
      top: options.marginTop || 25,
      bottom: options.marginBottom || 30,
      left: options.marginLeft || 40,
      right: options.marginRight || 25
    }
  }

  // Container dimensions
  dimensions.ctrWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.ctrHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // xAxis
  const xAxis = options.xAxis || console.error('Error - no xAxis property set')
  // yAxis
  const yAxis = options.yAxis || console.error('Error - no yAxis property set')

  // xDomain
  const xDomain = () => {
    try {
      // console.debug("xDomain() ", data)
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

  // yMin
  const yMin = () => {
    try {
      const groupTotals = []
      d3.nest()
        .key(k => k[xAxis])
        .key(k => k[yGroupBy])
        .rollup((d, i) => {
          return {
            total: d3.sum(d, d => d.sum)
          }
        })
        .entries(data)
        .forEach(d => {
          d.values.forEach(v => groupTotals.push(v.value.total))
        })

      const minVal = d3.min(groupTotals)
      const yMin = (minVal < 0) ? minVal * 1.5 : 0
      return yMin
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  // yMax
  const yMax = () => {
    try {
      return yDomain().pop()
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

  const selectedIndex = options.selectedIndex || xDomain().length - 1

  const [activeNode, setActiveNode] = useState({
    key: '',
    activeBarIndex: selectedIndex
  })

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
  const xScale = d3.scaleBand()
    .domain(xDomain())
    .range([0, dimensions.ctrWidth])
    .paddingInner(0.3)
    .paddingOuter(0.1)

  // yScale
  const yScale = d3.scaleLinear()
    .rangeRound([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])
    .domain([yMin(), yMax()])

  // chart colors
  const primaryColor = options.primaryColor || '#37253c' // theme.palette.explore[700]
  const secondaryColor = options.secondaryColor || '#c4d99b' // theme.palette.explore[100]

  // color Scale
  const color = (flipColorRange = false, scaleLinear = false) => {
    let color

    if (options.colorRange) {
      color = d3.scaleOrdinal().domain(xDomain()).range(colorRange)
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
  const legendColorScale = color(true)

  // maxBarSize
  const maxBarSize = () => {
    try {
      if (barSize) {
        return d3.min([xScale.bandwidth(), options.barSize])
      }
      else {
        return xScale.bandwidth()
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  // barOffsetX
  const barOffsetX = () => {
    try {
      if (barSize) {
        return (xScale.bandwidth() > barSize) ? (xScale.bandwidth() - barSize) / 2 : 0
      }
      else {
        return 0
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  // Body dimensions
  const body = {
    pos: {
      x: xScale.bandwidth(),
      y: 0,
    },
    size: {
      width: xScale.bandwidth()
    }
  }

  // Left axis positioning
  const leftAxis = {
    pos: {
      x: 0,
      y: 0,
    },
    size: {
      width: dimensions.margin.left,
      height: dimensions.ctrHeight,
    },
  }

  // Bottom axis positioning
  const bottomAxis = {
    pos: {
      x: xScale.bandwidth(),
      y: dimensions.height - dimensions.margin.bottom,
    },
    size: {
      width: dimensions.ctrWidth,
      height: dimensions.margin.bottom,
    },
  }

  // Center axis postioning
  const centerAxis = {
    pos: {
      x: dimensions.margin.left,
      y: yScale(0)
    },
    size: {
      width: dimensions.ctrWidth,
      height: dimensions.margin.bottom,
    },
  }

  const [legendHeader, setLegendHeader] = useState([yGroupBy || yAxis, xDomain()[10]])

  // handle onHover
  const handleBarHover = options.handleBarHover || function (d) {
    return d
  }

  const handleBarData = d => {
    if (d) {
      const x = yOrderBy.map((key, i) => {
        const nObj = {}
        nObj[xAxis] = key
        nObj.total = d[0][key] || '-'
        return nObj
      })

      setDataset({ ...dataset, legendData: x })
      setLegendHeader([yGroupBy || yAxis, xDomain()[d[1]]])
      setActiveNode({ ...activeNode, activeBarIndex: d[1] })
    }
  }

  useEffect(() => {
    const d = []

    xDomain().forEach(item => {
      d.push(barData(item))
    })

    // console.log('useEffect d: ', d)

    const x = yOrderBy.map((key, i) => {
      const nObj = {}
      nObj[xAxis] = key
      nObj.total = d[d.length - 1][0][0].data[key] || '-'
      return nObj
    })

    setDataset({ ...dataset, barData: d, legendData: x })
  }, [data])

  return (
    <>
      {title && <ChartTitle compact={options.compact}>{title}</ChartTitle>}
      <svg width="100%" 
        height="100%"
        viewBox={`0 0 ${ viewBoxWidth } ${ viewBoxHeight }`}
        preserveAspectRatio="xMidYMid meet"
        pointerEvents="none">
        <title>{svgTitle}</title>
        <Translate>
          <MaxExtent
            extentPercent={extentPercent}
            extentMarginOfError={extentMarginOfError}
            maxExtentLineY={maxExtentLineY}
            yMax={yMax}
            units={units}
            dimensions={dimensions} />
        </Translate>
        <Translate {...body.pos}>
          <Bars
            data={dataset.barData}
            width={body.size.width}
            xScale={xScale}
            yScale={yScale}
            xAxis={xAxis}
            yAxis={yAxis}
            isClickable={true}
            colorScale={colorScale}
            handleBarHover={handleBarHover}
            handleBarData={handleBarData}
            showTooltips={showTooltips}
            chartTooltip={chartTooltip}
            horizontal={horizontal}
            maxBarSize={maxBarSize}
            barOffsetX={barOffsetX}
            xDomain={xDomain}
            selectedIndex={selectedIndex}
            legendHeaders={legendHeaders}
          />
        </Translate>
        <Translate {...centerAxis.pos}>
          <CenterAxis xScale={xScale} yScale={yScale} />
        </Translate>
        <Translate {...leftAxis.pos}>
          <LeftAxis yScale={yScale} {...leftAxis.size} />
        </Translate>
        <Translate {...bottomAxis.pos}>
          <BottomAxis
            data={data}
            xScale={xScale}
            xLabels={xLabels(xDomain())}
            xGroups={xGroups}
            dimensions={dimensions}
            activeIndex={activeNode.activeBarIndex}
            {...bottomAxis.size} />
        </Translate>
      </svg>
      { !hideLegend && (
        <>
          {collapsibleLegend && (
            <LegendButton
              variant='text'
              onClick={() => setCollapsed(!collapsed)}
            >
              {buttonValue}
            </LegendButton>
          )}

          <Collapse in={!collapsed}>
            <Legend
              data={dataset.legendData}
              activeNode={activeNode}
              legendHeaders={legendHeaders(legendHeader)}
              legendFormat={legendFormat}
              legendReverse={false}
              legendTotal={true}
              xAxis={xAxis}
              yAxis={yAxis}
              xDomain={xDomain}
              colorScale={legendColorScale}
              yOrderBy={yOrderBy}
              yGroupBy={yGroupBy}
            />
          </Collapse>
        </>
      )}
    </>
  )
}

export default StackedBarChart2
