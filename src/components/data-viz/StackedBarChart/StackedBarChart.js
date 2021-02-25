/* eslint-disable quotes */
import React, { useEffect, useRef, useState } from 'react'

import Box from '@material-ui/core/Box'
import createStyles from '@material-ui/styles/createStyles'
import withStyles from '@material-ui/styles/withStyles'
import useTheme from '@material-ui/styles/useTheme'
import ChartTitle from '../ChartTitle'
import BarChart from './D3StackedBarChart.js'
import { Collapse, Button } from '@material-ui/core'
import useWindowSize from '../../../js/hooks/useWindowSize'

const DefaultContainer = withStyles((theme, additionalStyles) =>
  createStyles({
    root: {
      display: 'block',
      top: 0,
      left: 0,
      width: '100%',
      ...additionalStyles
    },
  })
)(Box)

const DefaultChartContainer = withStyles((theme, additionalStyles) =>
  createStyles({
    root: {
      display: 'block',
      top: 0,
      left: 0,
      width: '100%',
      fill: 'inherit',
      '& .bars > .bar:hover': {
        cursor: 'pointer',
      },
      '& .bar .stacked-bar-chart-item': {
        transition: 'all .1s ease-in'
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
        fontSize: '.85rem',
        fontWeight: 'normal',
        transition: 'all .1s ease-in',
      },
      '& .x-axis .tick.active > text': {
        fontWeight: 'bold',
        fontSize: '.90rem',
        fill: theme.palette.common.black
      },
      '& .x-axis-groups > text': {
        fontSize: '.70rem'
      },
      ...additionalStyles
    },
  })
)(Box)

const CompactChartContainer = withStyles((theme, additionalStyles) =>
  createStyles({
    root: {
      display: 'block',
      top: 0,
      left: 0,
      width: '100%',
      fill: 'inherit',
      '& .bars > .bar:hover': {
        cursor: 'pointer',
      },
      '& .bar .stacked-bar-chart-item': {
        transition: 'all .1s ease-in'
      },
      '& .maxExtent': {
        fontSize: '.70rem',
      },
      '& .x-axis > .tick': {
        fontSize: '.65rem',
        fontWeight: 'normal',
      },
      '& .x-axis > .tick:nth-child(odd)': {
        '@media (max-width: 375px)': {
          display: 'none',
        },
      },
      '& .y-axis > .tick': {
        fontSize: '.65rem',
        lineHeight: '.7rem',
        fontWeight: 'normal',
        transition: 'all .1s ease-in',
      },
      '& .x-axis .tick.active > text': {
        fontWeight: 'bold',
        fontSize: '.65rem',
        lineHeight: '.7rem',
        fill: theme.palette.common.black
      },
      '& .x-axis-groups > text': {
        fontSize: '.70rem'
      },
      ...additionalStyles
    },
  })
)(Box)

const HorizontalChartContainer = withStyles((theme, additionalStyles) =>
  createStyles({
    root: {
      position: 'relative',
      height: 25,
      '& .horizontal-stacked-bar-chart': {
        position: 'absolute',
        top: 0,
        left: 5,
        transform: 'rotate(90deg)',
        transformOrigin: 'bottom left',
        '& .bars > .bar': {
          opacity: 1,
        },
        '& .bars > .bar:hover': {
          cursor: 'pointer',
          outline: 'none',
        },
        '& .bars > .bar.active': {
          outline: 'none',
        },
      },
      display: 'block',
      top: 0,
      left: 0,
      width: '100%',
      fill: 'inherit',
      '& .bars > .bar:hover': {
        cursor: 'pointer',
      },
      '& .bar .stacked-bar-chart-item': {
        transition: 'all .1s ease-in'
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
        fontSize: '.85rem',
        fontWeight: 'normal',
        transition: 'all .1s ease-in',
      },
      '& .x-axis .tick.active > text': {
        fontWeight: 'bold',
        fontSize: '.90rem',
        fill: theme.palette.common.black
      },
      ...additionalStyles
    },
  })
)(Box)

