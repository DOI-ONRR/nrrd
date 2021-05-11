'use strict'
import * as d3 from 'd3'
// import { active } from 'd3'
// import { isEnumMember } from 'typescript'

export default class D3StackedBarChart {
  constructor (node, data, options, onHover, formatLegendFunc) {
    try {
      this.node = node
      this.chartDiv = node.querySelector('#chart_div')
      this.legendDiv = node.querySelector('#legend_div')
      if (data && data.length > 0) {
        // console.debug('data:', data)
        this.data = data
      }
      else {
        console.warn('Stacked barchart must have data, erroring out')
        return false
      }

      this.options = options
      this._height = (this.chartDiv.clientHeight > 0) ? this.chartDiv.clientHeight : 200
      this._width = (this.chartDiv.clientWidth <= 0) ? 300 : this.chartDiv.clientWidth
      this.xAxis = options.xAxis || console.error('Error - no xAxis property set')
      this.yAxis = options.yAxis || console.error('Error - no yAxis property set')
      this.marginBottom = options.marginBottom || 40
      this.marginTop = options.marginTop || 25
      this.marginRight = options.marginRight || 15
      this.marginLeft = options.marginLeft || 40
      this.units = (options.units) ? options.units : ''
      this.horizontal = options.horizontal
      this.showLegendUnits = options.showLegendUnits
      this.handleBarHover = options.handleBarHover || (() => {})

      if (options.chartTooltip) {
        this.chartTooltip = options.chartTooltip
      }

      if (options.selectedIndex === undefined) {
        this.selectedIndex = this.xDomain().length - 1
      }
      else {
        this.selectedIndex = options.selectedIndex
      }

      this.currentIndex = this.selectedIndex

      if (this.showLegendUnits) {
        this.showLegendUnits = true
      }
      this.xGroups = (options.xGroups) ? options.xGroups : undefined

      this.legendReverse = (options.legendReverse) ? options.legendReverse : false

      this.xLabels = (typeof options.xLabels === 'function') ? options.xLabels : this.xLabels
      // max extent line props and defaults
      if (options.legendFormat) {
        this.legendFormat = options.legendFormat
      }
      if (options.legendHeaders) {
        this.legendHeaders = options.legendHeaders
      }
      this.extentPercent = options.extentPercent || 0.05
      this.extentMarginOfError = options.extentMarginOfError || 0.10
      this.maxExtentLineY = options.maxExtentLineY || 20

      // overload methods to make chart awesome
      if (options.onSelect) this.onSelect = options.onSelect
      if (options.onClick) this.onClick = options.onClick
      if (options.onHover) this.onHover = options.onHover

      this.yOrder()

      // vertical and horizontal bar chart settings
      if (!this.horizontal) {
        this.xScale = d3.scaleBand()
          .domain(this.xDomain())
          .range([this.marginLeft, this._width])
          .paddingInner(0.3)
          .paddingOuter(0.1)

        this.yScale = d3.scaleLinear()
          .rangeRound([this._height - this.marginBottom, this.marginTop])
          .domain([this.yMin(), this.yMax()])

        this.chart = d3.select(this.chartDiv).append('svg')
          .attr('class', 'stacked-bar-chart')

        this.chart.attr('viewBox', `0 0 ${ (this._width + 20) } ${ this._height }`)
      }
      else {
        // reset margins
        this.marginLeft = 5
        this.marginTop = 5
        this.marginRight = 5
        this.marginBottom = 5
        this.ctrWidth = this._width - this.marginLeft - this.marginRight
        this.ctrHeight = this._height - this.marginTop - this.marginBottom

        // Bar Scale
        if (options.barScale) {
          this.barScale = (options.barScale) ? options.barScale : 1
          this.ctrWidth = d3.max([this.ctrWidth * this.barScale, 1])
        }

        // Scales
        this.xScale = d3.scaleLinear()
          .rangeRound([0, this.ctrWidth])
          .domain([this.yMin(), this.yMax()])

        this.yScale = d3.scaleBand()
          .rangeRound([0, this.ctrHeight])
          .domain(this.xDomain())
          .paddingInner(0.3)
          .paddingOuter(0.1)

        this.chart = d3.select(this.chartDiv).append('svg')
          .attr('class', 'horizontal-stacked-bar-chart')
          .attr('transform', `translate(${ this.marginLeft }, ${ this.marginTop })`)
      }

      // chart colors
      this.primaryColor = options.primaryColor || '#37253c' // theme.palette.explore[700]
      this.secondaryColor = options.secondaryColor || '#c4d99b' // theme.palette.explore[100]

      this.color = (flipColorRange = false, scaleLinear = false) => {
        let color

        if (options.colorRange) {
          color = d3.scaleOrdinal().domain(this.xDomain).range(options.colorRange)
        }
        else {
          if (scaleLinear) {
            color = d3.scaleLinear()
              .domain([0, this.options.yOrderBy.length > 0 ? this.options.yOrderBy.length - 1 : 0 || 4])
              .range(flipColorRange ? [this.secondaryColor, this.primaryColor] : [this.primaryColor, this.secondaryColor])
          }
          else {
            const colorDomain = flipColorRange
              ? [this.options.yOrderBy.length > 0 ? this.options.yOrderBy.length - 1 : 0 || 4, 0]
              : [0, this.options.yOrderBy.length > 0 ? this.options.yOrderBy.length - 1 : 0 || 4]
            color = d3.scaleSequential(d3.interpolateViridis)
              .domain(colorDomain)
          }
        }
        return color
      }

      // console.debug('this yo:', this)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  draw () {
    try {
      this.chart.selectAll('.stacked-bar-chart-background').remove()
      this.addBackgroundRect()
      if (!this.horizontal) {
        this._maxExtend()
        this._chart()
        this._xCenterLine()
        this._yAxis()
        this._xLabels()
        this.xAxisGroup()
      }
      else {
        this._horizontalChart()
      }

      this._legend()
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  maxExtent () {
    try {
      const maxValue = this.yMax()
      const maxValueExtent = Math.ceil(maxValue * (1 + this.extentPercent))
      return this.getMetricLongUnit(d3.format(this.setSigFigs(maxValue, maxValueExtent))(maxValueExtent))
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  _xCenterLine () {
    try {
      const self = this
      self.chart.selectAll('.x-centerline').remove()
      const centerLine = () => d3.axisBottom(self.xScale)
        .tickSize(1)
        .tickFormat('')

      self.chart.append('g')
        .attr('class', 'x-centerline')
        .attr('transform', `translate(0, ${ self.yScale(0) })`)
        .attr('fill', '#bdbdbd')
        .attr('stroke-width', 1)
        .call(centerLine())
    }
    catch (err) {
      console.error('Error with _xAxis: ', err)
    }
  }

  _yAxis () {
    try {
      const self = this
      self.chart.selectAll('.y-axis').remove()
      const createYAxis = () => (d3.axisLeft(self.yScale).ticks(3).tickSize(0).tickFormat(d => {
        if (d > 1000000000) {
          return `${ d / 1000000000 }B`
        }
        else if (d >= 1000000 && d < 1000000000) {
          return `${ d / 1000000 }M`
        }
        else if (d < 1000000 && d >= 1000) {
          return `${ d / 1000 }K`
        }
        else if (d < 1000 && d >= 0) {
          return `${ d / 100 }`
        }
        else if (d > -1000 && d < 0) {
          return `${ d / 100 }`
        }
        else if (d <= -1000 && d > -1000000) {
          return `${ d / 1000 }K`
        }
        else if (d <= -1000000 && d > -1000000000) {
          return `${ d / 1000000 }M`
        }
        else if (d > parseFloat(-1000000000)) {
          return `${ d / 1000000000 }B`
        }
      }))

      self.chart.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${ self.marginLeft }, 0)`)
        .call(createYAxis())
        .selectAll('text')
    }
    catch (err) {
      console.warn('Error creating _yAxis: ', err)
    }
  }

  xLabels (values) {
    return values
  }

  _xLabels () {
    try {
      const self = this
      self.chart.selectAll('.x-axis').remove()
      const xLabels = self.xLabels(self.xDomain())
      const createXAxis = () => (d3.axisBottom(self.xScale).tickSize(0).tickFormat((d, i) => {
        return xLabels[i]
      }))
      const rotate = self.options.xRotate || 0
      let x = 0
      const y = 8
      if (rotate !== 0) {
        x = -11
      }
      self.chart.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${ self._height - self.marginBottom })`)
        .call(createXAxis())
        .selectAll('g')
        .attr('class', (d, i) => {
          return i === self.selectedIndex ? 'tick active' : 'tick'
        })
        .selectAll('text')
        .attr('transform', 'rotate(' + rotate + ')')
        .attr('x', x)
        .attr('y', y)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  // addGroupLines
  xAxisGroup () {
    try {
      if (this.xGroups) {
        const self = this
        const groupLines = this.chart.append('g').attr('class', 'x-axis-groups')
        const groupItemWidth = (self._width / self.data.length)
        const padding = (self.xScale.bandwidth() * 0.2)
        let xPos = self.marginLeft

        Object.keys(self.xGroups).sort().map((name, index) => {
          const groupLineWidth = xPos + (groupItemWidth * self.xGroups[name].length) - (padding + self.marginRight)

          groupLines.append('line')
            .attr('x1', xPos + padding)
            .attr('x2', groupLineWidth)
            .attr('stroke', '#a7bcc7')
            .attr('stroke-width', 1)
	          .attr('transform', 'translate(' + [0, self._height + 4 - self.marginBottom / 2] + ')')

          groupLines.append('text')
            .attr('x', ((xPos + padding) / 2) + (groupLineWidth / 2))
            .attr('y', self._height)
            .attr('text-anchor', 'middle')
            .text(name)

	        xPos = groupLineWidth + padding
        })
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  _maxExtend () {
    try {
      const self = this

      this.chart.selectAll('.maxExtent').remove()
      const maxExtentGroup = self.chart.append('g').attr('class', 'maxExtent')

      const maxExtentValue = this.maxExtent()

      maxExtentGroup.append('text')
        .attr('width', self._width)
        .attr('x', 5)
        .attr('y', (self.maxExtentLineY - 5))
        .style('text-align', 'left')
        .text((self.units === 'dollars' || self.units === '$') ? ['$', maxExtentValue].join('') : [maxExtentValue, self.units].join(' '))

      maxExtentGroup.append('line')
        .attr('x1', 0)
        .attr('x2', self._width)
        .attr('stroke', '#a7bcc7')
        .attr('stroke-dasharray', [5, 5])
        .attr('stroke-width', 1)
        .attr('transform', 'translate(' + [0, self.maxExtentLineY] + ')')
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  _chart () {
    console.log('_chart')
    try {
      const self = this
      const stack = d3.stack()
	      .keys(this.yGroupings())
        .offset(d3.stackOffsetDiverging)

      const color = this.color()

      this.chart.append('g')
        .attr('class', 'bars')
        .selectAll('g')
        .data(self.xDomain())
        .enter().append('g')
        .attr('height', (self._height - self.marginTop))
        .attr('width', self.xScale.bandwidth())
        .style('fill', (d, i) => {
          return color(i)
        })
        .attr('transform', d => 'translate(' + (self.xScale(d) + ',0)'))
        .attr('class', (d, i) => {
          return i === self.selectedIndex ? 'bar active' : 'bar'
        })
        .attr('tabindex', 0)
        .on('mouseenter', (d, i) => {
          self.currentIndex = i
        })
        .on('mouseleave', (d, i) => {
          self.currentIndex = self.selectedIndex
        })
        .selectAll('g')
        .data((d, i) => {
          const yd = self.yGroupData(d)
          const r = stack([yd])
          return r
        })
        .enter().append('g')
        .attr('class', (d, i) => {
          return `stacked-bar-chart-${ i }`
        })
        .style('fill', (d, i) => {
          return color(i)
        })
        .append('rect')
        .attr('y', d => {
          const y = self.yScale(d[0][1]) || 0
          return y
        })
        .attr('height', function (d) {
          // console.debug('height: ', d)
          return (self.yScale(d[0][0]) - self.yScale(d[0][1])) || 0
        })
        .attr('width', self.maxBarSize())
        .attr('x', self.barOffsetX())
        .on('click', function (d, i) {
          // console.debug(' onclick:', d)
          self._onSelect(this, d)
          self._onClick(this, d)
        })
        .on('mouseover', function (d, i) {
          self._onMouseover(this, d)
        })
        .on('mouseenter', function (d, i) {
          self._onHover(this, d, true)
        })
        .on('mouseleave', function (d) {
          self._onHover(this, d, false)
        })

      if (self.selectedIndex) {
        const selectedElement = d3.selectAll('.active')
        selectedElement
          .style('fill', (d, i) => color(i))
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  _horizontalChart () {
    const self = this
    const color = this.color()
    const stack = d3.stack()
	    .keys(self.yGroupings())
      .offset(d3.stackOffsetDiverging)

    const chartTooltip = this.chartTooltip

    // Define the div for the tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.85)')
      .style('border-radius', '4px')
      .style('z-index', '999')
      .style('text-align', 'center')
      .style('color', 'white')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('display', 'none')

    try {
      // Draw horizontal chart
      this.chart.append('g')
        .attr('class', 'bars')
        .selectAll('g')
        .data(self.xDomain())
        .enter().append('g')
        .attr('height', self._height)
        .attr('width', self._width)
        .attr('fill', d => {
          return null
        })
        .attr('transform', d => `translate(0, ${ self.yScale(d) })`)
        .attr('class', (d, i) => {
          return i === self.selectedIndex ? 'bar active' : 'bar'
        })
        .attr('tabindex', 0)
        .on('mouseenter', (d, i) => {
          self.currentIndex = i
        })
        .on('mouseleave', (d, i) => {
          self.currentIndex = self.selectedIndex
        })
        .selectAll('g')
        .data(d => {
          const yd = self.yGroupData(d)
          const r = stack([yd])
          return r
        })
        .enter().append('g')
        .attr('class', (d, i) => {
          return `stacked-bar-chart-${ i }`
        })
        .attr('fill', (d, i) => {
          return color(i)
        })
        .append('rect')
        .attr('data-key', d => d.key)
        .attr('y', d => {
          return self.yScale(d[0][1]) || 0
        })
        .attr('x', d => {
          return self.xScale(d[0][0]) || 0
        })
        .attr('width', d => {
          return (self.xScale(d[0][1]) - self.xScale(d[0][0])) || 0
        })
        .attr('height', self.yScale.bandwidth())
        .on('click', function (d, i) {
          // console.debug(' onclick:', d)
          self._onSelect(this, d)
          self._onClick(this, d)
        })
        .on('mouseover', function (d, i) {
          if (chartTooltip(d)[0] !== undefined && chartTooltip(d)[0] !== '') {
            self._onMouseover(this, d)
            tooltip
              .style('opacity', 1)
              .style('display', 'block')
              .style('padding', '4px')
          }
        })
        .on('mouseenter', function (d, i) {
          self._onHover(this, d, true)
        })
        .on('mouseleave', function (d) {
          self._onHover(this, d, false)
        })
        .on('mousemove', function (d) {
          if (chartTooltip(d)[0] !== undefined) {
            tooltip
              .html(`${ chartTooltip(d)[0] }<br>${ chartTooltip(d)[1] }`)
              .style('left', (d3.event.pageX + 10) + 'px')
              .style('top', (d3.event.pageY + 10) + 'px')
          }
        })
        .on('mouseout', function (d) {
          if (chartTooltip(d)[0] !== undefined) {
            self._onMouseout(this, d)
          }
          tooltip.style('opacity', 0)
        })

      if (self.selectedIndex) {
        const selectedElement = d3.selectAll('.active')
        selectedElement
          .style('fill', (d, i) => color(i))
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  select (index) {
    try {
      // console.debug("INdex: ", index, "I: ", this.selectedIndex)
      d3.selectAll('.bar').filter((d, i, nodes) => {
        if (i === index) {
          const selectedElement = d3.selectAll('.active') // element.parentNode.querySelector('[selected=true]')
          if (selectedElement) {
            selectedElement.attr('selected', false)
            selectedElement.attr('class', 'bar')
          }
          d3.select(nodes[i]).attr('class', 'bar active')
        }
      })
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  _legend () {
    try {
      let legend

      if (this.legend) {
        legend = this.legend
      }
      else {
        legend = this.createLegend()
      }

      this.legend = legend
      this.updateLegend()
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  legendHeaders (h) {
    // stub for public function
    // default return headers
    return h
  }

  _legendHeaders (xValue) {
    try {
      this.getSelected()
      let r = []

      // reduce this.data down to same length as yGroup
      const data = this.data.filter(item => item[this.options.yOrderBy] === this.data[0][this.options.yOrderBy])

      if (this.options.yGroupBy) {
        r = [this.options.yGroupBy, xValue || this.xSelectedValue]
      }
      else {
        r = [this.yAxis, xValue || this.xSelectedValue]
      }

      r = this.legendHeaders(r, { ...data })

      return r
    }

    catch (err) {
      console.warn('Error: ', err)
    }
  }

  createLegend (xValue) {
    try {
      const self = this

      d3.select(this.node).selectAll('.legend-table').remove()
      d3.select(this.node).selectAll('.legend-rect').remove()
      const headers = this._legendHeaders(xValue)
      const table = d3.select(this.legendDiv).append('table')
        .attr('class', 'legend-table')
      const thead = table.append('thead')

      table.append('tbody')

      // append the header row
      thead.append('tr')
        .selectAll('th')
        .data(headers)
        .enter()
        .append('th')
        .style('text-transform', (d, i) => {
          if (self.showLegendUnits) {
            if (i < 1) {
              return 'capitalize'
            }
            else {
              return 'inherit'
            }
          }
          else {
            return 'inherit'
          }
        })
        .attr('colspan', (d, i) => {
          if (i < 1) {
            return 2
          }
          else {
            return 1
          }
        })
        .text(function (column, i) {
          if (self.showLegendUnits) {
            return i === 2 ? `${ column } (${ self.units })` : column
          }
          else {
            return column
          }
        })
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  updateLegend (newData) {
    try {
      const self = this

      d3.select(this.node).selectAll('.legend-table tbody tr').remove()
      d3.select(this.node).selectAll('.legend-rect').remove()

      const legendReverse = this.legendReverse
      const horizontal = this.horizontal
      const data = newData || this.selectedData()
      const tbody = d3.select(this.node).selectAll('.legend-table tbody')
      const color = this.color(true)
      const yOrderBy = this.options.yOrderBy
      const labels = this.yGroupings()

      let dataArr

      if (horizontal) {
        dataArr = Object.keys(data).map((key, i) => {
          return [labels[i], undefined, data[labels[i]]]
        }).reverse()
      }
      else {
        dataArr = yOrderBy.map((key, i) => {
          // return [key, undefined, data[key] || '-']
          return [key, data[key] || '-']
        })
      }

      // console.log('dataArr: ', dataArr)

      if (legendReverse) {
        dataArr = dataArr.reverse()
      }

      // create a row for each object in the data
      const tr = tbody.selectAll('tr')
        .data(dataArr)
        .enter()
        .append('tr')

      // append color blocks into tr first cell
      tr.append('td')
        .append('div')
        .attr('class', 'legend-rect')
        .append('svg')
        .attr('viewBox', '0 0 20 20')
        .style('fill', (d, i) => {
          return color(i)
        })
        .append('rect')
        .attr('width', 20)
        .attr('height', 20)
        .style('background-color', (d, i) => {
          return color(i)
        })
        .style('border', (d, i) => {
          return `1px solid ${ color(i) }`
        })

      // create a cell in each row for each column

      tr.append('td')
        .html(function (d, i) {
          return self._legendFormat(d[0])
        })
      tr.append('td')
        .html(function (d, i) {
          return self._legendFormat(d[1])
        })
      // tr.append('td')
      //   .html(function (d, i) {
      //     return self._legendFormat(d[2])
      //   })

      const total = Object.keys(data).reduce((sum, key) => sum + data[key], 0)

      const tfooter = tbody.append('tr')

      tfooter.append('td')
        .attr('colspan', 2)
        .style('font-weight', 'bold')
        .html('Total')

      // tfooter.append('td')

      tfooter.append('td')
        .style('font-weight', 'bold')
        .html(self._legendFormat(total))
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  legendFormat (d) {
    // default format
    return d
  }

  _legendFormat (d) {
    try {
      if (isNaN(d)) {
        return d
      }
      else {
        return this.legendFormat(d)
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  _onClick (e, d) {
    if (this.options.disableInteraction) return
    try {
      // console.debug('_onClick: ', e,d)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  onClick (d) {
    // console.debug('_onClick: ', d)
    return d
  }

  _onSelect = (element, data) => {
    if (this.options.disableInteraction) return
    try {
      console.debug('_onSelect this:', this)
      // console.log('_onSelect: ', element)
      const selectedElement = d3.select(this.node).selectAll('.bars .active')
      const bars = d3.select(this.node).selectAll('.bars .bar')
      const ticks = d3.select(this.node).selectAll('.x-axis .tick')
      const groupedData = this.getGroupedData()

      // console.debug(data)
      if (selectedElement) {
        selectedElement
          .attr('selected', false)
          .attr('class', 'bar')
      }

      bars.filter((d, i, nodes) => {
        nodes[this.currentIndex]
          .setAttribute('class', 'bar active')
          .setAttribute('selected', true)
          .setAttribute('tabindex', 0)
      })

      ticks.forEach((d, i, nodes) => {
        nodes[this.selectedIndex]
          .setAttribute('class', 'tick')

        nodes[this.currentIndex]
          .setAttribute('class', 'tick active')
      })

      this.selectedData(groupedData[this.currentIndex] || data[0].data)
      // this._legend()
      this.getSelected()
      this.onSelect(this)

      this.handleBarHover(this._xDomain[this.currentIndex] || this.xSelectedValue)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  onSelect (d) {
    // console.debug('onSelect: ', d)
  }

  _onMouseover = (element, data) => {
    if (this.options.disableInteraction) return
    try {
      const selectedElement = d3.selectAll('.bars .active')

      const tbody = d3.select(this.legendDiv).selectAll('tbody')
      const legendRows = tbody.selectAll('tr')
      const selectedRowIndex = data && data.index
      const selectedLegendRow = legendRows._groups[0][selectedRowIndex]
      const groupedData = this.getGroupedData()

      if (selectedRowIndex !== null && selectedElement) {
        d3.select(selectedLegendRow)
          .transition()
          .duration(200)
          .style('background', '#e0e0e0')
          .style('font-weight', 'bold')
      }

      if (selectedElement) {
        selectedElement.attr('selected', false)
        selectedElement.attr('class', 'bar')
      }
      const activeElement = element.parentNode.parentNode
      activeElement.setAttribute('tabindex', 0)
      this.selectedData(groupedData[this.currentIndex] || data[0].data)
      // this._legend()
      this.onMouseover(this)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  onMouseover (d) {
    if (this.options.disableInteraction) return
    return d
  }

  _onMouseout (element, data) {
    if (this.options.disableInteraction) return
    try {
      const tbody = d3.select(this.legendDiv).selectAll('tbody')
      const legendRows = tbody.selectAll('tr')
      const selectedRowIndex = data && data.index
      const selectedLegendRow = legendRows._groups[0][selectedRowIndex]

      if (selectedRowIndex !== null) {
        d3.select(selectedLegendRow)
          .transition()
          .duration(200)
          .style('background', 'none')
          .style('font-weight', 'normal')
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  _onHover = (element, data, hover) => {
    if (this.options.disableInteraction) return
    try {
      const horizontal = this.horizontal
      const groupedData = this.getGroupedData()
      const ticks = d3.select(this.node).selectAll('.x-axis .tick')

      if (hover === true) {
        if (!horizontal) {
          this.createLegend(this._xDomain[this.currentIndex])
          this.updateLegend(groupedData[this.currentIndex] || data[0].data)
        }

        this.handleBarHover(this._xDomain[this.currentIndex] || this.xSelectedValue)

        ticks.filter((d, i, nodes) => {
          nodes[this.selectedIndex]
            .setAttribute('class', 'tick')
          nodes[this.currentIndex]
            .setAttribute('class', 'tick active')
        })
      }
      else {
        this.createLegend(this._xDomain[this.xSelectedValue])
        this.updateLegend()

        this.handleBarHover(this.xSelectedValue)

        ticks.filter((d, i, nodes) => {
          nodes[this.currentIndex]
            .setAttribute('class', 'tick')
          nodes[this.selectedIndex]
            .setAttribute('class', 'tick active')
        })
      }
      this.onHover(this)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  onHover (d) {
    if (this.options.disableInteraction) return
    // console.debug('D3StackedBarChart onHover: ', d)
    return d
  }

  barOffsetX () {
    try {
      if (this.options.barSize) {
        return (this.xScale.bandwidth() > this.options.barSize) ? (this.xScale.bandwidth() - this.options.barSize) / 2 : 0
      }
      else {
        return 0
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  maxBarSize () {
    try {
      if (this.options.barSize) {
        return d3.min([this.xScale.bandwidth(), this.options.barSize])
      }
      else {
        return this.xScale.bandwidth()
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  xDomain () {
    try {
      const r = this.data.map((row, i) => {
        return row[this.xAxis]
      })
      // const domain = [...(new Set(r.sort((a, b) => a - b)))]
      const domain = [...(new Set(r))]
      this._xDomain = domain
      return domain
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  yDomain () {
    try {
      const r = Array.from(d3.rollup(this.data, v => d3.sum(v, i => i[this.yAxis]), d => d[this.xAxis]).values())
      const domain = [...(new Set(r.sort((a, b) => a - b)))]
      this._yDomain = domain
      return domain
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  yOrder () {
    console.log('yOrder')
    if (this.options.yOrderBy && this.options.yGroupBy) {
      if (typeof (this.options.yOrderBy) === 'object') {
        console.log('yOrder 1')
        this.yOrderBy = this.options.yOrderBy
      }
      else if (typeof (this.options.yOrderBy) === 'string') {
        console.log('yOrder 2')
        /*d3.nest()
          .key(k => k[this.options.yGroupBy])
          .rollup(v => d3.sum(v, d => d[this.yAxis]))
          .entries(this.data)
          .reduce((acc, d, i) => {
            acc[d.key] = d.value
            return acc
          }, {})*/
      }
      else {
        console.log('yOrder 3')
        /*d3.nest()
          .key(k => k[this.options.yGroupBy])
          .rollup(v => d3.sum(v, d => d[this.yAxis]))
          .entries(this.data)
          .reduce((acc, d, i) => {
            acc[d.key] = d.value
            return acc
          }, {})*/
        // console.debug("else", r)
      }
    }
  }

  yGroupings (xValue) {

    try {
      if (this.options.yGroupBy) {
        const data = xValue ? this.data.filter(r => r[this.xAxis] === xValue) : this.data
        const r = d3.groups(data, d => d[this.options.yGroupBy])
          .sort((a, b) => this.options.yOrderBy.indexOf(a[0]) - this.options.yOrderBy.indexOf(b[0]))
          .map(y => y[0])
        return r.reverse()
      }
      else {
        const data = xValue ? this.data.filter(r => r[this.xAxis] === xValue) : this.data
        const r = d3.groups(data, d => d[this.yAxis])
          .map(y => y[0])
        return r.reverse()
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  groupData () {
    try {
      console.log('groupData')
      const r = [] /* d3.nest()
        .key(k => k[this.xAxis])
        .entries(this.data)*/

      // console.debug("RRRR: ", r)
      return r
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  yGroupData (xValue) {
    try {
      console.log('yGroupData')
      if (this.options.yGroupBy) {
        const data = xValue ? this.data.filter(r => r[this.xAxis] === xValue) : this.data
        // console.debug(data)
        const r = Array.from(d3.rollup(data, v => d3.sum(v, i => i[this.yAxis]), d => d[this.options.yGroupBy])).reduce((acc, d, i) => {
          acc[d[0]] = d[1]
          return acc
        }, {})

        // console.debug("yGroupData: ",r)
        return r
      }
      else {
        return this.yAxis
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  xMin () {
    try {
      return this.xDomain().shift()
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  xMax () {
    try {
      return this.xDomain().pop()
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  yMin () {
    try {
      const data = this.data
      const groupTotals = []
      /*d3.nest()
        .key(k => k[this.xAxis])
        .key(k => k[this.options.yGroupBy])
        .rollup((d, i) => {
          return {
            total: d3.sum(d, d => d.sum)
          }
        })
        .entries(data)
        .map(d => {
          // console.log('map d', d)
          d.values.forEach(v => groupTotals.push(v.value.total))
        })*/

      const minVal = d3.min(groupTotals)
      const yMin = (minVal < 0) ? minVal * 1.5 : 0
      return yMin
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  yMax () {
    try {
      return this.yDomain().pop()
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  xaxis () {
    return this._columns[0]
  }

  xdomain () {
    try {
      const r = this.data.map((d, i) => d[this.xaxis()])
      // console.debug(r);
      return r
    }
    catch (err) {
      console.warn('error in xdomain:', err)
    }
  }

  ydomain (row) {
    try {
      const allowed = this.yaxis()
      const filtered = Object.keys(row)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = row[key]
          return obj
        }, {})

      return filtered
    }
    catch (err) {
      console.warn('error in ydomain:', err)
    }
  }

  yaxis () {
    return this._columns.slice(1)
  }

  columns (value) {
    if (value) {
      this._columns = value
    }
    return this._columns
  }

  yLabels (value) {
    if (value) {
      this._yLabels = value
    }
    return this._yLabels
  }

  colors (value) {
    if (value) {
      this._colors = value
    }
    return this._colors
  }

  selectedData (value) {
    if (value) {
      this._selectedData = value
    }
    return this._selectedData
  }

  getGroupedData (value) {
    if (value) {
      this._groupedData = value
    }
    return this._groupedData
  }

  height (value) {
    if (value) {
      this._height = value
      this.chart.attr('height', value)
    }
    return this._height
  }

  width (value) {
    if (value) {
      this._width = value
      this.chart.attr('width', value)
    }
    return this._width
  }

  max () {
    const values = this.data.map((row, i) => {
      const t = this.yaxis().reduce((total, col, i) => {
        return total + row[col]
      }, 0)
      return t
    })
    return d3.max(values)
  }

  min () {
    const values = this.data.map((row, i) => {
      const t = this.yaxis().reduce((total, col, i) => {
        return total + row[col]
      }, 0)
      return t
    })
    return d3.min(values)
  }

  formatLegend (options) {
    try {
      if (options) {
        this._formatLegend = options
      }
      return this._formatLegend
    }

    catch (err) {
      console.warn('error in formatOptions:', err)
    }
  }

  getOrderedKeys (data) {
    return Object.keys((data[0][Object.keys(data[0])[0]])[0])
  }

  getSelected () {
    const allGroupedData = []
    d3.select(this.node).selectAll('.bar').filter((d, i, nodes) => {
      if (nodes[i].className.baseVal.match(/active/)) {
        this.xSelectedValue = d
        this.ySelectedGroup = this.yGroupData(d)
        this.selectedData(this.ySelectedGroup)
        this.selectedIndex = i
      }

      allGroupedData.push(this.yGroupData(d))
    })
    this.getGroupedData(allGroupedData)
  }

  getCurrentIndex (value) {
    if (value) {
      this.currentIndex = value
    }
    return this.currentIndex
  }

  toggleSelectedBar = (element, data, callBack) => {
    const selectedElement = d3.selectAll('.active') // element.parentNode.querySelector('[selected=true]')

    if (selectedElement) {
      selectedElement.attr('selected', false)
      selectedElement.attr('class', 'bar')
    }
    const activeElement = element.parentNode.parentNode
    activeElement.setAttribute('class', 'bar active')
    activeElement.setAttribute('selected', true)
    activeElement.setAttribute('tabindex', 0)
    this.selectedData(data[0].data)
    this.addLegend()
    this.getSelected()
    if (callBack) {
      callBack(data)
    }
  }

  // eslint-disable-next-line camelcase
  dep_addChart (data) {
    if (data) {
      this.data = data
    }
    const self = this
    const stack = d3.stack()
	  .keys(this.yaxis())
	  .offset(d3.stackOffsetNone)

    // console.debug(xwidth);
    const keys = this.yaxis()
    this.chart.append('g')
      .attr('class', 'bars')
      .selectAll('g')
      .data(self.data)
      .enter().append('g')
      .attr('height', (self._height - self.marginTop))
      .attr('width', self.xScale.bandwidth())
      .attr('transform', d => 'translate(' + (self.xScale(d[self.xaxis()]) + ',0)'))
      .attr('class', (d, i) => i === self.selectedIndex ? 'bar active' : 'bar')
      .attr('data-key', d => Object.keys(d)[0])
      .attr('tabindex', 0)
      .selectAll('g')
      .data(d => {
        // console.debug("ROW", d)
        const yd = self.ydomain(d)

        // console.debug("YD", yd)
        const r = stack([yd])
        // console.debug("STACK", r);
        return r
      })
      .enter().append('g')
    //    .attr('class', d => self.styleMap && self.styleMap[d.key])
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
      .on('click', function (d) {
        // console.debug(' onclick:', d)
        self.toggleSelectedBar(this, d, self.onSelect(d))
        self.onClick(self)
      })
      .on('mouseover', function (d) {
        self.toggleSelectedBar(this, d, self.onSelect(d))
        self.onClick(self)
      })
  }

  drawDep () {
    if (this.data === undefined) {
      return
    }

    this.chart.selectAll('#backgroundRec').remove()
    this.addBackgroundRect()

    this.chart.selectAll('.maxExtent').remove()
    this.addMaxExtent()

    this.chart.selectAll('.bars').remove()
    this.addChart(this.data)

    this.chart.selectAll('.x-axis').remove()

    this.addXAxis(this.xLabels())

    // Add Grouping Lines
    this.chart.selectAll('.groups').remove()
    this.addGroupLines()

    this.addLegend()
  }

  addMaxExtent (units) {
    try {
      const self = this
      // Add Max Extent Number text
      const maxExtentGroup = self.chart.append('g').attr('class', 'maxExtent')
      const maxExtentValue = this.calculateExtentValue(this.maxValue)
      if (!units) {
        units = ''
      }
      maxExtentGroup.append('text')
        .attr('width', self._width)
        .attr('x', self._width)
        .attr('y', (self.maxExtentLineY - 5))
        .attr('text-anchor', 'end')
        .text((units === 'dollars' || units === '$') ? ['$', maxExtentValue].join('') : [maxExtentValue, units].join(''))

      maxExtentGroup.append('line')
        .attr('x1', 0)
        .attr('x2', self._width)
        .attr('stroke', '#a7bcc7')
        .attr('stroke-dasharray', [5, 5])
        .attr('stroke-width', 1)
        .attr('transform', 'translate(' + [0, self.maxExtentLineY] + ')')
    }
    catch (e) {
      console.warn('Error in addMaxExtent', e)
    }
  }

  addXAxis (xLabels) {
    const self = this
    /*    const createXAxis = () => (d3.axisBottom(self.xScale).tickSize(0).tickFormat((d, i) => {
          console.debug('---------------tickFormat: ', d, i, xLabels)
          return (xLabels) ? xLabels[i] : d
          }))
    */
    const createXAxis = () => (d3.axisBottom(self.xScale).tickSize(0).tickFormat((d, i) => {
      return xLabels[i]
    }))
    const rotate = this.options.xRotate || 0
    let x = -1
    const y = 8
    if (rotate !== 0) {
      x = -11
    }
    self.chart.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + (self._height - self.marginBottom) + ')')
      .call(createXAxis())
      .selectAll('text')
      .attr('transform', 'rotate(' + rotate + ')')
      .attr('x', x)
      .attr('y', y)
  }

  addGroupLines () {
    if (this.groups) {
      const self = this

      const groupLines = this.chart.append('g').attr('class', 'groups')
      const groupItemWidth = (self._width / self.te.length)
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

  createTable () {
    d3.selectAll('.legend-table').remove()
    this.getSelected()

    const columns = this.options.columnNames
    columns.splice(this.options.columnNames.length - 1, 1, this.selectedFiscalYear)
    const table = d3.select(this.legendDiv).append('table')
      .attr('class', 'legend-table')
    const thead = table.append('thead')

    table.append('tbody')

    // append the header row
    thead.append('tr')
      .selectAll('th')
      .data(columns)
      .enter()
      .append('th')
      .text(function (column) {
        return column
      })
  }

  updateTable () {
    d3.selectAll('.legend-table tbody tr').remove()
    this.getSelected()

    const data = this.selectedData()
    const columns = this.options.columnNames
    columns.splice(this.options.columnNames.length - 1, 1, this.selectedFiscalYear)

    const labels = this.yLabels()
    const formatLegend = this.formatLegend()
    // const table = d3.selectAll('.legend-table')
    const tbody = d3.selectAll('.legend-table tbody')

    // turn object into array to play nice with d3
    const dataArr = Object.keys(data).map((key, i) => {
      return ['', labels[i], data[key]]
    }).reverse()

    // create a row for each object in the data
    const tr = tbody.selectAll('tr')
      .data(dataArr)
      .enter()
      .append('tr')

    // append color blocks into tr first cell
    tr.append('td')
      .append('rect')
      .attr('class', 'legend-rect')
      .attr('width', 15)
      .attr('height', 15)
      .style('opacity', (d, i) => ((i + 1) / labels.length))

    // create a cell in each row for each column
    tr.selectAll('td')
      .data(function (row, i) {
        return columns.map(function (column, i) {
          return { column: column, value: row[i] }
        })
      })
      .enter()
      .append('td')
      .html(function (d) {
        if (Number.isInteger(d.value)) {
          return formatLegend(d.value, 0)
        }
        else {
          return d.value
        }
      })
  }

  addLegend () {
    let legend = this.createTable()

    if (this.legend) {
      this.legend.selectAll('.legend-table').remove()
      this.legend.selectAll('.legend-rect').remove()
      legend = this.legend
    }
    else {
      this.updateTable()
    }

    this.legend = legend
  }

  getMetricLongUnit (str) {
    try {
      const suffix = { k: 'k', M: ' million', G: ' billion' }
      return str.replace(/(\.0+)?([kMG])$/, function (_, zeroes, s) {
        return suffix[s] || s
      })
    }
    catch (err) {
      console.warn('error in formatOptions:', err)
    }
  }

  calculateExtentValue (maxValue) {
    const maxValueExtent = Math.ceil(maxValue * (1 + this.extentPercent))
    return this.getMetricLongUnit(d3.format(this.setSigFigs(maxValue, maxValueExtent))(maxValueExtent))
  }

  crawlCeil (ymax, ceilMax, i) {
    try {
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
    catch (err) {
      console.warn('error: ', err)
    }
  }

  setSigFigs (ymax, ceilMax) {
    try {
      let sigFigs = ''
      let SF = 0
      while (sigFigs.length < 3) {
        SF++
        sigFigs = this.crawlCeil(ymax, ceilMax, SF)
      }
      return sigFigs
    }
    catch (err) {
      console.warn('error: ', err)
    }
  }

  addBackgroundRect () {
    this.chart.append('rect')
      .attr('class', 'stacked-bar-chart-background')
      // .attr('id', 'backgroundRect') // need unique ids for accessibility score
      .style('opacity', 0.0)
      .attr('y', 0)
      .attr('height', this._height)
      .attr('width', this._width)
      .attr('x', 0)
  }

  // Circle tooltips
  chartTooltip (data, xAxis, yAxis) {
    const r = ['', '']
    return r
  }

  _chartTooltip (data) {
    try {
      const r = this.chartTooltip(data)
      return r
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }
}

/**
 * This is a format transform that turns a value
 * into its si equivalent
 *
 * @param {String} str the formatted string
 * @return {String} the string with a specified number of significant figures
 */
const siValue = (function () {
  const suffix = { k: 1000, M: 1000000, G: 1000000000 }
  return function (str) {
    try {
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
    catch (err) {
      console.warn('error: ', err)
    }
  }
})()
