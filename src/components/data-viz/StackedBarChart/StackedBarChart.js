import React, { useEffect, useRef }  from 'react'
//import ReactDOM from 'react-dom'

import * as d3 from 'd3'
import utils from '../../../js/utils'

import Grow from '@material-ui/core/Grow';
import { makeStyles } from '@material-ui/core/styles'
//import stackedBarChart from '../../../js/bar-charts/stacked-bar-chart'
import stackedBarChart from './stacked-bar-chart.js'

const useStyles = makeStyles(theme => ({
    chart: {
	display:'block',
	top:0,		    
	left:0,
	width: '100%',
	height: '200px',
	fill: '#435159',
	"&$hover": {
	    fill: '#086996'
	}
    },
    hover: {},
    legend: {
	display:'block',
	top:0,		    
	left:0,
	width: '100%',
	height: '200px',
	fill: '#435159'
    }
}))
//7-RevenueTabOnCloud.gov
const StackedBarChart = (props) => {
    // const mapJson=props.mapJson || "https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json";
    //use ONRR topojson file for land
    
    const classes = useStyles();
    const data=props.data;
    const selected=props.selected;
    const elemRef = useRef(null);
    
    useEffect( () => {
	console.debug(data);
	console.debug("________________________________________________");
	
	//	stackedBarChar(elemRef.current,{}, datas);
	elemRef.current.children[0].innerHTML='';
	elemRef.current.children[1].innerHTML='';
	let chart= new stackedBarChart(elemRef.current,  data);
	//chart.selected(selected);
	chart.draw(data);
	
	
	//stackedBarChart.create(elemRef.current,{sortOrder: ["Y1","Y2","Y3", "Y4"]}, data);
    })
    
    return (
	    <div className={classes.chart} ref={elemRef} >
	    <div className={classes.chart}></div><div className={classes.legend}> </div>
            </div>
    )
}

export default StackedBarChart

