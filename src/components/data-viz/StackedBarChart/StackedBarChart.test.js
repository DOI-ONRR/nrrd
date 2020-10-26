/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from 'test-utils'

import StackedBarChart from './StackedBarChart'

const chartData=[{year: 2011, source: "Federal - not tied to a location", sum: 3914026.89, __typename: "total_yearly_fiscal_revenue"}, {year: 2011, source: "Native American", sum: 551270612.58, __typename: "total_yearly_fiscal_revenue"}, {year: 2011, source: "Federal Offshore", sum: 6552686532.09, __typename: "total_yearly_fiscal_revenue"}, {year: 2011, source: "Federal Onshore", sum: 4148457354.89, __typename: "total_yearly_fiscal_revenue"}, {year: 2012, source: "Federal - not tied to a location", sum: 9973305.45, __typename: "total_yearly_fiscal_revenue"}, {year: 2012, source: "Native American", sum: 706349124.76, __typename: "total_yearly_fiscal_revenue"}, {year: 2012, source: "Federal Offshore", sum: 6927538690.41, __typename: "total_yearly_fiscal_revenue"}, {year: 2012, source: "Federal Onshore", sum: 4441672219.57, __typename: "total_yearly_fiscal_revenue"}, {year: 2013, source: "Federal - not tied to a location", sum: 4705484, __typename: "total_yearly_fiscal_revenue"}, {year: 2013, source: "Native American", sum: 977261743.25, __typename: "total_yearly_fiscal_revenue"}, {year: 2013, source: "Federal Offshore", sum: 9136145627.08, __typename: "total_yearly_fiscal_revenue"}, {year: 2013, source: "Federal Onshore", sum: 4372683180.35, __typename: "total_yearly_fiscal_revenue"}, {year: 2014, source: "Federal - not tied to a location", sum: 5796712.46, __typename: "total_yearly_fiscal_revenue"}, {year: 2014, source: "Native American", sum: 1141747611.23, __typename: "total_yearly_fiscal_revenue"}, {year: 2014, source: "Federal Offshore", sum: 7453501975.99, __typename: "total_yearly_fiscal_revenue"}, {year: 2014, source: "Federal Onshore", sum: 4671983085.96, __typename: "total_yearly_fiscal_revenue"}, {year: 2015, source: "Federal - not tied to a location", sum: 8186920.73, __typename: "total_yearly_fiscal_revenue"}, {year: 2015, source: "Native American", sum: 816039641.99, __typename: "total_yearly_fiscal_revenue"}, {year: 2015, source: "Federal Offshore", sum: 5149494341.7, __typename: "total_yearly_fiscal_revenue"}, {year: 2015, source: "Federal Onshore", sum: 3746851287.62, __typename: "total_yearly_fiscal_revenue"}, {year: 2016, source: "Federal - not tied to a location", sum: 5272660.04, __typename: "total_yearly_fiscal_revenue"}, {year: 2016, source: "Native American", sum: 555206652.02, __typename: "total_yearly_fiscal_revenue"}, {year: 2016, source: "Federal Offshore", sum: 2847884396.96, __typename: "total_yearly_fiscal_revenue"}, {year: 2016, source: "Federal Onshore", sum: 2649179823.26, __typename: "total_yearly_fiscal_revenue"}, {year: 2017, source: "Federal - not tied to a location", sum: 3517306.8, __typename: "total_yearly_fiscal_revenue"}, {year: 2017, source: "Native American", sum: 675093708.17, __typename: "total_yearly_fiscal_revenue"}, {year: 2017, source: "Federal Offshore", sum: 3623512533.52, __typename: "total_yearly_fiscal_revenue"}, {year: 2017, source: "Federal Onshore", sum: 2924530284.28, __typename: "total_yearly_fiscal_revenue"}, {year: 2018, source: "Federal - not tied to a location", sum: 2831594.55, __typename: "total_yearly_fiscal_revenue"}, {year: 2018, source: "Native American", sum: 1051269700.27, __typename: "total_yearly_fiscal_revenue"}, {year: 2018, source: "Federal Offshore", sum: 4759082154.46, __typename: "total_yearly_fiscal_revenue"}, {year: 2018, source: "Federal Onshore", sum: 3351352696.01, __typename: "total_yearly_fiscal_revenue"}, {year: 2019, source: "Federal - not tied to a location", sum: 2778901.56, __typename: "total_yearly_fiscal_revenue"}, {year: 2019, source: "Native American", sum: 1136494885.1, __typename: "total_yearly_fiscal_revenue"}, {year: 2019, source: "Federal Offshore", sum: 6018042860.89, __typename: "total_yearly_fiscal_revenue"}, {year: 2019, source: "Federal Onshore", sum: 4849592145.97, __typename: "total_yearly_fiscal_revenue"}, {year: 2020, source: "Federal - not tied to a location", sum: 3384563.06, __typename: "total_yearly_fiscal_revenue"}, {year: 2020, source: "Native American", sum: 978974617.08, __typename: "total_yearly_fiscal_revenue"}, {year: 2020, source: "Federal Offshore", sum: 3746924076.62, __typename: "total_yearly_fiscal_revenue"}, {year: 2020, source: "Federal Onshore", sum: 2866225227.9, __typename: "total_yearly_fiscal_revenue"}]

