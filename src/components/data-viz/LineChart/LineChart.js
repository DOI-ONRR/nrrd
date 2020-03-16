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
    fill: theme.palette.chart.primaryd,
  },
  legend: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  }
}))

const LineChart = props => {

  const classes = useStyles()
  const { data, ...options } = props
  const elemRef= useRef(null)
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
