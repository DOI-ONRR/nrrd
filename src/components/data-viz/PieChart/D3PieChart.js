'use strict'
import * as d3 from 'd3'

export default class D3PieChart {
  constructor (node, data, options) {
    this.node = node
    this.data = data
    this._height = (node.children[0].clientHeight > 0) ? node.children[0].clientHeight : 400
    this._width = (node.children[0].clientWidth <= 0) ? 300 : node.children[0].clientWidth
    this.radius = Math.min(this._width, this._height) / 2
    console.debug('data =========================================:', this.radius)

    this.color = d3.scaleOrdinal(d3.schemeCategory10)
    //      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    this.xAxis = options.xAxis
    this.yAxis = options.yAxis
    const self = this
    const arc = d3.arc()
      .outerRadius(self.radius - 10)
      .innerRadius(0)

    const pie = d3.pie()
      .value(function (d) {
        console.debug('PIEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE-----', d, d[self.yAxis])
        return d[self.yAxis]
      })
      .sort(null)

    const chartNode = node.children[0]
    const w = this._width
    const h = this._height
    const svg = d3.select(chartNode).append('svg')
      .attr('width', w)
      .attr('height', h)
      .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')')

    /*    svg.append('g')
      .attr('class', 'arc')
      .attr('transform', 'translate(' + this._width / 2 + ',' + this._height / 2 + ')')
*/
    const pieData = pie(this.data)
    const g = svg.selectAll('arc')
      .data(pieData)
      .enter().append('g')
      .attr('class', 'arc')

    g.append('path')
      .attr('d', function (d) {
        console.debug(d)
        const a = arc(d)

        console.debug('added arc', a)
        return a
      })
      .attr('data-legend', function (d) {
        return d[self.xAxis]
      })
      .attr('data-legend-pos', function (d, i) {
        return i
      })
      .style('fill', function (d) {
        return self.color(d[self.xAxis])
      })
    /*
      g.append('text')
      .attr('transform', function(d) {
        console.debug('debug--------------------------------------------',d.data[self.yAxis])
        return 'translate(' + arc.centroid(d.data[self.yAxis]) + ')'
      })
      .attr('dy', '.35em')
      .style('text-anchor', 'middle');
    */

    this.svg = svg
  }

  draw () {
    try {
      this.chart.selectAll('#pc_backgroundRect').remove()
      this.addBackgroundRect()

      this._maxExtend()
      this._chart()
      this._xLabels()
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
    if (this.xAxisGroup) {
      const self = this

      const groupLines = this.chart.append('g').attr('id', 'groups')
      const groupItemWidth = (self.width / self.state.length)
      const padding = (self.xScale.bandwidth() * 0.2)
      let xPos = 0

      Object.keys(self.groups).map((name, index) => {
        const groupLineWidth = xPos + (groupItemWidth * self.groups[name].length) - padding

        groupLines.append('line')
          .attr('x1', xPos + padding)
          .attr('x2', groupLineWidth)
          .attr('stroke', '#a7bcc7')
          .attr('stroke-width', 1)
          .attr('transform', 'translate(' + [0, self.height - 4 - self.marginBottom / 2] + ')')

        groupLines.append('text')
          .attr('x', ((xPos + padding) / 2) + (groupLineWidth / 2))
          .attr('y', self.height - 16)
          .attr('text-anchor', 'middle')
          .text(name)

			    xPos = groupLineWidth + padding
      }
      )
    }
  }

  _maxExtend () {
    try {
      const self = this

      this.chart.selectAll('.maxExtent').remove()
      const maxExtentGroup = self.chart.append('g').attr('class', 'maxExtent')

      const maxExtentValue = this.maxExtent()
      if (!this.units) {
        this.units = ''
      }

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

        .attr('tabindex', (d, i) => i)
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
        .on('mouseover', function (d) {
          //          self._onMouseover(this, d)
          // self._onClick(self)
        })
        .on('mouseenter', function (d) {
          self._onHover(this, d, true)
        })
        .on('mouseleave', function (d) {
          self._onHover(this, d, false)
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

      if (this.options.yGroupBy) {
        r = ['', this.options.yGroupBy, '', xValue || this.xSelectedValue]
      }
      else {
        r = ['', this.yAxis, '', xValue || this.xSelectedValue]
      }

      r = this.legendHeaders(r)
      return r
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  createLegend (newData, xValue) {
    try {
      d3.selectAll('.legend-table').remove()
      d3.selectAll('.legend-rect').remove()

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
        .text(function (column) {
          return column
        })
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  updateLegend (newData, xValue) {
    try {
      const self = this
      d3.selectAll('.legend-table tbody tr').remove()
      d3.selectAll('.legend-rect').remove()

      const data = newData || this.selectedData()
      const headers = this._legendHeaders(xValue)
      const labels = this.yGroupings()
      const tbody = d3.selectAll('.legend-table tbody')

      // turn object into array to play nice with d3
      const dataArr = Object.keys(data).map((key, i) => {
        return ['', labels[i], undefined, data[labels[i]]]
      }).reverse()
      dataArr.push(['', 'Total', undefined, Object.keys(data).reduce((sum, key) => sum + data[key], 0)])

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
        .style('opacity', (d, i) => i < labels.length ? ((i + 1) / labels.length) : 0)

      // create a cell in each row for each column
      tr.selectAll('td')
        .data(function (row, i) {
          return headers.map(function (column, i) {
            return { column: column, value: row[i] }
          })
        })
        .enter()
        .append('td')
        .html(function (d) {
          return self._legendFormat(d.value)
        })
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
      const selectedElement = d3.selectAll('.active') // element.parentNode.querySelector('[selected=true]')
      // console.debug(data)
      if (selectedElement) {
        selectedElement.attr('selected', false)
        selectedElement.attr('class', 'bar')
      }
      const activeElement = element.parentNode.parentNode
      activeElement.setAttribute('class', 'bar active')
      activeElement.setAttribute('selected', true)
      activeElement.setAttribute('tabindex', 1)
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
      // console.debug(data)
      if (selectedElement) {
        selectedElement.attr('selected', false)
        selectedElement.attr('class', 'bar')
      }
      const activeElement = element.parentNode.parentNode
      // activeElement.setAttribute('class', 'bar active')
      // activeElement.setAttribute('selected', true)
      activeElement.setAttribute('tabindex', 1)
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
  }

  _onHover = (element, data, hover) => {
    try {
      if (hover === true) {
        const years = this.xDomain()
        const tabIndex = element.parentNode.parentNode.tabIndex
        this.createLegend(data[0].data, years[tabIndex])
        this.updateLegend(data[0].data, years[tabIndex])
      }
      else {
        this.getSelected()
        this.select(this.index)
        this.createLegend()
        this.updateLegend()
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  onHover (d) {
    console.debug('onSelect: ', d)
  }
}
