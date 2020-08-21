import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ChartTitle from '../ChartTitle'
import D3LineChart from './D3LineChart.js'

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
      stroke: theme.palette.blue[300],
    },
    '& g path.line:nth-of-type(2)': {
      stroke: theme.palette.orange[300],
    },
    '& g path.line:nth-of-type(3)': {
      stroke: theme.palette.green[300],
    },
    '& g path.line:nth-of-type(4)': {
      stroke: theme.palette.purple[300],
    }
  },
  legend: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  // line: {
  //   fill: 'none',
  //   stroke: '#ffab00',
  //   'stroke-width': 3
  // },

  overlay: {
    fill: 'none',
    'pointer-events': 'all',
  },

  /* Style the dots by assigning a fill and stroke */
  dot: {
    fill: '#ffab00',
    stroke: '#fff',
  },
  /*
  .focus circle {
  fill: none;
  stroke: steelblue;
 */

}

))

const LineChart = props => {
  const classes = useStyles()
  const { data, ...options } = props
   // console.debug('LINE CHART', data)
  const elemRef = useRef(null)
  const title = options.title || ''

  useEffect(() => {
    elemRef.current.children[0].innerHTML = ''
    elemRef.current.children[1].innerHTML = ''
    const chart = new D3LineChart(elemRef.current, data, options)
  })

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
