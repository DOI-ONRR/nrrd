/* eslint-disable no-undef */
import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from 'test-utils'

import LineChart from './LineChart'



const chartData =[[2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
		  [8400370928.579998, 8179195334.290002, 10066646809.39, 12470115681.020004, 11337325654.410002, 22916901416.190002, 7856101940.209999, 10397868864.989998, 11084572140.82, 12731539824.109999, 12354020871.16, 12329785862.94, 7507964281.759999, 5323669178.760001, 6922683701.140001, 9937663391.15, 9476809088.28],
		  [654125578.24, 776306335.29, 1022783197.27, 1102112963.0600002, 1110519571.24, 1328898765.79, 586606790.6800001, 824281783.39, 977296752.2100002, 967419227.56, 1074590499.4, 1304111700.72, 859715451.4499998, 655424151.1800001, 1008127152.68, 2447493889.2400002, 1545837438.5800002]
]

// The following are required for charts to render
const chartTitle = 'Circle Chart Unit Test'
const xAxis = 'location_name'
const yAxis = 'total'


describe('Line Chart component:', () => {
  test('Basic Stacked Line Chart  rendered succesfully', () => {
      render(<LineChart
		 data={chartData}
	  />)
      expect(screen).toBeDefined() 
  })

})
