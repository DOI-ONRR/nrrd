'use strict'
import * as d3 from 'd3'

export default class D3CircleChart {
  constructor (container, data, options) {
    this.container = container
    this.data = data
    this._height = (container.children[0].clientHeight > 0) ? container.children[0].clientHeight : 400
    this._height = 500
    this._width = 500
    this.radius = Math.min(this._width, this._height) / 2
    if (options.format) {
      this.format = options.format
    }

    if (options.circleLabel) {
      this.circleLabel = options.circleLabel
    }

    if (options.circleTooltip) {
      this.circleTooltip = options.circleTooltip
    }

    // console.debug("data =========================================:", this.radius)
    this.minColor = options.minColor || 'lightblue'
    this.maxColor = options.maxColor || 'darkblue'

    this.maxCircles = options.maxCircles - 1
    const yAxis = options.yAxis
    const xAxis = options.xAxis
    this.xAxis = xAxis
    this.yAxis = yAxis
    this.yLabel = options.yLabel || this.yAxis.replace('_', ' ')
    this.xLabel = options.xLabel || this.xAxis.replace('_', ' ')
    this.data = this.rollUpOther(data)

    if (options.legendLabel) {
      this.legendLabel = options.legendLabel
    }

    const root = this.pack({ name: 'root', children: this.data })
    this._root = root

    // console.debug("DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",this.data)
    this.chart()
    this.legend()
  }

  pack (data) {
    try {
      const r = d3.pack()
        .size([this._width - 2, this._height - 2])
        .padding(3)(this.hierarchy(data))
      return r
    }
    catch (err) {
      console.warn('Errror: ', err)
    }
  }

  rollUpOther (data) {
    try {
      const maxCircles = this.maxCircles
      const yAxis = this.yAxis
      const xAxis = this.xAxis
      // console.debug('-------------------------------------------------------------',data)
      if (maxCircles + 1 < data.length) {
        const tmp = data
        const other = tmp.reduce((sum, row, i) => {
          // console.debug("maxcircles: ",sum,row,i)
          if (i + 1 >= maxCircles) {
            return sum + row[yAxis] || 0
          }
        }, 0)
        // console.debug(other)
        const o = data[maxCircles]
        data = data.filter((row, i) => i < maxCircles)
        o[xAxis] = 'Other'
        o[yAxis] = other
        data.push(o)
        // console.debug("OTHER :", o);
      }

      return data
    }
    catch (err) {
      console.warn('Errror: ', err)
    }
  }

  hierarchy (data) {
    try {
      const r = d3.hierarchy(data)
        .sum(d => d[this.yAxis])
        .sort((a, b) => b[this.yAxis] - a[this.yAxis])
      // console.debug(r)
      return r
    }
    catch (err) {
      console.warn('Errror: ', err)
    }
  }

