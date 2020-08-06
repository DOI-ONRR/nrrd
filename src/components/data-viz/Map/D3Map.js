
/* eslint-disable no-tabs */
/* eslint-disable no-unused-vars */
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import utils from '../../../js/utils'
import { ConsoleView } from 'react-device-detect'

export default class d3Map {
  constructor (
    node,
    us,
    mapFeatures,
    data,
    colorScheme,
    onClick,
    minColor,
    maxColor,
    mapZ,
    mapX,
    mapY,
    options
  ) {
    if (options.mapFormat) {
      this.format = options.mapFormat
    }
    if (options.mapUnits) {
      this.unit = options.mapUnits
    }
    else {
      this.unit='';
    }

      if (options.onZoomEnd) {
	  this.onZoomEnd=options.onZoomEnd
      }
      if (options.legendFormat) {
	  this.legendFormat=options.legendFormat
      }
      this.zoomStarted=false
    this.node = node
    this.us = us
    this.mapFeatures = mapFeatures
    this.data = data
    this.colorScheme = colorScheme
    this.onClick = onClick
    this.minColor = minColor
    this.maxColor = maxColor
    this.mapZ = mapZ
    this.mapX = mapX
    this.mapY = mapY
    this.labels = true
    this.chart()
    this.legend()
  }

  /**
   *  The function that does the building of the svg with d3
   *
   *  @param {*}  node - the node we are going to build the svg in
   *  @param {*} us - the topojson json object to be used
   *  @param {string} [mapFeatures=counties] mapFeatures - A switch to view county data or state data
   *  @param {string[][]} data - a two dimenstional arrray of fips and data, maybe county or state fips
   *  @param {string} [colorScheme=green] colorScheme current lets you modify color from red to blue green or gray ;
   *  @param {*} onClick function that determines what to do if area is clicked
   *
 */

    legendFormat(value) {
	return(value)
	
    }
	
    
  zoomTo (state) {
    try {
      const us = this.us
      const svg = this._chart
      const zoom = this.zoom
      const path = this.path
      // console.debug('Zoom to :', state)
      svg.selectAll('path')
        .attr('fill-opacity', 0)
      svg.selectAll(`.${ state }`)
        .attr('fill-opacity', 9)
      const paths = svg.selectAll('.' + state)
      const bboxes = paths.nodes().map(d => d.getBBox())
      const x0 = d3.min(bboxes.map(d => d.x))
      const x1 = d3.max(bboxes.map(d => d.x + d.width))
      const y0 = d3.min(bboxes.map(d => d.y))
      const y1 = d3.max(bboxes.map(d => d.y + d.height))
      const width = this.width
      const height = this.height
      // const width = x1 - x0
      // const height = y1 - y0
      // console.debug('x0: ', x0, 'y0: ', y0, 'x1: ', x1, 'y1: ', y1, 'width: ', width, 'height: ', height)
      const transform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
      this.zoom(transform)
    }
    catch (err) {
      console.warn('Error in zoom: ', err)
    }
  }

  onZoom (event) {
    // console.debug('transform onZoom', event.transform)
  }

  onZoomEnd (event) {
     console.debug('transform onZoomEnd', event.transform)
  }

  zoom (transform) {
    try {
	       // console.log('zoom(transform): ', transform)
      if (transform) {
        const _zoom = transform
        this._chart
          .selectAll('path').attr('transform', 'translate(' + [_zoom.x, _zoom.y] + ')' + ' scale(' + _zoom.k + ')')
        this._zoom = _zoom
        return this._zoom
      }
      else {
        return this._zoom
      }
    }
    catch (err) {
      console.warn('Error in zoom: ', err)
    }
  }

  format (d) {
    if (isNaN(d)) {
      return ''
    }
    else {
      return '$' + d3.format(',.0f')(d)
    }
  }

