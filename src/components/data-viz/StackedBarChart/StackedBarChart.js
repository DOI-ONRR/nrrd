import React, { useEffect, useRef } from 'react'
// import ReactDOM from 'react-dom'

import * as d3 from 'd3'
import utils from '../../../js/utils'

import Grow from '@material-ui/core/Grow'
import { makeStyles } from '@material-ui/core/styles'
import stackedBarChart from '../../../js/bar-charts/stacked-bar-chart'

const useStyles = makeStyles(theme => ({
  chart: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '200px',
	  fill: '#323c42'
  },
  'stacked-bar-chart-Y1': {
    fill: 'lightblue'
  }
}))

const StackedBarChart = props => {
  // const mapJson=props.mapJson || "https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json";
  // use ONRR topojson file for land

  const classes = useStyles()
  const data = props.data
  const selected = props.selected
  const elemRef = useRef(null)

  useEffect(() => {
    console.debug(data)
    console.debug('StackedBarChart useEffect fired!')

    // stackedBarChar(elemRef.current,{}, data);
    const chart = new D3StackedBarChart(elemRef.current, data)
    chart.selected(selected)
    chart.draw(data)

    // stackedBarChart.create(elemRef.current,{sortOrder: ["Y1","Y2","Y3", "Y4"]}, data);
  }, [elemRef])

  return (
	  <div className={classes.chart} ref={elemRef} ></div>
  )
}

export default StackedBarChart

const siValue = (function () {
  const suffix = { k: 1000, M: 1000000, G: 1000000000 }
  return function (str) {
    let number
    str = str.replace(/(\.0+)?([kMG])$/, function (_, zeroes, s) {
      number = str.replace(s, '').toString() || str
      return (+number * suffix[s])
    }).replace(/\.0+$/, '')
    if (number) {
      return str.slice(number.length, str.length)
    }
    else {
      return str
    }
  }
})()

class D3StackedBarChart {
  constructor (node, data) {
    this.node = node
    this.data = data
    this.marginBottom = 40
    this.marginTop = 25
    this.maxValue = this.calcMaxValue(data)
    this.minValue = this.calcMinValue(data)
    this.extentPercent = 0.05
    this.extentMarginOfError = 0.10
    this.maxExtentLineY = 20

    this._height = (node.clientHeight > 0) ? node.clientHeight : 400
    console.debug('**********************************************', this._height)
    this._width = (node.clientWidth <= 0) ? 300 : node.clientWidth
    this.xScale = d3.scaleBand()
	    .domain(this.data.map(d => {
        return Object.keys(d)[0]
	    }))
	    .range([0, this._width])
	    .paddingInner(0.3)
	    .paddingOuter(0.1)

    this.yScale = d3.scaleLinear().rangeRound([this.marginTop, this._height - this.marginBottom])
    this.yScale.domain([this.maxValue, 0])

    this.maxBarSize = undefined
    if (this.maxBarSize) {
      this.barOffsetX = (this.xScale.bandwidth() > this.maxBarSize) ? (this.xScale.bandwidth() - this.maxBarSize) / 2 : 0
      this.maxBarSize = d3.min([this.xScale.bandwidth(), this.maxBarSize])
    }
    else {
      this.maxBarSize = this.xScale.bandwidth()
    }
    this.svg = d3.select(node).append('svg')
	    .attr('height', this._height)
	    .attr('width', this._width)
  }

  selected (value) {
    if (value) {
	    this._selected = value
    }
    return this._selected
  }

  height (value) {
    if (value) {
	    this._height = value
	    this.svg.attr('height', value)
    }
    return this._width
  }

  width (value) {
    if (value) {
	    this._width = value
	    this.svg.attr('width', value)
    }
    return this._width
  }

  calcMaxValue (data) {
    return d3.max(data, d => {
	    let sum = 0
	    Object.entries(d).forEach(
        ([key, values]) => {
		    Object.entries(values[0]).forEach(
            ([key, value]) => {
			    sum += value
            }
		    )
        }
	    )
	    return (sum)
    })
  }

