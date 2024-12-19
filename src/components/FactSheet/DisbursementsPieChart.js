import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const DisbursementsPieChart = ({ data }) => {
  const svgRef = useRef()

  useEffect(() => {
    // Clear the SVG before rendering
    d3.select(svgRef.current).selectAll('*').remove()

    const width = 960
    const height = 400
    const radius = Math.min(width, height) / 2 - 50
    const labelRadius = radius + 30 // For labels outside the chart

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${ width / 4 }, ${ height / 2 })`)

    const pie = d3.pie().value(d => d.totalDisbursements)

    const arc = d3.arc().innerRadius(0).outerRadius(radius)

    const labelArc = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius)

    const colorDomain = [0, 4]
    const color = d3.scaleSequential(d3.interpolateViridis).domain(colorDomain)

    const totalSum = data.reduce((sum, d) => sum + d.totalDisbursements, 0)

    // Format numbers with commas
    const formatCurrency = d3.format(',.0f') // No decimals, thousands separator

    const arcs = svg.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc')

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))

    arcs.append('text')
      .attr('transform', d => {
        const sliceCenter = arc.centroid(d) // Center of the slice
        const sliceAngle = d.endAngle - d.startAngle // Slice angle
        const sliceWidth = radius * sliceAngle // Arc length (approx)

        const labelWidth = `$${ (d.data.totalDisbursements / 1e6).toFixed(1) } million`.length * 6 // Estimate label width

        // Place label outside if it doesn't fit inside
        return sliceWidth < labelWidth ? `translate(${ labelArc.centroid(d) })` : `translate(${ sliceCenter })`
      })
      .attr('text-anchor', d => {
        const sliceAngle = d.endAngle - d.startAngle
        const sliceWidth = radius * sliceAngle
        const labelWidth = `$${ (d.data.totalDisbursements / 1e6).toFixed(1) } million`.length * 6

        // Adjust anchor for outside labels
        return sliceWidth < labelWidth && (d.endAngle + d.startAngle) / 2 > Math.PI ? 'end' : 'middle'
      })
      .attr('font-size', '10px')
      .attr('fill', d => {
        // Use black for outside labels, white for inside labels
        const sliceAngle = d.endAngle - d.startAngle // Slice angle
        const sliceWidth = radius * sliceAngle // Arc length (approx)
        const labelWidth = `$${ (d.data.totalDisbursements / 1e6).toFixed(1) } million`.length * 6 // Estimate label width
        return sliceWidth < labelWidth ? 'black' : 'white'
      })
      .text(d => `$${ (d.data.totalDisbursements / 1e6).toFixed(1) } million`)

    // Add connecting lines for outside labels
    arcs.append('line')
      .attr('x1', d => {
        // Calculate the outer edge of the slice
        return d3.arc().innerRadius(radius).outerRadius(radius).centroid(d)[0]
      })
      .attr('y1', d => {
        return d3.arc().innerRadius(radius).outerRadius(radius).centroid(d)[1]
      })
      .attr('x2', d => {
        const sliceAngle = d.endAngle - d.startAngle
        const sliceWidth = radius * sliceAngle
        const labelWidth = `$${ (d.data.totalDisbursements / 1e6).toFixed(1) } million`.length * 6

        // Use outer label arc if label is outside
        return sliceWidth < labelWidth ? labelArc.centroid(d)[0] : arc.centroid(d)[0]
      })
      .attr('y2', d => {
        const sliceAngle = d.endAngle - d.startAngle
        const sliceWidth = radius * sliceAngle
        const labelWidth = `$${ (d.data.totalDisbursements / 1e6).toFixed(1) } million`.length * 6

        return sliceWidth < labelWidth ? labelArc.centroid(d)[1] : arc.centroid(d)[1]
      })
      .attr('stroke', 'black')
      .attr('stroke-width', d => {
        const sliceAngle = d.endAngle - d.startAngle
        const sliceWidth = radius * sliceAngle
        const labelWidth = `$${ (d.data.totalDisbursements / 1e6).toFixed(1) } million`.length * 6

        return sliceWidth < labelWidth ? 1 : 0 // Hide line if label is inside
      })
      .attr('fill', 'none')

    // Add legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${ radius + 50 }, -${ radius - 50 })`)

    // Add column headers
    legend.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Recipients')

    legend.append('text')
      .attr('x', 350)
      .attr('y', -20)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'end')
      .text('Fiscal Year 2025')

    const legendItems = legend
      .selectAll('.legend-item')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${ i * 20 })`)

    // Add color boxes
    legendItems
      .append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d, i) => color(i))

    // Add recipient names (column 1)
    legendItems
      .append('text')
      .attr('x', 20) // Position next to color box
      .attr('y', 12) // Vertically align with color box
      .attr('font-size', '12px')
      .text(d => d.recipient)

    // Add total amounts (column 2)
    legendItems
      .append('text')
      .attr('x', 350) // Position in the second column
      .attr('y', 12) // Vertically align with color box
      .attr('font-size', '12px')
      .attr('text-anchor', 'end') // Align amounts to the right
      .text(d => `$${ formatCurrency(d.totalDisbursements) }`)

    legend.append('text')
      .attr('x', 0)
      .attr('y', data.length * 20 + 20) // Below the legend items
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Total:')

    legend.append('text')
      .attr('x', 350)
      .attr('y', data.length * 20 + 20)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'end')
      .text(`$${ formatCurrency(totalSum) }`)
  }, [data])

  return <svg ref={svgRef}></svg>
}

export default DisbursementsPieChart