  chart () {
    let _chart
    const self = this
    const node = this.node
    const us = this.us
    const mapFeatures = this.mapFeatures
    const data = this.data
    const colorScheme = this.colorScheme
    const onClick = this.onClick
    const minColor = this.minColor
    const maxColor = this.maxColor
    const width = this.node.children[1].scrollWidth
    const height = this.node.children[1].scrollHeight
    this.width = width
    this.height = height
    const mapZ = this.mapZ
    const mapX = this.mapX
    const mapY = this.mapY
    const vwidth = width //* 1.5
    const vheight = height //* 1.5
    const _zoom = this._zoom
      const onZoom = this.onZoom
      const onZoomEnd = this.onZoomEnd
      
    if (node.children[1].children[0]) {
      this._chart = d3.select(node.children[1].children[0])
      this._chart.selectAll('path').remove()
      _chart = this._chart
    }

    else {
      _chart = d3
        .select(node.children[1])
        .append('svg')
        .style('width', width)
        .style('height', height)
        .attr('height', '100%')
        .attr('fill', '#E0E2E3')
        .attr('class', 'map')
        .attr('viewBox', '0 0 ' + vwidth + ' ' + vheight)
    }
    // const margin = { top: 0, bottom: 0, right: 0, left: 0};

    const projection = d3.geoAlbersUsa()
      .translate([width / 2, height / 2]) // translate to center of screen
      .scale([height * 1.5]) // scale things down so see entire US

    const path = d3.geoPath(projection)
    this.path = path
    let color = () => {}

    // switch quick and dirty to let users change color beter to use d3.interpolateRGB??
    switch (colorScheme) {
    case 'blue':
      color = d3.scaleSequentialQuantile(
        data.values, t =>
          d3.interpolateBlues(t)
      )
      break
    case 'green':
      color = d3.scaleSequentialQuantile(
        data.values, t =>
          d3.interpolateGreens(t)
      )
      break
    case 'red':
      color = d3.scaleSequentialQuantile(
        data.values, t =>
          d3.interpolateReds(t)
      )
      break
    case 'grey':
      color = d3.scaleSequentialQuantile(
        data.values, t =>
          d3.interpolateGreys(t)
      )
      break
    default:
      color = d3.scaleSequentialQuantile(
        data.values, t =>
          d3.interpolateGreens(t)
      )
    }

    if (minColor && maxColor) {
      color = d3
        .scaleSequentialQuantile()
        .interpolator(d3.interpolateRgb(minColor, maxColor))
        .domain(data.values.sort())
    }

    this.color = color
    const format = this.format
    const _format = d => {
      format(d)
    }

    const zoom = d3
      .zoom()
      .scaleExtent([-32, 32])
      .on('zoom', zoomed)
      .on('end', ended)

    const AKR = d3.set(['BFT', 'CHU', 'HOP', 'NOR', 'MAT', 'NAV', 'ALB', 'BOW', 'ALA', 'GEO', 'NAL', 'SHU', 'KOD', 'GOA', 'COK'])

    const g = _chart.append('g')
    _chart.call(zoom)
    // console.debug('US data: ', data)
    // console.debug('objects:', us.objects[mapFeatures], mapFeatures)
    g.selectAll('path')
      .data(topojson.feature(us, us.objects[mapFeatures]).features)
      .join('path')
      .attr('class', d => (d.properties.state) ? d.properties.state : d.id)
      .attr('fill', d => color(data.get(d.id)))
      .attr('fill-opacity', 0.9)
      .attr('d', path)
      .attr('stroke', d => {
        if (AKR.has(d.id)) {
          return color(data.get(d.id))
        }
        else {
          return '#CACBCC'
        }
      }
      )
      .attr('vector-effect', 'non-scaling-stroke')
      .on('click', (d, i) => {
        if (AKR.has(d.id)) {
          const r = { id: 'AKR', properties: { region: 'AKR', name: 'Alaska Offshore' } }
          onClick(r, i)

          // do nothing
        }
        else {
          onClick(d, i)
        }
      })
      .on('mouseover', function (d, i) {
        d3.select(this)
          .style('fill-opacity', 0.7)
	  .style('cursor', 'pointer')
      })
      .on('mouseout', (d, i) => {
        _chart.selectAll('path')
          .style('fill-opacity', 0.9)
      })
      .append('title')
      .text(d => {
        if (AKR.has(d.id)) {
          return `${ 'Alaskan Offshore Region' }  ${ format(data.get(d.id)) }`
        }
        else {
          return `${ d.properties.name }  ${ format(data.get(d.id)) }`
        }
      }).transition().duration(3000)

    _chart.append('path')
      .datum(topojson.mesh(us, us.objects[mapFeatures], (a, b) => a !== b))
      .attr('fill', 'none')
      .attr('d', path)

    //    const AKR = d3.set(['BFT', 'CHU', 'HOP', 'NOR', 'MAT', 'NAV', 'ALB', 'BOW', 'ALA', 'GEO', 'NAL', 'SHU', 'KOD', 'GOA', 'COK'])
    /*    const AKR = d3.set([ 'NAV', 'ALB'])
    let v=data.get('AKR')
    console.debug('v                         :',v)
    g.append('path')
      .datum(topojson.merge(us, us.objects[mapFeatures].geometries.filter(function(d) {
        return AKR.has(d.id) })))
      .attr('fill', 'darkblue') // d => color(data.get('AKR')))
*/

    /* .attr('fill-opacity', 0.9)
      .attr('d', path)
      .attr('stroke', '#CACBCC')
      .attr('vector-effect', 'non-scaling-stroke')
      .on('click', (d, i) => {
        onClick(d, i)
      })
      .on('mouseover', function (d, i) {
        d3.select(this)
          .style('fill-opacity', 0.7)
	  .style('cursor', 'pointer')
      })
      .on('mouseout', (d, i) => {
        _chart.selectAll('path')
          .style('fill-opacity', 0.9)
      })
      .append('title')
      .text(d => `Alaska Offshore Region  ${ format(data.get('AKR')) }`).transition().duration(3000)
    */

    const POR = d3.set(['WAO', 'NOC', 'CEC', 'SOC'])
    g.append('path')
      .datum(topojson.merge(us, us.objects[mapFeatures].geometries.filter(function (d) {
        return POR.has(d.id)
      })))
      .attr('class', 'POR')
      .attr('fill', d => color(data.get('POR')))
      .attr('fill', d => color(data.get('POR')))
      .attr('fill-opacity', 0.9)
      .attr('d', path)
      .attr('stroke', '#CACBCC')
      .attr('vector-effect', 'non-scaling-stroke')
      .on('click', (d, i) => {
        const r = { id: 'POR', properties: { region: 'POR', name: 'Pacific' } }
        onClick(r, i)
      })
      .on('mouseover', function (d, i) {
        d3.select(this)
          .style('fill-opacity', 0.7)
	  .style('cursor', 'pointer')
      })
      .on('mouseout', (d, i) => {
        _chart.selectAll('path')
          .style('fill-opacity', 0.9)
      })
      .append('title')
      .text(d => `Pacific Offshore Region  ${ format(data.get('POR')) }`).transition().duration(3000)

    const GMR = d3.set(['WGM', 'CGM', 'EGM'])
    g.append('path')
      .datum(topojson.merge(us, us.objects[mapFeatures].geometries.filter(function (d) {
        return GMR.has(d.id)
      })))
      .attr('fill', d => color(data.get('GMR')))
      .attr('fill-opacity', 0.9)
      .attr('d', path)
      .attr('stroke', '#CACBCC')
      .attr('vector-effect', 'non-scaling-stroke')
      .on('click', (d, i) => {
        const r = { id: 'GMR', properties: { region: 'GMR', name: 'Gulf of Mexico' } }
        onClick(r, i)
      })
      .on('mouseover', function (d, i) {
        d3.select(this)
          .style('fill-opacity', 0.7)
	  .style('cursor', 'pointer')
      })
      .on('mouseout', (d, i) => {
        _chart.selectAll('path')
          .style('fill-opacity', 0.9)
      })
      .append('title')
      .text(d => `Gulf of Mexico Offshore Region  ${ format(data.get('GMR')) }`).transition().duration(3000)

    const AOR = d3.set(['NOA', 'MDA', 'SOA', 'FLS'])
    g.append('path')
      .datum(topojson.merge(us, us.objects[mapFeatures].geometries.filter(function (d) {
        return AOR.has(d.id)
      })))
      .attr('fill', d => color(data.get('AOR')))
      .attr('fill-opacity', 0.9)
      .attr('d', path)
      .attr('stroke', '#CACBCC')
      .attr('vector-effect', 'non-scaling-stroke')
      .on('click', (d, i) => {
        const r = { id: 'AOR', properties: { region: 'AOR', name: 'Atlantic' } }
        onClick(r, i)
      })
      .on('mouseover', function (d, i) {
        d3.select(this)
          .style('fill-opacity', 0.7)
	  .style('cursor', 'pointer')
      })
      .on('mouseout', (d, i) => {
        _chart.selectAll('path')
          .style('fill-opacity', 0.9)
      })
      .append('title')
      .text(d => `Atlantic Offshore Region  ${ format(data.get('AOR')) }`).transition().duration(3000)

    _chart.transition().duration(3000)

      function zoomed () {
	  let sourceEvent= d3.event.sourceEvent
//	  console.log('zoomed(): outside ', d3.event, self.zoomStarted)
	  if(sourceEvent.type === 'wheel' || sourceEvent.movementX > 0 || sourceEvent.movementY > 0 ) {
	g.selectAll('path')
        .attr('transform', d3.event.transform)
	      onZoom(d3.event)
	   //   console.log('zoomed(): ', d3.event)
	      self.zoomStarted=true
	} else {
	    // console.log('zoomed(): else ', d3.event, self.zoomStarted)
	}
      }
    function ended () {
	//	  console.log('ended(): outside ', d3.event, self.zoomStarted)
	  if(self.zoomStarted) {
	      onZoomEnd(d3.event)
	      self.zoomStarted=false
	      // console.log('ended(): ', d3.event)
	  }
      }
    

    this._chart = _chart
    return _chart
  }

