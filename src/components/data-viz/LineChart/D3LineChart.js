'use strict'

import * as d3 from 'd3'

export default class D3LineChart {
  constructor (container, data, options) {
    this.data = data

    if (!(data) || data.length === 0) {
      console.warn('No data for chart exiting')
      return
    }
    this.container = container
    this.legendNode = container.children[1]
    this.chartNode = container.children[0]
    this.margin = (options.margin) ? options.margin : { right: 25, left: 50, top: 25, bottom: 25 }
    this._height = (this.chartNode.clientHeight > 0) ? this.chartNode.clientHeight - this.margin.top - this.margin.bottom : 400
    this._width = (this.chartNode.clientWidth > 0) ? this.chartNode.clientWidth - this.margin.right - this.margin.left : 400

    this.lineDashes = (options.lineDashes) ? options.lineDashes : ['1,0']
    this.lineStrokes = (options.lineStrokes) ? options.lineStrokes : ['black']

    if (options.lineTooltip) {
      this.lineTooltip = options.lineTooltip
    }

    if (options.chipLabels) {
      this.chipLabels = options.chipLabels
    }

    if (options.chartColors) {
      this.chartColors = options.chartColors
    }

    this.chart()

    // end constructor
  }

  xAxis () {
    try {
      const xScale = this.xScale()
      const data = this.data
      return d3.axisBottom(xScale)
        .tickValues(data[0])
        .tickFormat(d3.format('04d'))
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  yAxis () {
    try {
      const yScale = this.yScale()
      return d3.axisLeft(yScale)
        .ticks(4)
        .tickFormat(d => {
          return (d < 1000000000) ? `${ d / 1000000 }M` : `${ d / 1000000000 }B`
        })

      // Create an axis component with d3.axisLeft
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  // Line chart tooltip
  lineTooltip (data, xAxis, yAxis) {
    const r = [,]
    return r
  }

  _lineTooltip (data) {
    try {
      const r = this.lineTooltip(data)
      return r
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  chart () {
    try {
      const width = this._width
      const height = this._height
      const margin = this.margin
      const xAxis = this.xAxis()
      const yAxis = this.yAxis()
      const yDatasets = this.yDatasets()
      const addLine = this.addLine()
      const lineDashes = this.lineDashes
      const lineStrokes = this.lineStrokes
      const lineTooltip = this.lineTooltip
      const chipLabels = this.chipLabels
      const colors = this.chartColors

      const x = d3.scaleLinear().domain([2003, 2019]).range([0, width])
      const y = d3.scaleLinear().domain([0, 40000000]).range([height, 0])

      const svg = d3.select(this.chartNode).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .style('border', 'solid 1px rgba(0, 0, 0, 0.25)')
        .style('border-radius', '4px')
        .style('box-shadow', '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)')
        .append('g')
        .attr('transform', `translate(${ margin.left }, ${ margin.top })`)

      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${ height })`)
        .style('font-size', '.875rem')
        .call(xAxis) // Create an axis component with d3.axisBottom

      svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(0, 0)')
        .style('font-size', '.875rem')
        .call(yAxis)

      for (let ii = 0; ii < yDatasets.length; ii++) {
        const d = yDatasets[ii]

        const dd = ii % lineDashes.length
        const ss = ii % lineStrokes.length
        svg.append('path')
          .datum(d) // 10. Binds data to the line
          .attr('class', 'line') // Assign a class for styling
          .attr('fill', 'none')
          .attr('stroke', lineStrokes[ss])
          .attr('stroke-width', 6)
          .attr('stroke-dasharray', lineDashes[dd])
          .attr('d', addLine) // 11. Calls the line generator
      }

      const tooltipLine = svg.append('line')
        .attr('stroke', '#000')
        .attr('stroke-width', '2px')
        .attr('stroke-dasharray', '3,3')

      const drawTooltip = () => {
        const year = Math.floor((x.invert(d3.mouse(tipBox.node())[0]) + 0.5) / 1) * 1
        const yearIndex = this.data[0].findIndex(i => i === year)

        tooltipLine
          .attr('stroke', '#000')
          .attr('x1', x(year))
          .attr('x2', x(year))
          .attr('y1', 0)
          .attr('y2', height)

        tooltip.html(year)
          .style('opacity', 1)
          .style('left', `${ d3.event.pageX }px`)
          .style('top', `${ d3.event.pageY }px`)
          .selectAll()
          .data(yDatasets).enter()
          .append('div')
          .style('color', (d, i) => colors[i])
          .html((d, i) => {
            // console.log('.html d: ', i, d)
            return `${ chipLabels[i].name }: ${ lineTooltip(d[yearIndex], i)[0] }`
          })
      }

      const removeTooltip = () => {
        if (tooltip) tooltip.style('opacity', 0)
        if (tooltipLine) tooltipLine.attr('stroke', 'none')
      }

      // Define the div for the tooltip
      const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        // .style('left', '100px')
        .style('background', 'rgba(0, 0, 0, 0.85)')
        .style('border-radius', '4px')
        .style('z-index', '999')
        .style('text-align', 'center')
        .style('color', 'white')
        .style('padding', '4px')
        .style('pointer-events', 'none')
        .style('opacity', 0)

      const tipBox = svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('opacity', 0)
        .on('mousemove', drawTooltip)
        .on('mouseout', removeTooltip)

      /*
      svg.append('path')
        .datum(yDatasets[1]) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('d', addLine) // 11. Calls the line generator

      svg.append('path')
        .datum(yDatasets[2]) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('d', addLine) // 11. Calls the line generator
*/
      this.chart = svg
      return svg
      // end try
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  addLine () {
    try {
      const xScale = this.xScale()
      const yScale = this.yScale()
      const xDomain = this.xDomain()
      return d3.line()
        .x((d, i) => xScale(xDomain[i])) // set the x values for the line generator
        .y((d, i) => yScale(d)) // set the y values for the line generator
        // apply smoothing to the line
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  xDomain () {
    try {
      // console.debug('xDomain', this.data[0])
      return this.data[0]
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  xScale () {
    try {
      const n = this.xDomain().length
      const width = this._width
      const min = this.xMin()
      const max = this.xMax()
      return d3.scaleLinear()
        .domain([min, max]) // input
        .range([0, width])
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  yDomain () {
    try {
      // console.debug('yDomain', this.data)
      const yDatasets = this.yDatasets()
      // console.debug('yDomain yDatasets', yDatasets)
      let r = []
      r = yDatasets.reduce((r, dataset, i) => r.concat(dataset), [])
      // console.debug('yDomain return', r)
      return r
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  yScale () {
    try {
      const height = this._height
      const min = this.yMin()
      const max = this.yMax()
      return d3.scaleLinear()
        .domain([min, max]) // input
        .range([height, 0])
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  yDatasets () {
    try {
      const data = this.data
      const r = data.slice(-1 * data.length + 1)
      // console.debug('yDatasetxss', r)
      return r
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  xMax () {
    try {
      return this.xDomain()[this.xDomain().length - 1]
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  xMin () {
    try {
      return this.xDomain()[0]
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  yMax () {
    try {
      const yDomain = this.yDomain()
      return d3.max(yDomain)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  yMin () {
    try {
      const yDomain = this.yDomain()
      return d3.min(yDomain)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  onMousemove (element, data) {
    try {
      console.log('onMouseover: ', element, data)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }
}
