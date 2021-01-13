/* eslint-disable quotes */
import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ChartTitle from '../ChartTitle'
import BarChart from './D3StackedBarChart.js'
import { Collapse, Button } from '@material-ui/core'
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
      cursor: 'pointer',
    },
    '& .bar .stacked-bar-chart-item': {
      transition: 'all .1s ease-in'
    },
    '& .bar.active .stacked-bar-chart-item:nth-child(1), .bar:hover .stacked-bar-chart-item:nth-child(1)': {
      fill: `${ theme.palette.explore[700] } !important`
    },
    '& .bar.active .stacked-bar-chart-item:nth-child(2), .bar:hover .stacked-bar-chart-item:nth-child(2)': {
      fill: `${ theme.palette.explore[600] } !important`
    },
    '& .bar.active .stacked-bar-chart-item:nth-child(3), .bar:hover .stacked-bar-chart-item:nth-child(3)': {
      fill: `${ theme.palette.explore[500] } !important`
    },
    '& .bar.active .stacked-bar-chart-item:nth-child(4), .bar:hover .stacked-bar-chart-item:nth-child(4)': {
      fill: `${ theme.palette.explore[400] } !important`
    },
    '& .bar.active .stacked-bar-chart-item:nth-child(5), .bar:hover .stacked-bar-chart-item:nth-child(5)': {
      fill: `${ theme.palette.explore[300] } !important`
    },
    '& .bar.active .stacked-bar-chart-item:nth-child(6), .bar:hover .stacked-bar-chart-item:nth-child(6)': {
      fill: `${ theme.palette.explore[200] } !important`
    },
    '& .bar.active .stacked-bar-chart-item:nth-child(7), .bar:hover .stacked-bar-chart-item:nth-child(7)': {
      fill: `${ theme.palette.explore[100] } !important`
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
      // fill: theme.palette.chart.secondary,
      // backgroundColor: theme.palette.chart.secondary,
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
    '& .legend-table > thead th:first-child::first-letter': {
      textTransform: 'uppercase',
    },
    '& .legend-table > tbody tr td': {
      borderBottom: `1px solid ${ theme.palette.grey[300] }`,
    },
    '& .legend-table > tbody tr:last-child td': {
      border: 'none',
    },
    '& .legend-table th, & .legend-table td': {
      padding: '6px 24px 6px 16px',
      verticalAlign: 'top',
    },
    '& .legend-table td:first-child': {
      padding: '6px 6px 6px 16px',
    },
    '& .legend-rect': {
      marginTop: theme.spacing(0.5),
    },
  },
  legendButton: {
    color: theme.palette.links.default,
    '& > span': {
      textDecoration: 'underline',
    }
  }
}))

const StackedBarChart = props => {
  // const mapJson=props.mapJson || "https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json";
  // use ONRR topojson file for land
  const [collapsed, setCollapsed] = useState(props.collapsedLegend || false)
  const classes = useStyles()
  // console.debug("SBC collapsed", collapsed, ' <> ', props)
  const size = useWindowSize()

  const { data, ...options } = props
  const elemRef = useRef(null)
  const title = options.title || ''
  const buttonValue = collapsed ? 'Show details' : 'Hide details'
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
  // redraw chart on resize event
  useEffect(() => {
    drawChart()
  }, [size.width])

  return (
    <>
      {title && <ChartTitle>{title}</ChartTitle>}
      <div className={classes.container} ref={elemRef}>
        <div className={`${ classes.chart } ${ options.horizontal ? classes.horizontal : '' } chart_div`}></div>
        { props.collapsibleLegend && <Button variant='text' className={classes.legendButton} onClick={ () => setCollapsed(!collapsed) }>{buttonValue}</Button> }
        <Collapse in={!collapsed}>
          <div className={classes.legend + ' legend_div'}></div>
        </Collapse>
      </div>
    </>
  )
}

export default StackedBarChart

const chartData = [
  { year: 2018, source: 'Federal - not tied to a location', sum: 2831594.55 },
  { year: 2018, source: 'Native American', sum: 1051269700.27 },
  { year: 2018, source: 'Federal Offshore', sum: 4759082154.46 },
  { year: 2018, source: 'Federal Onshore', sum: 3351352696.01 },
  { year: 2019, source: 'Federal - not tied to a location', sum: 2778901.56 },
  { year: 2019, source: 'Native American', sum: 1136494885.1 },
  { year: 2019, source: 'Federal Offshore', sum: 6018042860.89 },
  { year: 2019, source: 'Federal Onshore', sum: 4849592145.97 },
  { year: 2020, source: 'Federal - not tied to a location', sum: 3384563.06 },
  { year: 2020, source: 'Native American', sum: 978974617.08 },
  { year: 2020, source: 'Federal Offshore', sum: 3746924076.62 },
  { year: 2020, source: 'Federal Onshore', sum: 2866225227.9 }]

export const StackedBarChartDemos = [
  {
    title: 'Example',
    code: "<StackedBarChart data={" +
    JSON.stringify(chartData) + "} title={'Example'} xAxis={'year'} yAxis={'sum'} yGroupBy={'source'} yOrderBy={" +
    JSON.stringify(['Federal onshore', 'Federal offshore', 'Native American', 'Federal - Not tied to a lease']) + "}/>",
  }
]
