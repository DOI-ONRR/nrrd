import React, { useEffect, useRef } from 'react'
// import ReactDOM from 'react-dom'

// import utils from '../../../js/utils'

import { makeStyles } from '@material-ui/core/styles'

import ChartTitle from '../ChartTitle'

// import stackedBarChart from '../../../js/bar-charts/stacked-bar-chart'
import D3CircleChart from './D3CircleChart.js'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  chart: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '70%',
    fill: theme.palette.chart.primary,
    '& .bars > .bar:hover': {
      fill: theme.palette.chart.secondary,
      cursor: 'pointer',
    },
    '& .bars > .active': {
      fill: theme.palette.chart.secondary,
    },
    '& .maxExtent': {
      fontSize: theme.typography.h5.fontSize,
    },
    '& .x-axis > .tick': {
      fontSize: theme.typography.h5.fontSize,
    }
  },
  legend: {
    display: 'block',
    top: 0,
    left: 0,
    fontSize: theme.typography.h5.fontSize,
    '& tr > td:first-child': {
      width: 10,
    },
    '& td .legend-rect': {
      display: 'block',
      height: 20,
      width: 20,
    },
    '& .legend-table': {
      width: '100%',
      borderSpacing: 0,
      borderCollapse: 0,
      boxShadow: 'none',
    },
    '& .legend-table > thead th:last-child, & .legend-table > tbody td:last-child': {
      textAlign: 'right',
    },
    '& .legend-table > thead th': {
      fontWeight: 'bold',
      textAlign: 'left',
      borderBottom: `1px solid ${ theme.palette.grey[300] }`,
    },
    '& .legend-table > tbody tr td': {
      borderBottom: `1px solid ${ theme.palette.grey[300] }`,
    },
    '& .legend-table > tbody tr:last-child td': {
      border: 'none',
    },
    '& .legend-table th, & .legend-table td': {
      padding: theme.spacing(0.5),
    },
  }
}))

const CircleChart = props => {
  // const mapJson=props.mapJson || "https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json";
  // use ONRR topojson file for land

  const classes = useStyles()
  const { data, ...options } = props
  const elemRef = useRef(null)

  useEffect(() => {
    // stackedBarChar(elemRef.current,{}, datas);
    // console.debug("EEEEEEEEEEEEEEEEEEEE", elemRef)
    elemRef.current.children[0].innerHTML = ''
    elemRef.current.children[1].innerHTML = ''
    //  const chart2 = new BarChart2(elemRef.current, data2, options)
    //    chart2.draw(data2)
    //  console.debug(elemRef.current)
    const chart = new D3CircleChart(elemRef.current, data, options)
    // chart.selected(selected);
    // chart.draw(data)
  }, [elemRef])

  return (
    <>
      <div className={classes.container} ref={elemRef}>
        <div className={classes.chart}></div>
        <div className={classes.legend}></div>
      </div>
    </>
  )
}

export default CircleChart
