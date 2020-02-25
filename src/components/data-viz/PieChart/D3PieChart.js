'use strict'
import * as d3 from 'd3'

export default class D3PieChart {
  constructor(node, data, options) {
    this.node=node
    this.data=data
    this.width = options.width ||  960
    this.height = options.height ||  500
    this.radius = Math.min(this.width, this.height) / 2
    console.debug("data =========================================:", this.node)

    this.color = d3.scaleOrdinal(d3.schemeCategory10)
    //      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    this.xAxis=options.xAxis
    this.yAxis=options.yAxis
    this.arc = d3.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(0)

    this.pie = d3.pie()
      .value(function (d) {
        return d[this.yAxis]
      })
      .sort(null)

    svg = d3.select(this.node.childern[0]).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
return
      svg.append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')')
    
    let g = svg.selectAll('.arc')
        .data(pie(data))
        .enter().append('g')
        .attr('class', 'arc');
    g.append('path')
      .attr('d', arc)
      .attr('data-legend', function(d) { return d[this.xAxis] })
      .attr('data-legend-pos', function(d, i) { return i; })
      .style('fill', function(d) { return color(d[this.xAxis]); });
    
      g.append('text')
      .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; })
      .attr('dy', '.35em')
      .style('text-anchor', 'middle');
    this.svg=svg;
  }
}