const DefaultLegendContainer = withStyles((theme, additionalStyles) =>
  createStyles({
    root: {
      display: 'block',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      fontSize: theme.typography.h5.fontSize,
      '& td .legend-rect': {
        // fill: theme.palette.chart.secondary,
        // backgroundColor: theme.palette.chart.secondary,
        width: '20px',
        display: 'block',
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
        verticalAlign: 'bottom',
      },
      '& .legend-table td:first-child': {
        padding: '6px 6px 6px 16px',
        width: '20px'
      }
    },
  })
)(Box)

const CompactLegendContainer = withStyles((theme, additionalStyles) =>
  createStyles({
    root: {
      display: 'block',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      lineHeight: '0.7rem',
      fontSize: '0.7rem',
      '& td .legend-rect': {
        // fill: theme.palette.chart.secondary,
        // backgroundColor: theme.palette.chart.secondary,
        width: '10px',
        display: 'block',
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
        padding: '2px 2px 4px 2px',
        verticalAlign: 'bottom',
      },
      '& .legend-table td:first-child': {
        padding: '2px 2px 4px 2px',
        width: '20px'
      }
    },
  })
)(Box)

const LegendButton = withStyles((theme, additionalStyles) =>
  createStyles({
    root: {
      color: theme.palette.links.default,
      '& > span': {
        textDecoration: 'underline',
      }
    },
  })
)(Button)

const StackedBarChart = props => {
  const theme = useTheme()
  // const mapJson=props.mapJson || "https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json";
  // use ONRR topojson file for land
  const [collapsed, setCollapsed] = useState(props.collapsedLegend || false)
  // console.debug("SBC collapsed", collapsed, ' <> ', props)
  const size = useWindowSize()

  const { data, chartHeight, ...options } = props
  const elemRef = useRef(null)
  const title = options.title || ''
  const buttonValue = collapsed ? 'Show details' : 'Hide details'
  const drawChart = () => {
    elemRef.current.querySelector('#chart_div').innerHTML = ''
    elemRef.current.querySelector('#legend_div').innerHTML = ''
    const chart = new BarChart(elemRef.current, data, options)
    chart.draw(data)
  }

  // init drawing of chart
  useEffect(() => {
    drawChart()
  }, [])
  // redraw chart on resize event
  useEffect(() => {
    drawChart()
  }, [size.width])

  return (
    <>
      {title && <ChartTitle compact={options.compact}>{title}</ChartTitle>}
      <DefaultContainer ref={elemRef}>
        {options.horizontal &&
          <HorizontalChartContainer id='chart_div' theme={theme} style={{ height: chartHeight }}/>
        }
        {(!options.horizontal && options.compact)
          ? <CompactChartContainer id='chart_div' theme={theme} style={{ height: chartHeight }} />
          : <DefaultChartContainer id='chart_div' theme={theme} style={{ height: chartHeight }} />
        }
        { props.collapsibleLegend && <LegendButton variant='text' onClick={ () => setCollapsed(!collapsed) }>{buttonValue}</LegendButton> }
        <Collapse in={!collapsed}>
          {options.compact
            ? <CompactLegendContainer id='legend_div' />
            : <DefaultLegendContainer id='legend_div' />
          }
        </Collapse>
      </DefaultContainer>
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

StackedBarChart.Preview = {
  group: 'Data Visualizations',
  demos: [
    {
      title: 'Example',
      code: "<StackedBarChart data={" +
      JSON.stringify(chartData) + "} title={'Example'} xAxis={'year'} yAxis={'sum'} yGroupBy={'source'} yOrderBy={" +
      JSON.stringify(['Federal onshore', 'Federal offshore', 'Native American', 'Federal - Not tied to a lease']) + "}/>",
    },
    {
      title: 'Horizontal Example',
      code: "<StackedBarChart horizontal={true} data={" +
      JSON.stringify(chartData) + "} title={'Example'} xAxis={'year'} yAxis={'sum'} yGroupBy={'source'} yOrderBy={" +
      JSON.stringify(['Federal onshore', 'Federal offshore', 'Native American', 'Federal - Not tied to a lease']) + "}/>",
    }
  ]
}
