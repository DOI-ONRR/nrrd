import * as d3 from 'd3'
import { isEnumMember } from 'typescript'

export default class stackedBarChart {
  constructor (node, data, options, formatLegendFunc) {
    this.node = node
    this.data = data
    this.options = options
    this.formatLegendFunc = formatLegendFunc
    this.onClick = options.onClick

    this.formatLegend(this.formatLegendFunc)

    if (options && options.columns) {
      this._columns = options.columns
    }
    else {
      this._columns = Object.keys(data[0]).filter((r, i) => r !== '__typename').sort()
    }

    if (options && options.xLabels) {
      this.xLabels(options.xLabels)
    }
    else {
      this.xLabels(this.xdomain())
    }

    if (options && options.yLabels) {
      this.yLabels(options.yLabels)
    }
    else {
      this.yLabels(this.yaxis())
    }

    if (options && options.selectedIndex) {
      this.selectedIndex = options.selectedIndex
    }
    else {
      this.selectedIndex = this.data.length - 1
    }

    this.selectedData(this.ydomain(data[data.length - 1]))
    this.marginBottom = 40
    this.marginTop = 25
    this.maxValue = this.max(data)
    this.minValue = this.min(data)
    this.extentPercent = 0.05
    this.extentMarginOfError = 0.10
    this.maxExtentLineY = 20
    this._colors = ['#b33040', '#d25c4d', '#f2b447', '#d9d574']
    this._height = (node.children[0].clientHeight > 0) ? node.children[0].clientHeight : 400
    this._width = (node.children[0].clientWidth <= 0) ? 300 : node.children[0].clientWidth
    this.xScale = d3.scaleBand()
      .domain(this.xdomain())
      .range([0, this._width])
      .paddingInner(0.5)
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
    this.chart = d3.select(this.node.children[0]).append('svg')
      .attr('height', this._height)
      .attr('width', this._width)
  }

  xaxis () {
    return this._columns[0]
  }

  xLabels (labels) {
    try {
      if (labels) {
        this._xLabels = labels
      }
      return this._xLabels
    }
    catch (err) {
      console.warn('error in xLabels:', err)
    }
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
    d3.selectAll('.bar').filter((d, i, nodes) => {
      if (nodes[i].className.baseVal.match(/active/)) {
        this.selectedFiscalYear = d.fiscal_year
        this.selectedIndex = i
      }
    })
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
    activeElement.setAttribute('tabindex', 1)
    this.selectedData(data[0].data)
    this.addLegend()
    this.getSelected()
    if (callBack) {
      callBack(data)
    }
  }

  onSelect (d) {
  }

  addChart (data) {
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
        console.debug(' onclick:', d)
        self.toggleSelectedBar(this, d, self.onSelect(d))
        // self.onClick(self)
      })
      .on('mouseover', function (d) {
        self.toggleSelectedBar(this, d, self.onSelect(d))
      })
  }

  onClick () {
    // console.log('onClick fired from d3 class yo!')
  }

  draw () {
    if (this.data === undefined) {
      return
    }

    this.chart.selectAll('#sbc__backgroundRect').remove()
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
        .text((units === 'dollars' || units === '$') ? ['$', maxExtentValue].join('') : [maxExtentValue, units].join(' '))

      maxExtentGroup.append('line')
        .attr('x1', 0)
        .attr('x2', self._width)
        .attr('stroke', '#a7bcc7')
        .attr('stroke-dasharray', [5, 10])
        .attr('stroke-width', 1)
        .attr('transform', 'translate(' + [0, self.maxExtentLineY] + ')')
    }
    catch (e) {
      console.warn('Error in addMaxExtent', e)
    }
  }

  addXAxis (xLabels) {
    const self = this
    const createXAxis = () => (d3.axisBottom(self.xScale).tickSize(0).tickFormat((d, i) => {
      console.debug('---------------tickFormat: ', d, i, xLabels)
      return (xLabels) ? xLabels[i] : d
    }))

    const rotate = this.options.xRotate || 0
    let x = -1
    const y = 8
    if (rotate != 0) {
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
    const totalColumns = ['Total', 'Value']
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
    this.chart.append('rect')
      .attr('class', 'stacked-bar-chart-background')
      .attr('id', 'sbc__backgroundRect')
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