  xDomain () {
    try {
      const r = this.data.map((row, i) => {
        return row[this.xAxis]
      })
      const domain = [...(new Set(r.sort((a, b) => a - b)))]
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

  legendLabel (value) {
    try {
      return value
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  legend () {
    /// / console.debug(this._legend)
    if (this._legend) {
      this._legend.selectAll('.legend-table').remove()
      this._legend.selectAll('.legend-rect').remove()
      this._legend.selectAll('.legend-table tbody tr').remove()
    }
    const data = this.data
    const xAxis = this.xAxis
    const yAxis = this.yAxis
    const self = this
      const color = this.color()
    const yDomain = this.yDomain()
    const columns = ['', this.xLabel.replace('_', ' '), this.yLabel.replace('_', ' ')]
    const table = d3.select(this.container.children[1]).append('table').attr('class', 'legend-table')
    const thead = table.append('thead')
    const rh = thead.append('tr')
    const legendLabel = this.legendLabel
    rh.append('th')
      .attr('colspan', 2)
      .style('text-align', 'left')
      .style('text-transform', 'capitalize')
      .text(this.xLabel)
    rh.append('th')
      .style('text-align', 'right')
      //.style('text-transform', 'capitalize')
      .text(this.yLabel)

    const tbody = table.append('tbody')
    //    const tbody = d3.selectAll('.legend-table tbody')
    const tr = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr')

    tr.append('td')
      .append('rect')
      .attr('class', 'legend-rect')
      .attr('width', 15)
      .attr('height', 15)
      .style('fill', function (d, i) {
        return color(yDomain.length - i)
      })
      .style('background-color', function (d, i) {
        return color(yDomain.length - i)
      })
      .style('fill-opacity', 0.8)
    tr.append('td')
      .html((row, i) => {
        const r = legendLabel(row[xAxis])
        return r
      })
    tr.append('td')
      .style('text-align', 'right')
      .html(function (d) {
        /// / console.debug(d)
        return self._format(d[yAxis], 0)
      }).enter()

    this._legend = table
  }

  _format (value) {
    try {
      return this.format(value)
    }

    catch (err) {
      console.warn('error in formatOptions:', err)
    }
  }

  format (value) {
    return value
  }

    color () {
//	console.debug("yDomain()", this.yDomain())
    const domain = d3.min([this.yDomain().length, this.maxCircles])
    return d3.scaleLinear()
      .domain([-1, domain])
      .range([this.minColor, this.maxColor])
  }

  circleLabel (data, xAxis, yAxis) {
    const r = [,]
    return r
  }

  _circleLabel (data) {
    try {
      // call user defined function that has circle data argument and returns string
      // defaluts to empty string - no label
      const r = this.circleLabel(data)
      return r
    }
    catch (err) {
      console.warn('Errror: ', err)
    }
  }

  // Circle tooltips
  circleTooltip (data, xAxis, yAxis) {
    const r = [,]
    return r
  }

  _circleTooltip (data) {
    try {
      const r = this.circleTooltip(data)
      return r
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  chart () {
    const self = this
    const xAxis = this.xAxis
    const yAxis = this.yAxis

    const chartNode = this.container.children[0]
    const circleLabel = this.circleLabel
    const circleTooltip = this.circleTooltip

    const width = this._width
    const height = this._height
      const color = this.color()
//            console.debug("color legend", color(2), color(1), color(0) )

    const yDomain = this.yDomain()
    const root = this._root
    let focus = root
    let view

    const svg = d3.select(chartNode).append('svg')
      .attr('viewBox', `-${ width * 0.5 } -${ height * 0.5 } ${ width } ${ height }`)
      .style('display', 'block')
      .style('margin', '0')
      .style('padding', '0')
      .style('background', 'white')
      .style('cursor', 'pointer')
      .on('click', () => zoom(root))

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
      .style('display', 'none')

    const mouseover = function (d) {
      self._onMouseover(this, d)
      if (circleTooltip(d.data)[0] !== undefined) {
        tooltip
          .style('opacity', 1)
          .style('display', 'block')
      }
    }

    const mousemove = function (d) {
      if (circleTooltip(d.data)[0] !== undefined) {
        tooltip
          .html(`${ circleTooltip(d.data)[0] }<br>${ circleTooltip(d.data)[1] }`)
          .style('left', (d3.event.pageX + 10) + 'px')
          .style('top', (d3.event.pageY + 10) + 'px')
      }
    }

    const mouseout = function (d) {
      self._onMouseout(this, d)
      tooltip.style('opacity', 0)
    }

    const node = svg.append('g')
      .selectAll('circle')
      .attr('class', 'circle')
      .data(root.descendants())
      .join('circle')
      // .attr('stroke', (d, i) => {
      //   if (i === 0) return '#000'
      // })
      .attr('fill', (d, i) => {
        // console.debug("fill attr", d,i)
          if (i === 0) return '#f5f5f5'
	  // color(yDomain.length - i + 1) add one more because first circle is root node 
        return d.children ? color(d.depth) : color(yDomain.length - i + 1) 
      })
      // .attr('pointer-events', d => !d.children ? 'none' : null)
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout)
      // .on('click', d => focus !== d && (zoom(d), d3.event.stopPropagation()))

    const xLabel = svg.append('g')
      .style('fill', 'white')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(root.descendants())
      .join('text')
      .style('font-size', d => d.r / 6)
      .style('fill-opacity', d => d.parent === root ? 1 : 0)
      .style('display', d => d.parent === root ? 'inline' : 'none')
      // .text(d => circleLabel(d.data, xAxis, yAxis)[0] !== undefined ? circleLabel(d.data, xAxis, yAxis)[0].substring(0, d.r / 4) : '')
      .text(d => {
        const calcStrLength = d.r / 4
        const strLength = (circleLabel(d.data, xAxis, yAxis)[0] !== undefined) ? circleLabel(d.data, xAxis, yAxis)[0].length : ''
        const str = (circleLabel(d.data, xAxis, yAxis)[0] !== undefined) ? circleLabel(d.data, xAxis, yAxis)[0].substring(0, calcStrLength) : ''
        if (calcStrLength > strLength) {
          return str
        }
        else {
          return `${ str }...`
        }
      })

    const yLabel = svg.append('g')
      .style('fill', 'white')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(root.descendants())
      .join('text')
      .style('font-size', d => d.r / 6)
      .style('fill-opacity', d => d.parent === root ? 1 : 0)
      .style('display', d => d.parent === root ? 'inline' : 'none')
      .text(d => circleLabel(d.data, xAxis, yAxis)[1])
      // .call(this.wrapText, 150) // wrap text in <= 150 pixels

    zoomTo([root.x, root.y, root.r * 2])

    function zoomTo (v) {
      const k = width / v[2]

      view = v

      xLabel.attr('transform', d => `translate(${ (d.x - v[0]) * k },${ (d.y - v[1]) * k })`)
      yLabel.attr('transform', d => `translate(${ (d.x - v[0]) * k },${ (d.y - v[1]) * k + d.r / 5 })`)
      node.attr('transform', d => `translate(${ (d.x - v[0]) * k },${ (d.y - v[1]) * k })`)
      node.attr('r', d => d.r * k)
    }

    function zoom (d) {
      const focus0 = focus

      focus = d

      const transition = svg.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween('zoom', d => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2])
          return t => zoomTo(i(t))
        })

    /* xLabel
        .filter(function (d) {
          return d.parent === focus || this.style.display === 'inline'
        })
        .transition(transition)
        .style('fill-opacity', d => d.parent === focus ? 1 : 0)
        .on('start', function (d) {
          if (d.parent === focus) this.style.display = 'inline'
        })
        .on('end', function (d) {
          if (d.parent !== focus) this.style.display = 'none'
        })

      yLabel
        .filter(function (d) {
          return d.parent === focus || this.style.display === 'inline'
        })
        .transition(transition)
        .style('fill-opacity', d => d.parent === focus ? 1 : 0)
        .on('start', function (d) {
          if (d.parent === focus) this.style.display = 'inline'
        })
        .on('end', function (d) {
          if (d.parent !== focus) this.style.display = 'none'
        })
    */
    }

    return svg.node()
  }

  dep_chart () {
    const xAxis = this.xAxis
    const yAxis = this.yAxis
    const data = this.pack(this.data)
    const chartNode = this.container.children[0]
    const w = this._width
    const h = this._height
    const color = this.color()
    const yDomain = this.yDomain()
    // console.debug("data =========================================:", w,h)
    const svg = d3.select(chartNode).append('svg')
      .attr('height', this._width)
      .attr('width', this._width)
      .style('font', '10px sans-serif')
      .attr('text-anchor', 'middle')

    //  .attr("viewBox", [0, 0, w, h])

    // set the dimensions and margins of the graph
    const width = w
    const height = h
    // Filter a bit the data -> more than 1 million inhabitants
    //  data = data.filter(function(d){ return d.value>10000000 })
    // console.debug("========================",data)
    // Color palette for continents?

    // Size scale for countries
    const size = d3.scaleLinear()
      .domain([0, this.yMax()])
      .range([7, w * 0.2]) // circle will be between 7 and 55 px wide

    // create a tooltip
    const Tooltip = d3.select('#my_dataviz')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('padding', '5px')

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (d) {
      Tooltip
        .style('opacity', 1)
    }
    const mousemove = function (d) {
      Tooltip
        .html('<u>' + d.key + '</u>' + '<br>' + d.value + ' inhabitants')
        .style('left', (d3.mouse(this)[0] + 20) + 'px')
        .style('top', (d3.mouse(this)[1]) + 'px')
    }
    const mouseleave = function (d) {
      Tooltip
        .style('opacity', 0)
    }

    // Initialize the circle: all located at the center of the svg area
    const node = svg.append('g')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', function (d) {
        return size(d[yAxis])
      })
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .style('fill', function (d, i) {
        return color(yDomain.length - i)
      })
      .style('fill-opacity', 0.8)
      .attr('stroke', 'black')
      .style('stroke-width', 1)
      .on('mouseover', mouseover) // What to do when hovered
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave)
      .call(d3.drag() // call specific function when circle is dragged
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    // Features of the forces applied to the nodes:
    const simulation = d3.forceSimulation()
      .force('center', d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
      .force('charge', d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
      .force('collide', d3.forceCollide().strength(0.2).radius(function (d) {
        /// / console.debug('collide ',d)
        return (size(d[yAxis]) + 1)
      }).iterations(1)) // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
      .nodes(data)
      .on('tick', function (d) {
        node
          .attr('cx', function (d) {
            //   console.debug('simulation',d)
            return d.x
          })
          .attr('cy', function (d) {
            return d.y
          })
      })

    // What happens when a circle is dragged?
    function dragstarted (d) {
      if (!d3.event.active) simulation.alphaTarget(0.03).restart()
      // console.debug("drag start", d)
      d.fx = d.x
      d.fy = d.y
    }
    function dragged (d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    }
    function dragended (d) {
      // console.debug("dd3.event.activerag ended", d)
      // console.debug(d3.event.active)
      if (!d3.event.active) simulation.alphaTarget(0.03)
      d.fx = null
      d.fy = null
      simulation.alpha(1).restart()
    }
  }

  //     /*
  // // append the svg object to the body of the page

  // // Read data
  //   // Filter a bit the data -> more than 1 million inhabitants
  // //  data = data.filter(function(d){ return d.value>10000000 })
  //     console.debug("========================",data)
  //   // Color palette for continents?

  //     /*
  // var color = d3.scaleOrdinal()
  //     .domain(["", "Europe", "Africa", "Oceania", "Americas"])
  //     .range(d3.schemeSet1);
  //     */
  //     const    pack = data => d3.pack()
  //       .size([width - 2, height - 2])
  //       .padding(3)
  //     (d3.hierarchy(data)
  //      .sum(d => d[yAxis])
  //      .sort((a, b) => b[yAxis] - a[yAxis]))

  //     const root= pack(data);

  //     console.debug('ROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOt ',root)
  //     // Size scale for countries
  //   var size = d3.scaleLinear()
  //     .domain([0,6597880000])
  //     .range([7,55])  // circle will be between 7 and 55 px wide

  //   // create a tooltip
  //   var Tooltip = d3.select("#my_dataviz")
  //     .append("div")
  //     .style("opacity", 0)
  //     .attr("class", "tooltip")
  //     .style("background-color", "white")
  //     .style("border", "solid")
  //     .style("border-width", "2px")
  //     .style("border-radius", "5px")
  //     .style("padding", "5px")

  //   // Three function that change the tooltip when user hover / move / leave a cell
  //   var mouseover = function(d) {
  //     Tooltip
  //       .style("opacity", 1)
  //   }
  //   var mousemove = function(d) {
  //     Tooltip
  //       .html('<u>' + d.key + '</u>' + "<br>" + d.value + " inhabitants")
  //       .style("left", (d3.mouse(this)[0]+20) + "px")
  //       .style("top", (d3.mouse(this)[1]) + "px")
  //   }
  //   var mouseleave = function(d) {
  //     Tooltip
  //       .style("opacity", 0)
  //   }

  //   // Initialize the circle: all located at the center of the svg area
  //   var node = svg.append("g")
  //     .selectAll("circle")
  //     .data(data)
  //     .enter()
  //     .append("circle")
  //       .attr("class", "node")
  //       .attr("r", function(d){ return size(d[yAxis])})
  //       .attr("cx", width / 2)
  //       .attr("cy", height / 2)
  //       .style("fill", function(d){ return color(d[yAxis])})
  //       .style("fill-opacity", 0.8)
  //       .attr("stroke", "black")
  //       .style("stroke-width", 1)
  //       .on("mouseover", mouseover) // What to do when hovered
  //       .on("mousemove", mousemove)
  //       .on("mouseleave", mouseleave)
  //       .call(d3.drag() // call specific function when circle is dragged
  //            .on("start", dragstarted)
  //            .on("drag", dragged)
  //            .on("end", dragended));

  //   // Features of the forces applied to the nodes:
  //   var simulation = d3.forceSimulation()
  //       .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
  //       .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
  //       .force("collide", d3.forceCollide().strength(.2).radius(function(d){
  //             console.debug('collide ',d)
  //         return (size(d[yAxis])+3)
  //       }).iterations(1)) // Force that avoids circle overlapping

  //   // Apply these forces to the nodes and update their positions.
  //   // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  //   simulation
  //       .nodes(data)
  //       .on("tick", function(d){
  //         node
  //           .attr("cx", function(d){
  //             console.debug('simulation',d)
  //             return d.x })
  //             .attr("cy", function(d){ return d.y; })
  //       });

  //   // What happens when a circle is dragged?
  //   function dragstarted(d) {
  //     if (!d3.event.active) simulation.alphaTarget(.03).restart();
  //     console.debug("drag start", d)
  //     d.fx = d.x;
  //     d.fy = d.y;
  //   }
  //   function dragged(d) {
  //     d.fx = d3.event.x;
  //     d.fy = d3.event.y;
  //   }
  //   function dragended(d) {
  //     if (!d3.event.active) simulation.alphaTarget(.03);
  //     d.fx = null;
  //     d.fy = null;
  //   }
  // */

  //     /*
  //     console.debug('hhData: ', hData)
  //     const vData=d3.stratify()([{name:'data', children:hData}])
  //     console.debug(vData)

  //     const vLayout = d3.pack().size([w, h])
  //     const vRoot = d3.hierarchy(vData).sum(function (d) { return d });
  //     const vNodes = vRoot.descendants()
  //     vLayout(vNodes)
  //     var vSlices = g.selectAll('circle').data(vNodes).enter().append('circle');
  //     // Draw on screen
  //     vSlices.attr('cx', function (d) { return d.x; })
  //       .attr('cy', function (d) { return d.y; })
  //       .attr('r', function (d) { return d.r; });
  //     this.svg=svg;
  //     */
  //   }

  /*

// set the dimensions and margins of the graph
var width = 460
var height = 460

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

// Read data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/11_SevCatOneNumNestedOneObsPerGroup.csv", function(data) {

  // Filter a bit the data -> more than 1 million inhabitants
  data = data.filter(function(d){ return d.value>10000000 })
console.debug(data)
  // Color palette for continents?
  var color = d3.scaleOrdinal()
    .domain(["Asia", "Europe", "Africa", "Oceania", "Americas"])
    .range(d3.schemeSet1);

  // Size scale for countries
  var size = d3.scaleLinear()
    .domain([0, 1400000000])
    .range([7,55])  // circle will be between 7 and 55 px wide

  // create a tooltip
  var Tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
      .html('<u>' + d.key + '</u>' + "<br>" + d.value + " inhabitants")
      .style("left", (d3.mouse(this)[0]+20) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
  }

  // Initialize the circle: all located at the center of the svg area
  var node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "node")
      .attr("r", function(d){ return size(d.value)})
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", function(d){ return color(d.region)})
      .style("fill-opacity", 0.8)
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(d3.drag() // call specific function when circle is dragged
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));

  // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.value)+3) }).iterations(1)) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
      });

  // What happens when a circle is dragged?
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

})

*/

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
    console.debug('DWGH ', values)
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
        .attr('class', 'circles')
        .selectAll('g')
        .data(self.xDomain())
        .enter().append('g')
        .attr('height', (self._height - self.marginTop))
        .attr('width', self.xScale.bandwidth())
        .attr('transform', d => 'translate(' + (self.xScale(d) + ',0)'))
        .attr('class', (d, i) => {
          // console.debug("D: ", d, "I: ",i)
          // console.debug("SI: ", self.selectedIndex)
          return i === self.selectedIndex ? 'circle active' : 'circle'
        })

        .attr('tabindex', (d, i) => i)
        .selectAll('g')
        .data(d => {
          const yd = self.yGroupData(d)
          const r = stack([yd])
          return r
        })
        .enter().append('g')
        .attr('class', (d, i) => 'stacked-circle-chart-' + i)
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
            selectedElement.attr('class', 'circle')
          }
          d3.select(nodes[i]).attr('class', 'circle active')
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
      //      this.getSelected()

      const data = newData || this.selectedData()

      // console.debug('SELECTED DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:', data)
      const headers = this._legendHeaders(xValue)
      const labels = this.yGroupings()
      const formatLegend = this.formatLegend()
      // const table = d3.selectAll('.legend-table')
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
        selectedElement.attr('class', 'circle')
      }
      const activeElement = element.parentNode.parentNode
      activeElement.setAttribute('class', 'circle active')
      activeElement.setAttribute('selected', true)
      activeElement.setAttribute('tabindex', 1)
      this.selectedData(data.data)
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

