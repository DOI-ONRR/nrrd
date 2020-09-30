import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ChartTitle from '../ChartTitle'
import BarChart from './D3StackedBarChart.js'
import { Collapse, Button } from '@material-ui/core';
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
      fontSize: '.85rem',
      fontWeight: 'normal',
    },
    '& .x-axis > .tick:nth-child(odd)': {
      '@media (max-width: 375px)': {
        display: 'none',
      },
    },
    '& .y-axis > .tick': {
      fontSize: theme.typography.body2.fontSize,
    },
  },
  horizontal: {
    position: 'relative',
    height: 25,
    '& .horizontal-stacked-bar-chart': {
      position: 'absolute',
      top: 0,
      left: 5,
      transform: 'rotate(90deg)',
      transformOrigin: 'bottom left',
    }
  },
  legend: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    fontSize: theme.typography.h5.fontSize,
    '& tr > td:first-child': {
      width: 10,
    },
    '& td .legend-rect': {
      fill: theme.palette.chart.secondary,
      backgroundColor: theme.palette.chart.secondary,
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
      verticalAlign: 'top',
    },
    '& .legend-rect': {
      marginTop: theme.spacing(0.5),
    },
  }
}))

const StackedBarChart = props => {
  // const mapJson=props.mapJson || "https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json";
  // use ONRR topojson file for land
  const [collapsed, setCollapsed] = useState(props.collapsedLegend || false)
  const classes = useStyles()
    console.debug("SBC collapsed", collapsed, ' <> ', props)
  const size = useWindowSize()

  const { data, ...options } = props
  const elemRef = useRef(null)
  const title = options.title || ''

  const drawChart = () => {
      elemRef.current.getElementsByClassName('chart_div')[0].innerHTML = ''
      elemRef.current.getElementsByClassName('legend_div')[0].innerHTML = ''
    const chart = new BarChart(elemRef.current, data, options)
    chart.draw(data)
  }

  // init drawing of chart
  useEffect(() => {
    drawChart()
  })
    console.debug("SBC collapsed", collapsed, ' <> ', props)

  // redraw chart on resize event
  useEffect(() => {
    drawChart()
  }, [size.width])

  return (
    <>
	{title && <ChartTitle>{title}</ChartTitle>}
	<Button>Default</Button>
      <div className={classes.container} ref={elemRef}>
          <div className={`${ classes.chart } ${ options.horizontal && classes.horizontal }` + ' chart_div'}></div>
	  {  props.collapsibleLegend &&  <Button variant='text' onClick={ () => setCollapsed(!collapsed) }><a href>+/-</a></Button> }
	  <Collapse in={! collapsed} >
	  <div className={classes.legend + ' legend_div'}  ></div>
	  </Collapse>	  
      </div>
    </>
  )
}

export default StackedBarChart
