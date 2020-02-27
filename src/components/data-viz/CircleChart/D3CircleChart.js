'use strict'
import * as d3 from 'd3'

export default class D3CircleChart {
  constructor (container, data, options) {
    this.container = container
    this.data = data
    this._height = (container.children[0].clientHeight > 0) ? container.children[0].clientHeight : 400
    this._width = (container.children[0].clientWidth <= 0) ? 300 : container.children[0].clientWidth
    this.radius = Math.min(this._width, this._height) / 2
    if(options.format ) { this.format=options.format  }
    console.debug("data =========================================:", this.radius)
    this.minColor=options.minColor || 'lightblue'
        this.maxColor=options.maxColor || 'darkblue'



    const yAxis=options.yAxis
    const xAxis=options.xAxis
    this.xAxis=xAxis
    this.yAxis=yAxis
    this.yLabel=options.yLabel || this.yAxis.replace('_',' ')
    this.xLabel=options.xLabel || this.xAxis.replace('_',' ')
    this.chart()
    this.legend()
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

  legend () {
    console.debug(this._legend)
    if (this._legend) {
      this._legend.selectAll('.legend-table').remove()
      this._legend.selectAll('.legend-rect').remove()
      this._legend.selectAll('.legend-table tbody tr').remove()
    }
    const data=this.data
    const xAxis=this.xAxis
    const yAxis=this.yAxis
    const self=this
    const color = this.color()
     const yDomain = this.yDomain()
    const columns=[ '', this.xLabel.replace('_',' '), this.yLabel.replace('_',' ') ]
    const table = d3.select(this.container.children[1]).append('table').attr('class','legend-table')
    const thead = table.append('thead')
    const rh=thead.append('tr')
    rh.append('th')
      .attr('colspan',2)
      .style('text-align','left')
      .style('text-transform','capitalize')
      .text(this.xLabel)
    rh.append('th')
      .style('text-align','right')
      .style('text-transform','capitalize')
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
      .style("fill", function(d,i){ return color(yDomain.length - i )})
      .style("background-color", function(d,i){ return color(yDomain.length - i )})
      .style("fill-opacity", 0.8)
    tr.append('td')
      .html((row,i)=> {
        console.debug(row)
        
        return row[xAxis]
      })
    tr.append('td')
      .style('text-align','right')
      .html(function (d) {
        console.debug(d)
        if (Number.isInteger(d[yAxis])) {
          return self._format(d[yAxis], 0)
        }
        else {
          return d[yAxis]
        }
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
    

    return  d3.scaleLinear()
      .domain([0, this.yDomain().length])
    .range([this.minColor, this.maxColor])
    
  }
  
  chart () {

    const xAxis=this.xAxis
    const yAxis=this.yAxis
    const data=this.data
    const chartNode=this.container.children[0]
    const w=this._width
    const h=this._height
    const color = this.color()
    const yDomain = this.yDomain()
    console.debug("data =========================================:", w,h)
    let svg = d3.select(chartNode).append('svg')
        .attr('height', this._width)
        .attr('width', this._width)
        .style("font", "10px sans-serif")
        .attr("text-anchor", "middle");


    //  .attr("viewBox", [0, 0, w, h])
    
    // set the dimensions and margins of the graph
    var width = w
    var height = h
  // Filter a bit the data -> more than 1 million inhabitants
//  data = data.filter(function(d){ return d.value>10000000 })
    console.debug("========================",data)
  // Color palette for continents?

    


    const    pack = data => d3.pack()
      .size([width - 2, height - 2])
      .padding(3)
    (d3.hierarchy(data)
     .sum(d => d[yAxis])
     .sort((a, b) => b[yAxis] - a[yAxis]))
    
    const root= pack(data);

    console.debug('ROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOt ',root)
    // Size scale for countries
  var size = d3.scaleLinear()
      .domain([0,this.yMax()])
      .range([7,  w * 0.2])  // circle will be between 7 and 55 px wide

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
      .attr("r", function(d){ return size(d[yAxis])})
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", function(d,i){ return color(yDomain.length - i)})
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
      .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){
        //console.debug('collide ',d)
        return (size(d[yAxis])+1)
      }).iterations(1)) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation
      .nodes(data)
      .on("tick", function(d){
        node
          .attr("cx", function(d){
         //   console.debug('simulation',d)
            return d.x })
            .attr("cy", function(d){ return d.y; })
      });

  // What happens when a circle is dragged?
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(.03).restart();
    console.debug("drag start", d)
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
    function dragended(d) {
      console.debug("dd3.event.activerag ended", d)
      console.debug(d3.event.active)
      if (!d3.event.active) simulation.alphaTarget(.03);
      d.fx = null;
      d.fy = null;
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
      this.chart.selectAll('#backgroundRect').remove()
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
      let self = this
      
      let groupLines = this.chart.append('g').attr('id', 'groups')
      let groupItemWidth = (self.width / self.state.length)
      let padding = (self.xScale.bandwidth() * 0.2)
      let xPos = 0
      
      Object.keys(self.groups).map((name, index) => {
        let groupLineWidth = xPos + (groupItemWidth * self.groups[name].length) - padding
        
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
        }  )
      
        .attr('tabindex', (d, i) => i )
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
          self._onHover(this,d, true)
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

        if(i === index) {
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
          d3.select(nodes[i]).attr('class','bar active')
          
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
      let r=[]
      this.getSelected()
      
      if( this.options.yGroupBy ) {
        
        r=['',this.options.yGroupBy, '', xValue || this.xSelectedValue]
      }
      else {
        r=['', this.yAxis, '', xValue || this.xSelectedValue]
      }
      
      r=this.legendHeaders(r)
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


      //const columns = this.yGroupings()
      
      //columns.splice(this.options.columnNames.length - 1, 1, this.selectedFiscalYear)
      const headers=this._legendHeaders(xValue);
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
      const self=this
      d3.selectAll('.legend-table tbody tr').remove()
      d3.selectAll('.legend-rect').remove()
      //      this.getSelected()
      
      const data = newData ||  this.selectedData()

      // console.debug('SELECTED DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:', data)
      let headers = this._legendHeaders(xValue)
      const labels = this.yGroupings()
      const formatLegend = this.formatLegend()
      // const table = d3.selectAll('.legend-table')
      const tbody = d3.selectAll('.legend-table tbody')

      // turn object into array to play nice with d3
      const dataArr = Object.keys(data).map((key, i) => {
        return  ['', labels[i],undefined, data[labels[i]]]
      }).reverse()
      dataArr.push(['','Total',undefined, Object.keys(data).reduce((sum,key) => sum+data[key], 0)])
      
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
      if(isNaN(d)) {
        return d
      } else {
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
  
  
  _onHover = (element,data, hover) => {
    try {
      const activeElement = element.parentNode.parentNode
      const index = this.selectedIndex
      // console.debug(data)
      // console.debug(element)
      
      if(hover === true ) {
        // activeElement.setAttribute('class', 'bar active')
        let years=this.xDomain()

        let tabIndex = element.parentNode.parentNode.tabIndex
       // // console.debug(years,  years[tabIndex] , tabIndex)
        this.createLegend(data[0].data, years[tabIndex])
        this.updateLegend(data[0].data, years[tabIndex])
      } else {
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