  _onMouseover (element, data) {
    try {
      const selectedElement = d3.select(element)
      const legendRows = d3.select(this.container.children[1]).select('.legend-table').selectAll('tbody tr')
      const selectedRowIndex = data.parent && data.parent.data.children.findIndex(item => item === data.data)
      const selectedLegendRow = legendRows._groups[0][selectedRowIndex]

      if (selectedRowIndex !== null && selectedElement) {
        selectedElement.attr('class', 'circle active')
          .transition()
          .duration(200)
          .style('stroke', '#000')
          .style('stroke-width', '4px')
          .style('opacity', 0.9)
        d3.select(selectedLegendRow)
          .transition()
          .duration(200)
          .style('background', '#e0e0e0')
          .style('font-weight', 'bold')
      }
      const activeElement = element.parentNode.parentNode
      activeElement.setAttribute('tabindex', 1)
      // this.selectedData(data.data)
      // this._legend()
      // this.onMouseover(this)
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  onMouseover (d) {
    console.debug('onSelect: ', d)
  }

  _onMouseout = (element, data) => {
    try {
      const selectedElement = d3.select(element)
      const legendRows = d3.select(this.container.children[1]).select('.legend-table').selectAll('tbody tr')
      const selectedRowIndex = data.parent && data.parent.data.children.findIndex(item => item === data.data)
      const selectedLegendRow = legendRows._groups[0][selectedRowIndex]

      if (selectedElement) {
        selectedElement.attr('class', 'circle')
          .transition()
          .duration(500)
          .style('stroke', 'none')
          .style('opacity', 1)
        d3.select(selectedLegendRow)
          .transition()
          .duration(500)
          .style('background', 'none')
          .style('font-weight', 'normal')
      }
    }
    catch (err) {
      console.warn('Error: ', err)
    }
  }

  onMouseout (d) {
    console.debug('onMouseout: ', d)
  }

  _onHover = (element, data, hover) => {
    try {
      const activeElement = element.parentNode.parentNode
      const index = this.selectedIndex
      // console.debug(data)
      // console.debug(element)

      if (hover === true) {
        // activeElement.setAttribute('class', 'bar active')
        const years = this.xDomain()

        const tabIndex = element.parentNode.parentNode.tabIndex
        // // console.debug(years,  years[tabIndex] , tabIndex)
        this.createLegend(data[0].data, years[tabIndex])
        this.updateLegend(data[0].data, years[tabIndex])
      }
      else {
        this.getSelected()
        //  activeElement.setAttribute('class', 'bar')

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