  calcMinValue (data) {
    return d3.min(data, d => {
	    let data = 0
	    Object.entries(d).forEach(
        ([key, values]) => {
		    Object.entries(values[0]).forEach(
            ([key, value]) => {
			    data += value
            }
		    )
        }
	    )
	    return (data)
    })
  }

  getOrderedKeys (data) {
    return Object.keys((data[0][Object.keys(data[0])[0]])[0])
  }

  addChart (data) {
    if (data) {
	    this.data = data
    }
    const self = this
    const stack = d3.stack()
	    .keys(this.getOrderedKeys(data))
	    .offset(d3.stackOffsetNone)
    const keys = this.getOrderedKeys(data)
    console.debug('KEEEEEEEY:', keys)
    this.svg.append('g')
	    .attr('class', 'bars')
	    .selectAll('g')
	    .data(self.data)
	    .enter().append('g')
	    .attr('height', (self._height - self.marginTop))
	    .attr('width', self.xScale.bandwidth())
	    .attr('transform', d => 'translate(' + (self.xScale(Object.keys(d)[0])) + ',0)')
	    .attr('selected', true)
	    .attr('class', 'stacked-bar-chart-bar')
	    .attr('data-key', d => Object.keys(d)[0])
	    .attr('tabindex', 0)
	    .selectAll('g')
	    .data(d => {
        const s = stack(d[Object.keys(d)[0]])
        return stack(d[Object.keys(d)[0]])
	    })
	    .enter().append('g')
    //	    .attr('class', d => self.styleMap && self.styleMap[d.key])
	    .attr('class', (d, i) => 'stacked-bar-chart-' + i)
      .attr('fill-opacity', (d, i) => (1 - (i / keys.length)))
	    .append('rect')
	    .attr('y', d => {
        return self.yScale(d[0][1]) || 0
	    })
	    .attr('height', function (d) {
        return (self.yScale(d[0][0]) - self.yScale(d[0][1])) || 0
	    })
	    .attr('width', self.maxBarSize)
	    .attr('x', self.barOffsetX)
  }

  draw () {
    if (this.data === undefined) {
	    return
    }

    // this.svg.selectAll('#backgroundRect').remove()
    this.addBackgroundRect()

    // this.svg.selectAll('#maxExtent').remove()
    this.addMaxExtent()

    // this.svg.selectAll('#bars').remove()
    this.addChart(this.data)

 	// this.svg.selectAll('g.x.axis').remove()
    this.addXAxis()

    // Add Grouping Lines
    // this.svg.selectAll('#groups').remove()
    this.addGroupLines()
  }

  addMaxExtent (units) {
    try {
	    const self = this
	    // Add Max Extent Number text
	    const maxExtentGroup = self.svg.append('g').attr('class', 'maxExtent')
	    const maxExtentValue = this.calculateExtentValue(this.maxValue)
	    if (!units) {
        units = ''
	    }
	    maxExtentGroup.append('text')
        .attr('width', self._width)
        .attr('x', self._width)
        .attr('y', (self.maxExtentLineY - 5))
        .attr('text-anchor', 'end')
        .text((units === 'dollars' || units === '$') ? ['$', maxExtentValue].join('') : [maxExtentValue, units].join(' '))

	    maxExtentGroup.append('line')
        .attr('x1', 0)
        .attr('x2', self._width)
        .attr('stroke', '#a7bcc7')
        .attr('stroke-dasharray', [5, 5])
        .attr('stroke-width', 1)
        .attr('transform', 'translate(' + [0, self.maxExtentLineY] + ')')
    }
    catch (e) {
      console.warning('Error in addMaxExtent', e)
    }
  }

  addXAxis (xLabels) {
    const self = this

    const createXAxis = () => (d3.axisBottom(self.xScale).tickSize(0).tickFormat(d =>
										   (xLabels) ? xLabels[d] : d))

    self.svg.append('g')
	    .attr('class', 'stacked-bar-chart-x-axis')
	    .attr('transform', 'translate(0,' + (self._height - self.marginBottom) + ')')
	    .call(createXAxis())
	    .selectAll('text')
	    .attr('y', 9)
  }

