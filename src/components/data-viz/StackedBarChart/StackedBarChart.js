import React, { useEffect, useRef } from 'react'
// import ReactDOM from 'react-dom'

// import utils from '../../../js/utils'

import { makeStyles } from '@material-ui/core/styles'
// import stackedBarChart from '../../../js/bar-charts/stacked-bar-chart'
import BarChart from './stacked-bar-chart.js'
import BarChart2 from './review-stacked.js'
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
  const data2 = [
    {
      X1: [{ Y1: 11, Y2: 130, Y3: 18, Y4: 20, Y5: 24, Y6: 25, Y7: 27 }
	       ]
    },
    { X2: [{ Y1: 10, Y2: 14, Y3: 16, Y4: 260, Y5: 24, Y6: 25, Y7: 27 }] },
    { X3: [{ Y1: 11, Y2: 16, Y3: 180, Y4: 22, Y5: 24, Y6: 25, Y7: 27 }] },
    { X4: [{ Y1: 14, Y2: 16, Y3: 20, Y4: 24, Y5: 240, Y6: 25, Y7: 27 }] },
    { X5: [{ Y1: 100, Y2: 12, Y3: 15, Y4: 22, Y5: 24, Y6: 25, Y7: 27 }] },
    { X6: [{ Y1: 13, Y2: 16, Y3: 19, Y4: 25, Y5: 24, Y6: 25, Y7: 270 }] }
  ]

  const data = props.data
  const options = {}
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
    const chart = new BarChart(elemRef.current, data, options)
    // chart.selected(selected);
    chart.draw(data)
    
  })

  return (
	  <div className={classes.container} ref={elemRef}>
	    <div className={classes.chart}></div><div className={classes.legend}></div>
    </div>
  )
}

export default StackedBarChart
