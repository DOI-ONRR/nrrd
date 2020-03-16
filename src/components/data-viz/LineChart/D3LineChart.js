'use strict'

import * as d3 from 'd3'

export default class D3LineChart {
foo () {
  try {
  }
  catch (err) {
      console.warn('Error: ', err)
    }
  }
  constructor (container, data, options) {
    this.data=data
    if(!( data ) || data.length === 0 ) {
      console.warn("No data for chart exiting");
      return;
    }
    this.container = container
    this.legendNode = container.children[1]
    this.chartNode = container.children[0]
    this.margin = (options.margin) ? options.margin : { right: 25, left: 25, top: 25, bottom: 25 }
    this._height = (this.chartNode.clientHeight > 0) ? this.chartNode.clientHeight - this.margin.top - this.margin.bottom : 400
    this._width = (this.chartNode.clientWidth > 0) ? this.chartNode.clientWidth - this.margin.right - this.margin.left : 400

   
    this.chart()
    
    // end constructor
  }

  xAxis () {
    try {
      const xScale = this.xScale()
      const data=this.data
      return  d3.axisBottom(xScale)
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
        .ticks(5)
      // Create an axis component with d3.axisLeft

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

      const svg = d3.select(this.chartNode).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .style('border', 'solid 1px black')
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis) // Create an axis component with d3.axisBottom

      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)

      svg.append('path')
        .datum(yDatasets[0]) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('d', addLine) // 11. Calls the line generator

      svg.append('path')
        .datum(yDatasets[1]) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('d', addLine) // 11. Calls the line generator

      svg.append('path')
        .datum(yDatasets[2]) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('d', addLine) // 11. Calls the line generator

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
        .x((d, i) =>{ console.debug("x in line", xDomain[i], i ); return xScale(xDomain[i])} ) // set the x values for the line generator
        .y((d, i) =>{console.debug("d in addline", d)
                     return yScale(d)
                    }) // set the y values for the line generator
        .curve(d3.curveBasis) // apply smoothing to the line
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  xDomain () {
    try {
      console.debug('xDomain', this.data[0])
      return this.data[0]
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  
  xScale () {
    try {
      let n = this.xDomain().length
      let width = this._width
      const min = this.xMin()
      const max = this.xMax()
      return d3.scaleLinear()
        .domain([min, max]) // inpaut
        .range([0, width])
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  yDomain () {
    try {
      console.debug('yDomain', this.data)
      const yDatasets=this.yDatasets()
      console.debug('yDomain yDatasets', yDatasets)
      let r = []
      r = yDatasets.reduce( (r, dataset, i) => r.concat(dataset) ,[] )
      console.debug('return', r)
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
        .range([height,0])
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }
 
  yDatasets () {
    try {
      const data=this.data
      const r=data.slice(-1 * data.length + 1)
      console.debug('yDatasetxss', r)
      return r
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }
  xMax () {
    try {
      return this.xDomain()[this.xDomain().length - 1 ]
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
      const yDomain=this.yDomain()
      return d3.max(yDomain)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }
  
  yMin () {
    try {
      const yDomain=this.yDomain()
      return d3.min(yDomain)

    }
    catch (err) {
        console.warn('Error: ', err)
    }
  }
  
  
}
