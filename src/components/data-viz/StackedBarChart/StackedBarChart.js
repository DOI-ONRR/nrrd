import React, { useEffect, useRef } from 'react'
// import ReactDOM from 'react-dom'

// import utils from '../../../js/utils'

import { makeStyles } from '@material-ui/core/styles'

import ChartTitle from '../ChartTitle'

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
      fill: theme.palette.chart.secondary,
      cursor: 'pointer',
    },
    '& .bars > .active': {
      fill: theme.palette.chart.secondary,
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
    '& tr > td:first-child': {
      width: 10,
    },
    '& td .legend-rect': {
      fill: theme.palette.chart.secondary,
      backgroundColor: theme.palette.chart.secondary,
      display: 'block',
      height: 15,
      width: 15,
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

const StackedBarChart = props => {
  // const mapJson=props.mapJson || "https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json";
  // use ONRR topojson file for land

  const classes = useStyles()

  const data = props.data
  const options = {}
  const formatLegendFunc = props.legendDataFormatFunc
  const title = props.chartTitle

  options.columns = props.columns
  options.columnNames = props.columnNames
  options.yLabels = props.yLabels
  options.xLabels = props.xLabels
  options.xRotate = props.xRotate
  options.onClick = props.onClick

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
    <>
      {title && <ChartTitle>
        {title}
      </ChartTitle>}
      <div className={classes.container} ref={elemRef}>
        <div className={classes.chart}></div>
        <div className={classes.legend}></div>
      </div>
    </>
  )
}

export default StackedBarChart
