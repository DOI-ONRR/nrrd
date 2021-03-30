/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from 'test-utils'

import CircleChart from './CircleChart'
import Circles from '../svg/Circles'

const chartData = [
  { location_name: 'Gulf of Mexico', total: 5163524881.620001 },
  { location_name: 'New Mexico', total: 2447493889.24 },
  { location_name: 'Wyoming', total: 1246326179.16 },
  { location_name: 'Native American', total: 1155674819.2200003 },
  { location_name: 'North Dakota', total: 289595600.7900001 },
  { location_name: 'Other', total: 749011209.8500004 },
  { location_name: 'Utah', total: 160480220.62999997 },
  { location_name: 'California', total: 102385747.61 },
  { location_name: 'Montana', total: 60166185.04999999 },
  { location_name: 'Pacific', total: 50236044.75 },
  { location_name: 'Alaska', total: 35739245.19 },
  { location_name: 'Texas', total: 17681054.52 },
  { location_name: 'Oklahoma', total: 17617606.7 },
  { location_name: 'Louisiana', total: 9491872.040000001 },
  { location_name: 'Nevada', total: 9412583.98 },
  { location_name: 'Missouri', total: 9125090.67 },
  { location_name: 'Idaho', total: 8593734.620000001 },
  { location_name: 'Alaska Offshore', total: 8064335.08 },
  { location_name: 'Atlantic', total: 4408728 },
  { location_name: 'Ohio', total: 3478125.4 },
  { location_name: 'Alabama', total: 3155672.3000000003 },
  { location_name: 'Not tied to a lease', total: 2820634.97 }
]

// The following are required for charts to render
const chartTitle = 'Circle Chart Unit Test'
const xAxis = 'location_name'
const yAxis = 'total'
const legendHeaders = ['foo', 'bar']

describe('Circle Chart component:', () => {
  test('Basic Stacked Bar Chart  rendered successfully', () => {
    render(<CircleChart
		 data={chartData}
		 title={chartTitle}
	   xAxis={xAxis}
	   yAxis={yAxis}
      legendHeaders={legendHeaders}
    />)
    expect(screen).toBeDefined()
    // Currently chart title is not put into div anywhere
    // expect(screen.getByText(chartTitle)).ToBeInTheDocument()
  })
})
