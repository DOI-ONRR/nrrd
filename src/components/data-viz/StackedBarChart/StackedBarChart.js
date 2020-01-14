import React, { useEffect, useRef } from 'react'
// import ReactDOM from 'react-dom'

// import utils from '../../../js/utils'

import { makeStyles } from '@material-ui/core/styles'
// import stackedBarChart from '../../../js/bar-charts/stacked-bar-chart'
import BarChart from './stacked-bar-chart.js'

const useStyles = makeStyles(theme => ({
  chart: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '200px',
    fill: '#435159',
    '& .bars > .bar:hover': {
      fill: theme.palette.chart.secondary
    },
    '& .bars > .active': {
      fill: theme.palette.chart.secondary
    },
  },
  legend: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '200px',
    '& .legend-rect': {
      fill: theme.palette.chart.secondary
    }
  }
}))

const StackedBarChart = props => {
  // const mapJson=props.mapJson || "https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json";
  // use ONRR topojson file for land

  const classes = useStyles()
  const data = props.data
  //   const selected = props.selected
  const elemRef = useRef(null)

  useEffect(() => {
    console.debug(data)
    console.debug('StackedBarChart useEffect fired!')

    // stackedBarChar(elemRef.current,{}, data);
    const chart = new BarChart(elemRef.current, data)
    // chart.selected(selected)
    chart.draw(data)
  }, [elemRef])

  return (
	  <div className={classes.chart} ref={elemRef}>
	    <div className={classes.chart}></div><div className={classes.legend}></div>
    </div>
  )
}

export default StackedBarChart
