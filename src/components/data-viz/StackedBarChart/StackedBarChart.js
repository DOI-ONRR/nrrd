import React, { useEffect, useRef } from 'react'
// import ReactDOM from 'react-dom'

// import utils from '../../../js/utils'

import { makeStyles } from '@material-ui/core/styles'
// import stackedBarChart from '../../../js/bar-charts/stacked-bar-chart'
import BarChart from './stacked-bar-chart.js'
const useStyles = makeStyles(theme => ({
  container: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '400px',
  },
  chart: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '200px',
    fill: theme.palette.chart.primary,
    '& .bars > .bar:hover': {
      fill: theme.palette.chart.secondary
    },
    '& .bars > .active': {
      fill: theme.palette.chart.secondary
    },
    '& .maxExtent': {
      fontSize: theme.typography.chartText,
    },
    '& .x-axis > .tick': {
      fontSize: theme.typography.chartText,
    }
  },
  legend: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '200px',
    fontSize: theme.typography.chartText,
    '& .legend-rect': {
      fill: theme.palette.chart.secondary,
    }
  }
}))

const StackedBarChart = props => {
  // const mapJson=props.mapJson || "https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json";
  // use ONRR topojson file for land

  const classes = useStyles()

  const data = props.data
  const options = {}
  const formatLegendFunc = props.legendDataFormatFunc
  options.columns = props.columns
  options.yLabels = props.yLabels
  options.xLabels = props.xLabels
  options.xRotate = props.xRotate
  console.debug('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOPITIONS', options)
  //   const selected = props.selected
  const elemRef = useRef(null)

  useEffect(() => {
    // stackedBarChar(elemRef.current,{}, datas);
    elemRef.current.children[0].innerHTML = ''
    elemRef.current.children[1].innerHTML = ''
    //  const chart2 = new BarChart2(elemRef.current, data2, options)
    //    chart2.draw(data2)
    const chart = new BarChart(elemRef.current, data, options, formatLegendFunc)
    // chart.selected(selected);
    chart.draw(data)
  }, [elemRef])

  return (
	  <div className={classes.container} ref={elemRef}>
	    <div className={classes.chart}></div><div className={classes.legend}></div>
    </div>
  )
}

export default StackedBarChart
