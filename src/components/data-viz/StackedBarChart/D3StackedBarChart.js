'use strict'
import * as d3 from 'd3'
import { isEnumMember } from 'typescript'

export default class D3StackedBarChart {
  constructor (node, data, options, formatLegendFunc) {
    try {
      this.node = node

      if (data && data.length > 0) {
        // console.debug('data:', data)
        this.data = data
      }
      else {
        console.warn('Stacked barchart must have data, erroring out')
        return false
      }

      this.options = options
      // console.debug('D3StackedBarChart options: ', options)
      this._height = (node.children[0].clientHeight > 0) ? node.children[0].clientHeight : 400
      this._width = (node.children[0].clientWidth <= 0) ? 300 : node.children[0].clientWidth
      this.xAxis = options.xAxis || console.error('Error - no xAxis property set')
      this.yAxis = options.yAxis || console.error('Error - no yAxis property set')
      this.marginBottom = options.marginBottom || 40
      this.marginTop = options.marginTop || 25
      this.units = (options.units) ? options.units : ''
      this.horizontal = options.horizontal
      this.showLegendUnits = options.showLegendUnits
      if (this.horizontal) {
        const h = this._height
        const w = this._width
        this._width = h
        this._height = w

        // reset margins
        this.marginLeft = 0
        this.marginTop = 0
        this.marginRight = 0
        this.marginBottom = 0
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

      this.xLabels = (typeof options.xLabels === "function") ? options.xLabels : this.xLabels
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

      this.yOrder()
      this.xScale = d3.scaleBand()
        .domain(this.xDomain())
        .range([0, this._width])
        .paddingInner(0.3)
        .paddingOuter(0.1)

      this.barScale = (options.barScale) ? options.barScale : 1
      this._height = d3.max([this._height * this.barScale, 1])
      this.yScale = d3.scaleLinear().rangeRound([this.marginTop, this._height - this.marginBottom])
      this.yScale.domain([this.yMax(), 0])
      this.chart = d3.select(this.node.children[0]).append('svg')
        .attr('height', this._height)
        .attr('width', this._width)
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
      }
      this._chart()
      if (!this.horizontal) {
        this._xLabels()
      }
      this._legend()
      if (!this.horizontal) {
        this.xAxisGroup()
      }
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

  xLabels (values) {
    return values
  }

  _xLabels () {
    try {
      this.chart.selectAll('.x-axis').remove()
      const xLabels = this.xLabels(this.xDomain())
      const self = this
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
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  // addGroupLines () {
  xAxisGroup () {
    try {
      // console.log('xAxisGroup this: ', this)
      if (this.xGroups) {
        const self = this

        const groupLines = this.chart.append('g').attr('class', 'x-axis-groups')
        const groupItemWidth = (self._width / self.data.length)
        const padding = (self.xScale.bandwidth() * 0.2)
        let xPos = 0

          Object.keys(self.xGroups).sort().map((name, index) => {
	      
          const groupLineWidth = xPos + (groupItemWidth * self.xGroups[name].length) - padding

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
            .style('font-size', '1rem')
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
        .attr('x', self._width)
        .attr('y', (self.maxExtentLineY - 5))
        .attr('text-anchor', 'end')
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
    try {
      const self = this
      const stack = d3.stack()
	    .keys(this.yGroupings())
	    .offset(d3.stackOffsetNone)

      // console.debug(xwidth);
      const keys = this.yGroupings()

      //  console.debug("Group Data:", data)
      this.chart.append('g')
        .attr('class', 'bars')
        .selectAll('g')
        .data(self.xDomain())
        .enter().append('g')
        .attr('height', (self._height - self.marginTop))
        .attr('width', self.xScale.bandwidth())
        .attr('transform', d => 'translate(' + (self.xScale(d) + ',0)'))
        .attr('class', (d, i) => {
          // console.debug("D: ", d, "I: ",i)
          // console.debug("SI: ", self.selectedIndex)
          return i === self.selectedIndex ? 'bar active' : 'bar'
        })
        .on('mouseenter', (d, i) => {
          self.currentIndex = i
        })
        .on('mouseleave', d => {
          self.currentIndex = self.selectedIndex
          self._legendHeaders()
        })

        // .attr('tabindex', (d, i) => i)
        .attr('tabindex', 0)
        .selectAll('g')
        .data(d => {
          const yd = self.yGroupData(d)
          const r = stack([yd])
          return r
        })
        .enter().append('g')
        .attr('class', (d, i) => 'stacked-bar-chart-' + i)
        .attr('fill-opacity', (d, i) => (1 - (i / keys.length)))
        .append('rect')
        .attr('y', d => {
          const y = self.yScale(d[0][1]) || 0
          return y
        })
        .attr('height', function (d) {
          // console.debug(d)
          return (self.yScale(d[0][0]) - self.yScale(d[0][1])) || 0
        })
        .attr('width', self.maxBarSize())
        .attr('x', self.barOffsetX())
        .on('click', function (d) {
          // console.debug(' onclick:', d)
          self._onSelect(this, d)
          self._onClick(this, d)
        })
        .on('mouseover', function (d, i) {
        })
        .on('mouseenter', (d, i) => {
          self._onHover(this, d, true)
        })
        .on('mouseleave', function (d) {
          self._onHover(this, d, false)
        })

      // transform bars to horizontal if prop set
      if (this.horizontal) {
        const rotate = '90 ' + (this._height / 2 - 5) + ' 0'
        this.chart
          .attr('transform', 'rotate(' + rotate + ')')
          .attr('width', 20)
          .style('position', 'relative')
          .style('left', -5)
      }
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

  select (index) {
    try {
      // console.debug("INdex: ", index, "I: ", this.selectedIndex)
      d3.selectAll('.bar').filter((d, i, nodes) => {
        if (i === index) {
          /*          this.xSelectedValue = d
                      this.ySelectedGroup = this.yGroupData(d)
                      this.selectedData(this.ySelectedGroup)
                      this.selectedIndex = index
          */

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

  legendHeaders (h) {
    // stub for public function
    // default return headers
    return h
  }

  _legendHeaders (xValue) {
    try {
      let r = []
      this.getSelected()
      const xLabels = this.xLabels(this.xDomain())
      // reduce this.data down to same length as yGroup
      const rData = this.data.filter(item => item.source === this.data[0].source)
      if (this.options.yGroupBy) {
        r = [this.options.yGroupBy, '', xValue || this.xSelectedValue]
      }
      else {
        r = [this.yAxis, xValue || this.xSelectedValue]
      }

      r = this.legendHeaders(r, { ...rData[this.currentIndex], xLabel: xLabels[this.currentIndex] })

      return r
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  createLegend (newData, xValue) {
    try {
      const self = this

      d3.select(this.node).selectAll('.legend-table').remove()
      d3.select(this.node).selectAll('.legend-rect').remove()

      // const columns = this.yGroupings()

      // columns.splice(this.options.columnNames.length - 1, 1, this.selectedFiscalYear)
      const headers = this._legendHeaders(xValue)
      const table = d3.select(this.node.children[1]).append('table')
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
            return 'capitalize'
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

  updateLegend (newData, xValue) {
    try {
      const self = this
      d3.select(this.node).selectAll('.legend-table tbody tr').remove()
      d3.select(this.node).selectAll('.legend-rect').remove()
      //      this.getSelected()
      const legendReverse = this.legendReverse
      const data = newData || this.selectedData()

      // console.log('updateLegend data: ', data)
      const headers = this._legendHeaders(xValue)
      const labels = this.yGroupings()
      const formatLegend = this.formatLegend()
      // const table = d3.selectAll('.legend-table')
      const tbody = d3.select(this.node).selectAll('.legend-table tbody')

      // turn object into array to play nice with d3
      let dataArr = Object.keys(data).map((key, i) => {
        return [labels[i], undefined, data[labels[i]]]
      }).reverse()

      if (this.legendReverse) {
        dataArr = dataArr.reverse()
      }
      // dataArr.push(['Total', undefined, Object.keys(data).reduce((sum, key) => sum + data[key], 0)])

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
        .style('opacity', (d, i) => {
          if (legendReverse) {
            return (i < labels.length ? (1 - ((i) / labels.length)) : 0)
          }
          else {
            return (i < labels.length ? ((i + 1) / labels.length) : 0)
          }
        }
        )

      // create a cell in each row for each column

      tr.append('td')
        .html(function (d, i) {
          return self._legendFormat(d[0])
        })
      tr.append('td')
        .html(function (d, i) {
          return self._legendFormat(d[1])
        })
      tr.append('td')
        .html(function (d, i) {
          return self._legendFormat(d[2])
        })

      const total = Object.keys(data).reduce((sum, key) => sum + data[key], 0)

      const tfooter = tbody.append('tr')

      tfooter.append('td')
        .attr('colspan', 2)
        .style('font-weight', 'bold')
        .html('Total')

      tfooter.append('td')

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
    try {
      // console.debug('_onClick: ', e,d)
      this.onClick(d)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  onClick (d) {
    // console.debug('_onClick: ', d)
  }

  _onSelect = (element, data) => {
    try {
      const selectedElement = d3.select(this.node).selectAll('.active') // element.parentNode.querySelector('[selected=true]')
      // console.debug(data)
      if (selectedElement) {
        selectedElement.attr('selected', false)
        selectedElement.attr('class', 'bar')
      }
      const activeElement = element.parentNode.parentNode
      activeElement.setAttribute('class', 'bar active')
      activeElement.setAttribute('selected', true)
      activeElement.setAttribute('tabindex', 0)
      this.selectedData(data[0].data)
      this._legend()
      this.getSelected()
      this.onSelect(this)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  onSelect (d) {
    // console.debug('onSelect: ', d)
  }

  _onMouseover = (element, data) => {
    try {
      const selectedElement = d3.selectAll('.active') // element.parentNode.querySelector('[selected=true]')
      // console.debug('_onMouseover data: ', data)
      if (selectedElement) {
        selectedElement.attr('selected', false)
        selectedElement.attr('class', 'bar')
      }
      const activeElement = element.parentNode.parentNode
      // activeElement.setAttribute('class', 'bar active')
      // activeElement.setAttribute('selected', true)
      activeElement.setAttribute('tabindex', 0)
      this.selectedData(data[0].data)
      this._legend()
      this.onMouseover(this)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  onMouseover (d) {
    console.debug('onSelect: ', d)
    return d
  }

  _onHover = (element, data, hover) => {
    try {
      // const activeElement = element.parentNode.parentNode
      const tabIndex = this.currentIndex
      if (hover === true) {
        const years = this.xDomain()

        // const tabIndex = element.parentNode.parentNode.tabIndex
        // const tabIndex = 0
        // console.debug(years,  years[tabIndex] , tabIndex)
        this.createLegend(data[0].data, years[tabIndex])
        this.updateLegend(data[0].data, years[tabIndex])
      }
      else {
        this.getSelected()
        this.select(this.index)
        this.createLegend()
        this.updateLegend()
      }
      this.onHover(this)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  onHover (d) {
    // console.debug('onSelect: ', d)
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
	//      const domain = [...(new Set(r.sort((a, b) => a - b)))]
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
      const r = d3.nest()
        .key(k => k[this.xAxis])
        .rollup(v => d3.sum(v, i => i[this.yAxis]))
        .entries(this.data)
        .map(y => y.value)
      const domain = [...(new Set(r.sort((a, b) => a - b)))]
      this._yDomain = domain
      return domain
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  yOrder () {
    if (this.options.yOrderBy && this.options.yGroupBy) {
      if (typeof (this.options.yOrderBy) === 'object') {
        this.yOrderBy = this.options.yOrderBy
      }
      else if (typeof (this.options.yOrderBy) === 'string') {
        // console.debug(this.options.yOrderBy)
        const r = d3.nest()
        //            .key(k => k[this.xAxis])
          .key(k => k[this.options.yGroupBy])
          .rollup(v => d3.sum(v, d => d[this.yAxis]))
          .entries(this.data)
          .reduce((acc, d, i) => {
            acc[d.key] = d.value
            return acc
          }, {})
        // console.debug('else if', r)
      }
      else {
        const r = d3.nest()
        //            .key(k => k[this.xAxis])
          .key(k => k[this.options.yGroupBy])
          .rollup(v => d3.sum(v, d => d[this.yAxis]))
          .entries(this.data)
          .reduce((acc, d, i) => {
            acc[d.key] = d.value
            return acc
          }, {})
        // console.debug("else", r)
      }
    }
  }

  yGroupings (xValue) {
    try {
      if (this.options.yGroupBy) {
        const data = xValue ? this.data.filter(r => r[this.xAxis] === xValue) : this.data
        const r = d3.nest()
          .key(k => k[this.options.yGroupBy])
          .entries(data)
          .map(y => y.key)
        // console.debug(r)
        return r.reverse()
      }
      else {
        const data = xValue ? this.data.filter(r => r[this.xAxis] === xValue) : this.data
        const r = d3.nest()
          .key(k => k[this.yAxis])
          .entries(data)
          .map(y => y.key)
        return r.reverse()
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  groupData () {
    try {
      const r = d3.nest()
        .key(k => k[this.xAxis])
        .entries(this.data)

      // console.debug("RRRR: ", r)
      return r
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  yGroupData (xValue) {
    try {
      if (this.options.yGroupBy) {
        const data = xValue ? this.data.filter(r => r[this.xAxis] === xValue) : this.data
        // console.debug(data)
        const r = d3.nest()
        //            .key(k => k[this.xAxis])
          .key(k => k[this.options.yGroupBy])
          .rollup(v => d3.sum(v, d => d[this.yAxis]))
          .entries(data)
          .reduce((acc, d, i) => {
            acc[d.key] = d.value
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
      return this.yDomain().shift()
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

  // oldConstructor () {
  //   this.formatLegendFunc = formatLegendFunc
  //   this.onClick = options.onClick

  //   this.formatLegend(this.formatLegendFunc)

  //   if (options && options.columns) {
  //     this._columns = options.columns
  //   }
  //   else {
  //     this._columns = Object.keys(data[0]).filter((r, i) => r !== '__typename').sort()
  //   }

  //   if (options && options.xLabels) {
  //     this.xLabels(options.xLabels)
  //   }
  //   else {
  //     this.xLabels(this.xdomain())
  //   }

  //   if (options && options.yLabels) {
  //     this.yLabels(options.yLabels)
  //   }
  //   else {
  //     this.yLabels(this.yaxis())
  //   }

  //   if (options && options.selectedIndex) {
  //     this.selectedIndex = options.selectedIndex
  //   }
  //   else {
  //     this.selectedIndex = this.data.length - 1
  //   }

  //   this.selectedData(this.ydomain(data[data.length - 1]))
  //   this.marginBottom = 40
  //   this.marginTop = 25
  //   this.maxValue = this.max(data)
  //   this.minValue = this.min(data)
  //   this.extentPercent = 0.05
  //   this.extentMarginOfError = 0.10
  //   this.maxExtentLineY = 20
  //   this._colors = ['#b33040', '#d25c4d', '#f2b447', '#d9d574']
  //   this.xScale = d3.scaleBand()
  //     .domain(this.xdomain())
  //     .range([0, this._width])
  //     .paddingInner(0.3)
  //     .paddingOuter(0.1)

  //   this.yScale = d3.scaleLinear().rangeRound([this.marginTop, this._height - this.marginBottom])
  //   this.yScale.domain([this.maxValue, 0])

  //   this.maxBarSize = undefined
  //   if (this.maxBarSize) {
  //     this.barOffsetX = (this.xScale.bandwidth() > this.maxBarSize) ? (this.xScale.bandwidth() - this.maxBarSize) / 2 : 0
  //     this.maxBarSize = d3.min([this.xScale.bandwidth(), this.maxBarSize])
  //   }
  //   else {
  //     this.maxBarSize = this.xScale.bandwidth()
  //   }
  //   this.chart = d3.select(this.node.children[0]).append('svg')
  //     .attr('height', this._height)
  //     .attr('width', this._width)
  // }

  xaxis () {
    return this._columns[0]
  }

  // xLabels (labels) {
  //   try {
  //     if (labels) {
  //       this._xLabels = labels
  //     }
  //     return this._xLabels
  //   }
  //   catch (err) {
  //     console.warn('error in xLabels:', err)
  //   }
  // }

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
      const r = []
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
  /*
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
  */

  getOrderedKeys (data) {
    return Object.keys((data[0][Object.keys(data[0])[0]])[0])
  }

  getSelected () {
    d3.select(this.node).selectAll('.bar').filter((d, i, nodes) => {
      if (nodes[i].className.baseVal.match(/active/)) {
        // console.debug("getSelected: ", i)
        this.xSelectedValue = d
        this.ySelectedGroup = this.yGroupData(d)
        this.selectedData(this.ySelectedGroup)
        // console.debug("Selecting index: ",i)
        this.selectedIndex = i
      }
    })
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

  dep_addChart (data) {
    if (data) {
      this.data = data
    }
    const self = this
    const stack = d3.stack()
	  .keys(this.yaxis())
	  .offset(d3.stackOffsetNone)

    const xwidth = self.xScale.bandwidth()

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
    const table = d3.select(this.node.children[1]).append('table')
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
