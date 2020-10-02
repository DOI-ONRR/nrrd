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
      stroke: theme.palette.circleChart[400],
    },
    '& g path.line:nth-of-type(2)': {
      stroke: theme.palette.circleChart[300],
    },
    '& g path.line:nth-of-type(3)': {
      stroke: theme.palette.circleChart[200],
    },
    '& g path.line:nth-of-type(4)': {
      stroke: theme.palette.circleChart[100],
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
      <div className={classes.container} ref={elemRef}>
        <div className={classes.chart}></div>
        <div className={classes.legend}></div>
      </div>
    </>
  )
}

export default LineChart
