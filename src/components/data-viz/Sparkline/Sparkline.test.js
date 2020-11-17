/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from 'test-utils'

import Sparkline from './Sparkline'

const chartData = [
  ['2010', 4515762982.65],
  ['2011', 6049822215.65],
  ['2012', 6194230491.15],
  ['2013', 8250817981.41],
  ['2014', 80817981.41],
  ['2015', 82817981.41],
  ['2015', 4393132423.47],
  ['2016', 2201599585.83],
  ['2017', 2244876355.56],
  ['2018', 3201250255.47],
  ['2019', 4904041158.92]
]

// The following are required for charts to render

describe('Line Chart component:', () => {
  test('Basic Sparkline Chart  rendered succesfully', () => {
    render(<Sparkline
		 data={chartData}
    />)
    expect(screen).toBeDefined()
  })
  test('Basic Sparkline Chart  highlight succesfully', () => {
	  render(<Sparkline
		     data={chartData}
		     highlightIndex={4}

	  />)
	  expect(screen).toBeDefined()
  })
})
