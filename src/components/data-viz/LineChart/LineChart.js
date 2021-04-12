import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ChartTitle from '../ChartTitle'
import D3LineChart from './D3LineChart.js'
import useWindowSize from '../../../js/hooks/useWindowSize'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
  },
  chart: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '200px',
    fill: theme.palette.chart.primary,
    '& g path.line:nth-of-type(1)': {
      stroke: theme.palette.explore[400],
    },
    '& g path.line:nth-of-type(2)': {
      stroke: theme.palette.explore[300],
    },
    '& g path.line:nth-of-type(3)': {
      stroke: theme.palette.explore[200],
    },
    '& g path.line:nth-of-type(4)': {
      stroke: theme.palette.explore[100],
    }
  },
  legend: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    fill: 'none',
    'pointer-events': 'all',
  },
  /* Style the dots by assigning a fill and stroke */
  dot: {
    fill: '#ffab00',
    stroke: '#fff',
  },
}

))
/**
 * Line charts provide a way to visualize data changes over time.
 * An example exists in the “Compare Revenue” section in Explore data.  The line
 * chart is titled [Revenue over time](https://revenuedata.doi.gov/explore?dataType=Revenue&location=NF&mapLevel=State&offshoreRegions=false&period=Calendar%20Year&year=2019#nationwide-revenue-summary).
 */
const LineChart = props => {
  const classes = useStyles()
  const size = useWindowSize()
  const { data, ...options } = props
  // console.debug('LINE CHART', data)
  const elemRef = useRef(null)
  const title = options.title || ''

  const drawLineChart = () => {
    elemRef.current.children[0].innerHTML = ''
    elemRef.current.children[1].innerHTML = ''
    // eslint-disable-next-line no-unused-vars
    const chart = new D3LineChart(elemRef.current, data, options)
  }

  useEffect(() => {
    drawLineChart()
  })

  useEffect(() => {
    drawLineChart()
  }, [size.width])

  return (
    <>
      {title && <ChartTitle>{title}</ChartTitle>}
      <div className={`${ classes.container } line-chart` } ref={elemRef}>
        <div className={classes.chart}></div>
        <div className={classes.legend}></div>
      </div>
    </>
  )
}

export default LineChart
const chartData = [[2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
		   [8400370928.579998, 8179195334.290002, 10066646809.39, 12470115681.020004,
		    11337325654.410002, 22916901416.190002, 7856101940.209999, 10397868864.989998,
		    11084572140.82, 12731539824.109999, 12354020871.16, 12329785862.94, 7507964281.759999,
		    5323669178.760001, 6922683701.140001, 9937663391.15, 9476809088.28],
		   [654125578.24, 776306335.29, 1022783197.27, 1102112963.0600002, 1110519571.24,
		    1328898765.79, 586606790.6800001, 824281783.39, 977296752.2100002, 967419227.56,
		    1074590499.4, 1304111700.72, 859715451.4499998, 655424151.1800001,
		    1008127152.68, 2447493889.2400002, 1545837438.5800002]
]

LineChart.Preview = {
  group: 'Data Visualizations',
  demos: [
    {
      title: 'Example',
      code: `<LineChart data={${ JSON.stringify(chartData) }}/>`,
    }
  ]
}