  addGroupLines () {
    if (this.groups) {
	    const self = this

	    const groupLines = this.svg.append('g').attr('class', 'stacked-bar-chart-groups')
	    const groupItemWidth = (self._width / self.state.length)
	    const padding = (self.xScale.bandwidth() * 0.2)
	    let xPos = 0

	    Object.keys(self.groups).map((name, index) => {
        const groupLineWidth = xPos + (groupItemWidth * self.groups[name].length) - padding

        groupLines.append('line')
		    .attr('x1', xPos + padding)
		    .attr('x2', groupLineWidth)
		    .attr('stroke', '#a7bcc7')
		    .attr('stroke-width', 1)
		    .attr('transform', 'translate(' + [0, self._height - 4 - self.marginBottom / 2] + ')')

        groupLines.append('text')
		    .attr('x', ((xPos + padding) / 2) + (groupLineWidth / 2))
		    .attr('y', self._height - 16)
		    .attr('text-anchor', 'middle')
		    .text(name)

        xPos = groupLineWidth + padding
	    }
      )
    }
  }

  getMetricLongUnit (str) {
    const suffix = { k: 'k', M: ' million', G: ' billion' }

    return str.replace(/(\.0+)?([kMG])$/, function (_, zeroes, s) {
	    return suffix[s] || s
    })
  }

  calculateExtentValue (maxValue) {
  	const maxValueExtent = Math.ceil(maxValue * (1 + this.extentPercent))
  	return this.getMetricLongUnit(d3.format(this.setSigFigs(maxValue, maxValueExtent))(maxValueExtent))
  }

  crawlCeil (ymax, ceilMax, i) {
    // When ymax is a value less than 10, the ratio of ceilMax and ymax will never
    // be less than (1 + extentMarginOfError + extentPercent), and the function will continue
    // be called in its parent function's while loop.

    const sigFig = '.' + i + 's'

    /* var sigFigCeil = +eiti.format.transform(
	   sigFig,
	   eiti.format.siValue
	   )(ceilMax); */

    const sigFigCeil = siValue(d3.format(sigFig)(ceilMax))

    const ceilIsLargerThanValue = sigFigCeil > +ymax
    let ceilIsntTooBig = (sigFigCeil / +ymax) <= (1 + this.extentMarginOfError + this.extentPercent)
    if (!ceilIsntTooBig) {
	    ceilIsntTooBig = ((sigFigCeil - ymax) < 10) // Accomodate for small numbers if the difference is smal then this should be acceptable
    }
    const justRight = ceilIsLargerThanValue && ceilIsntTooBig
    return justRight ? sigFig : ''
  }

  setSigFigs (ymax, ceilMax) {
    let sigFigs = ''
    let SF = 0
    while (sigFigs.length < 3) {
	    SF++
	    sigFigs = this.crawlCeil(ymax, ceilMax, SF)
    }
    return sigFigs
  }

  addBackgroundRect () {
    this.svg.append('rect')
	    .attr('class', 'stacked-bar-chart-background')
	    .attr('id', 'backgroundRect')
	    .style('opacity', 0.0)
	    .attr('y', 0)
	    .attr('height', this._height)
	    .attr('width', this._width)
	    .attr('x', 0)
  }
}