  legend () {
    const title = this.data.title
    const data = this.data
    const color = this.color
      const unit = this.unit
      const legendFormat = this.legendFormat
    let legend
    if (this.node.children[0].children[0]) {
      this._legend = d3.select(this.node.children[0].children[0])
      this._legend.selectAll('g').remove()
      legend = this._legend
    }
    else {
      legend = d3.select(this.node.children[0]).append('svg')
        .attr('class', 'legend')
    }

    const g = legend
      .append('g')
      .attr('transform', 'translate(30,0)')
    const width = 200
    const height = 20
    const sorted = data.values.sort((a, b) => a - b)
    const lowest = legendFormat(Math.floor(sorted[0]), 3) 
    const median = legendFormat(
      Math.floor(sorted[Math.floor(sorted.length / 2)]),
      3
    )
    const highest = legendFormat(
      Math.floor(sorted[sorted.length - 1]),
      3
    )
    for (let ii = 0; ii < sorted.length; ii++) {
      g.append('rect')
        .attr('x', (ii * width) / sorted.length)
        .attr('width', width / sorted.length + 1)
        .attr('height', height)
        .attr('fill-opacity', 0.9)
        .style('fill', color(sorted[ii]))
    }
    g.append('text')
      .attr('class', 'caption')
      .attr('y', -6)
      .attr('fill', '#000')
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold')
      .text(title)

    if (this.labels) {
      g.call(
        d3
          .axisBottom(d3.scalePoint([lowest, median, highest + ' ' +unit], [0, width]))
          .tickSize(20)
      )
        .select('.domain')
        .remove()
    }
  }
}