// The following are required for charts to render
const chartTitle='Stacked Bar Chart Unit Test'
const yAxis = 'sum'
const xAxis = 'year'
const yGroupBy = 'source'
const yOrderBy = ['Federal onshore', 'Federal offshore', 'Native American', 'Federal - Not tied to a lease']

describe('Stacked Bar Chart component:', () => {
    test('Basic Stacked Bar Chart  rendered succesfully', () => {
	render(  <StackedBarChart
		     data={chartData}
		     title={chartTitle}
	             xAxis={xAxis}
	             yAxis={yAxis}
	             yGroupBy={yGroupBy}
		     yOrderBy={yOrderBy}
	/>)
	expect(screen.getByText(chartTitle)).toBeInTheDocument()
    })
    test('legendFormat Stacked Bar Chart  rendered succesfully', () => {
	render(  <StackedBarChart
		     data={chartData}
		     title={chartTitle}
		     xAxis={xAxis}
		     yAxis={yAxis}
		     yGroupBy={yGroupBy}
		     yOrderBy={yOrderBy}
		     legendFormat={v => ('foo') }
	/>)
	// 4 plus totall
	expect(screen.getAllByText('foo')).toHaveLength(5)
    })
    test('units Stacked Bar Chart  rendered succesfully', () => {
	const units='foo'
	render(  <StackedBarChart
		     data={chartData}
		     title={chartTitle}
		     xAxis={xAxis}
		     yAxis={yAxis}
		     yGroupBy={yGroupBy}
		     yOrderBy={yOrderBy}
		     units={units}
	/>)
	// Learn how to match foo instead of hardcoding 15 billion foo encase chart data changes
	expect(screen.getByText('15 billion foo')).toBeInTheDocument()
    })

    test('x Labels Stacked Bar Chart  rendered succesfully', () => {
	const xLabels = (x, i) => {
        return x.map(v => ('foo'))
	}
	
	render(  <StackedBarChart
		     data={chartData}
		     title={chartTitle}
		     xAxis={xAxis}
		     yAxis={yAxis}
		     yGroupBy={yGroupBy}
		     yOrderBy={yOrderBy}
		     xLabels={xLabels}
	/>)
	// Learn how to match foo instead of hardcoding 15 billion foo encase chart data changes
	expect(screen.getAllByText('foo')).toHaveLength(10)
    })

    test(' Stacked Bar Chart  rendered succesfully', () => {
	
	const legendHeaders = (headers, row) => {
            const headerArr = ['foo','','foo']
            return headerArr
	}
	
	render(  <StackedBarChart
		     data={chartData}
		     title={chartTitle}
		     xAxis={xAxis}
		     yAxis={yAxis}
		     yGroupBy={yGroupBy}
		     yOrderBy={yOrderBy}
		     legendHeaders={legendHeaders}
	/>)
	// 
	expect(screen.getAllByText('foo')).toHaveLength(2)
    })

    
    
})