const stackedBar = (node, data) => {
  // Setup svg using Bostock's margin convention

  const margin = { top: 20, right: 160, bottom: 35, left: 30 }

  const width = 960 - margin.left - margin.right
  const height = 500 - margin.top - margin.bottom

  const svg = d3.select(node)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  /* Data in strings like it would be if imported from a csv */

  var data = [
    { year: '2006', redDelicious: '10', mcintosh: '15', oranges: '9', pears: '6' },
    { year: '2007', redDelicious: '12', mcintosh: '18', oranges: '9', pears: '4' },
    { year: '2008', redDelicious: '05', mcintosh: '20', oranges: '8', pears: '2' },
    { year: '2009', redDelicious: '01', mcintosh: '15', oranges: '5', pears: '4' },
    { year: '2010', redDelicious: '02', mcintosh: '10', oranges: '4', pears: '2' },
    { year: '2011', redDelicious: '03', mcintosh: '12', oranges: '6', pears: '3' },
    { year: '2012', redDelicious: '04', mcintosh: '15', oranges: '8', pears: '1' },
    { year: '2013', redDelicious: '06', mcintosh: '11', oranges: '9', pears: '4' },
    { year: '2014', redDelicious: '10', mcintosh: '13', oranges: '9', pears: '5' },
    { year: '2015', redDelicious: '16', mcintosh: '19', oranges: '6', pears: '9' },
    { year: '2016', redDelicious: '19', mcintosh: '17', oranges: '5', pears: '7' },
  ]

  const parse = d3.timeParse('%Y')

  // Transpose the data into layers
  const dataset = d3.layout.stack()(['redDelicious', 'mcintosh', 'oranges', 'pears'].map(function (fruit) {
    return data.map(function (d) {
      return { x: parse(d.year), y: +d[fruit] }
    })
  }))

  // Set x, y and colors
  const x = d3.scale.ordinal()
    .domain(dataset[0].map(function (d) {
      return d.x
    }))
    .rangeRoundBands([10, width - 10], 0.02)

  const y = d3.scale.linear()
    .domain([0, d3.max(dataset, function (d) {
      return d3.max(d, function (d) {
        return d.y0 + d.y
      })
    })])
    .range([height, 0])

  const colors = ['b33040', '#d25c4d', '#f2b447', '#d9d574']

  // Define and draw axes
  const yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(5)
    .tickSize(-width, 0, 0)
    .tickFormat(function (d) {
      return d
    })

  const xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickFormat(d3.time.format('%Y'))

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  // Create groups for each series, rects for each segment
  const groups = svg.selectAll('g.cost')
    .data(dataset)
    .enter().append('g')
    .attr('class', 'cost')
    .style('fill', function (d, i) {
      return colors[i]
    })

  const rect = groups.selectAll('rect')
    .data(function (d) {
      return d
    })
    .enter()
    .append('rect')
    .attr('x', function (d) {
      return x(d.x)
    })
    .attr('y', function (d) {
      return y(d.y0 + d.y)
    })
    .attr('height', function (d) {
      return y(d.y0) - y(d.y0 + d.y)
    })
    .attr('width', x.rangeBand())
    .on('mouseover', function () {
      tooltip.style('display', null)
    })
    .on('mouseout', function () {
      tooltip.style('display', 'none')
    })
    .on('mousemove', function (d) {
      const xPosition = d3.mouse(this)[0] - 15
      const yPosition = d3.mouse(this)[1] - 25
      tooltip.attr('transform', 'translate(' + xPosition + ',' + yPosition + ')')
      tooltip.select('text').text(d.y)
    })

  // Draw legend
  const legend = svg.selectAll('.legend')
    .data(colors)
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
      return 'translate(30,' + i * 19 + ')'
    })

  legend.append('rect')
    .attr('x', width - 18)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', function (d, i) {
      return colors.slice().reverse()[i]
    })

  legend.append('text')
    .attr('x', width + 5)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'start')
    .text(function (d, i) {
      switch (i) {
      case 0: return 'Anjou pears'
      case 1: return 'Naval oranges'
      case 2: return 'McIntosh apples'
      case 3: return 'Red Delicious apples'
      }
    })

  // Prep the tooltip bits, initial display is hidden
  var tooltip = svg.append('g')
    .attr('class', 'tooltip')
    .style('display', 'none')

  tooltip.append('rect')
    .attr('width', 30)
    .attr('height', 20)
    .attr('fill', 'white')
    .style('opacity', 0.5)

  tooltip.append('text')
    .attr('x', 15)
    .attr('dy', '1.2em')
    .style('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
}
