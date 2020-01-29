/* eslint-disable no-tabs */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
// import ReactDOM from 'react-dom'

import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import utils from '../../../js/utils'
// import { , withPrefix } from '../../utils/temp-link'
// import styles from './Map.module.scss'
import D3Map from './D3Map.js'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  map: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    order: '3'
  },
  legend: {
    display: 'block',
    top: 0,
    left: 0,
    width: '100%',
    height: '30px',
    zIndex: 10,
    margin: '5px'
  }
}))
/**
 *  Map  a component for rendering maps dynamically from  data
 *
 *  @param {string} [mapJson="https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json"]  mapJson - url to get the topojson used in map.
 *  @param {string} [mapFeatures=counties] mapFeatures - A switch to view county data or state data
 *  @param {string[][]} mapData - a two dimenstional arrray of fips and data, maybe county or state fips
 *  @param {string} [colorScheme=green] colorScheme current lets you modify color from red to blue green or gray ;
 *  @param {*} onClick function that determines what to do if area is clicked
 *
 */
const Map = (props) => {
  // const mapJson=props.mapJson || "https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json";
  // use ONRR topojson file for land
  const mapJson = props.mapJson || '/maps/land/us-topology.json'
  const mapOffshoreJson =
        props.mapOffshoreJson || '/maps/offshore/offshore.json'
  const mapJsonObject = props.mapJsonObject

  const mapFeatures = props.mapFeatures || 'counties'
  const mapData = props.mapData || []
  console.debug("FEATURES", mapFeatures)

  // mapData=props.offshoreData && mapData.concat(props.offshoreData);
  const elemRef = useRef(null)
  const colorScheme = props.colorScheme || 'green'
  const offshoreColorScheme = props.offshoreColorScheme || colorScheme
  const mapTitle = props.mapTitle
  const onClick =
        props.onClick ||
        function (d, i) {
          console.debug('Default onClick function', d, i)
        }
  const classes = useStyles()
  const minColor = props.minColor
  const maxColor = props.maxColor
  
  useEffect(() => {
    if (typeof mapJsonObject !== 'object') {
      const promise = d3.json(mapJson)
      promise.then(us => {
        // let states = get_states(us);
        const data = observableData(mapData)
        console.debug("Data", mapData)
        data.title = mapTitle
        // let p= get_data().then((data)=>{3
        // chart(elemRef.current, us,mapFeatures,data);
        // });
      //  elemRef.current.children[0].innerHTML = ''
      //  elemRef.current.children[1].innerHTML = ''
        let d3map=new D3Map(elemRef.current,
                          us,
                          mapFeatures,
                          data,
                          colorScheme,
                          onClick,
                          minColor,
                          maxColor)
        
        
       /* const svg = chart(
          elemRef.current,
          us,
          mapFeatures,
          data,
          colorScheme,
          onClick,
          minColor,
          maxColor
        )
       */
        
        //      const promise2 = d3.json(mapOffshoreJson)
      //  promise2.then(offshore => {
          // let max=data.values.sort((a,b)=>a-b)[data.values.length-1];

        //  const ii = 0
          /*   for (const region in offshore.objects) {
               if (ii < 1) {
               offshoreChart(
               svg,
               offshore,
               region,
               data,
               offshoreColorScheme,
               onClick,
               minColor,
               maxColor
               )
               // ii++;
               }
               } */
       // })
      })
    }
    else {
      const us = mapJsonObject
      const offshore = mapJsonObject.offshore
      // let states = get_states(us);
      const data = observableData(mapData)
      data.title = mapTitle
      let map=new D3Map(elemRef.current,
                        us,
                        mapFeatures,
                        data,
                        colorScheme,
                        onClick,
                        minColor,
                        maxColor)
      /* const svg = chart(
        elemRef.current,
        us,
        mapFeatures,
        data,
        colorScheme,
        onClick
        ) */
      
      /* for (const region in offshore.objects) {
         offshoreChart(
         svg,
         offshore,
         region,
         data,
         offshoreColorScheme,
         onClick
         )
         } */
    }
    
    
    
    
  })
  return (<div className={classes.map} ref={elemRef} ><div className={classes.legend} ></div>
	  <div className={classes.map}  >
          </div>
	  </div>
  	 )
}

export default Map

/**
 *  The function that does the building of the svg with d3
 *
 *  @param {*}  node - the node we are going to build the svg in
 *  @param {*} us - the topojson json object to be used
 *  @param {string} [mapFeatures=counties] mapFeatures - A switch to view county data or state data
 *  @param {string[][]} data - a two dimenstional arrray of fips and data, maybe county or state fips
 *  @param {string} [colorScheme=green] colorScheme current lets you modify color from red to blue green or gray ;
 *  @param {*} onClick function that determines what to do if area is clicked
 *
 */
const chart = (
  node,
  us,
  mapFeatures,
  data,
  colorScheme,
  onClick,
  minColor,
  maxColor
) => {
  const width = node.scrollWidth
  const height = node.scrollHeight
  // const margin = { top: 0, bottom: 0, right: 0, left: 0};
  const projection = d3
        .geoAlbersUsa()
        .translate([width / 2, height / 2]) // translate to center of screen
        .scale([width]) // scale things down so see entire US
  // const path = d3.geoPath();
  /*    projection.scale=function(_) {
	if (!arguments.length) return lower48.scale();
	lower48.scale(_), alaska.scale(_ * 0.70), hawaii.scale(_);
	return albersUsa.translate(lower48.translate());
        };
  */
  const path = d3.geoPath(projection)

  let color = () => {}

  // switch quick and dirty to let users change color beter to use d3.interpolateRGB??
  switch (colorScheme) {
  case 'blue':
    color = d3.scaleSequentialQuantile(data.values, t =>
                                       d3.interpolateBlues(t)
                                      )
    break
  case 'green':
    color = d3.scaleSequentialQuantile(data.values, t =>
                                       d3.interpolateGreens(t)
                                      )
    break
  case 'red':
    color = d3.scaleSequentialQuantile(data.values, t =>
                                       d3.interpolateReds(t)
                                      )
    break
  case 'grey':
    color = d3.scaleSequentialQuantile(data.values, t =>
                                       d3.interpolateGreys(t)
                                      )
    break
  default:
    color = d3.scaleSequentialQuantile(data.values, t =>
                                       d3.interpolateGreens(t)
                                      )
  }
  if (minColor && maxColor) {
    color = d3
      .scaleSequentialQuantile()
      .interpolator(d3.interpolateRgb(minColor, maxColor))
      .domain(data.values.sort())
  }
  const format = d => {
    if (isNaN(d)) {
      return ''
    }
    else {
      return '$' + d3.format(',.0f')(d)
    }
  }

  const svg = d3
        .select(node.children[1])
        .append('svg')
        .style('width', width)
        .style('height', height)
        .attr('fill', '#E0E2E3')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
  
  console.debug(
    '=================================================================data'
  )
  
  console.debug(data)
  const legendSvg = d3.select(node.children[0]).append('svg');
  legendSvg.append("g")
    .attr("transform", "translate(30,0)")
    .call(legend,data.title, data, color,true);
  // return svg.node();
  
  // let states = get_states(us);
  
  const zoom = d3.zoom()
        .scaleExtent([1, 32])
        .on('zoom', zoomed)
  const g = svg.append('g');
  
  svg.call(zoom);
  
  
  
  g.selectAll('path')
    .data(topojson.feature(us, us.objects[mapFeatures]).features)
    .join("path")
    .attr("fill", d => color(data.get(d.id)))
    .attr("fill-opacity", .9)
    .attr("d", path)
    .attr("stroke", "#CACBCC")
    .attr('vector-effect', 'non-scaling-stroke')
    .on("click", (d,i) => {onClick(d,i)} )
    .on("mouseover", function(d,i) {   // ES6 function find the this node is alluding me

      d3.select(this)
	.style('fill-opacity', .7)
	.style("cursor", "pointer"); 
    })
    .on("mouseout", (d,i) => {
      d3.selectAll('path')
	.style('fill-opacity',.9)
    }
       )
    .append("title")
    .text(d => `${d.properties.name}  ${format(data.get(d.id))}`);

  console.debug("============================================", us.objects.states);
  
  svg.append("path")
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr('fill', 'none')
  //.attr('stroke', '#9FA0A1')
  //.attr('stroke-linejoin', 'round')
    .attr('d', path)

  function zoomed() {
    console.debug("zoooom", g)
    g
      .selectAll('path') // To prevent stroke width from scaling
      .attr('transform', d3.event.transform);
  }
  return svg.node()
}

const offshoreChart = (
  node,
  offshore,
  region,
  data,
  colorScheme,
  onClick,
  minColor,
  maxColor
) => {
  const width = node.scrollWidth
  const height = node.scrollHeight
  // const margin = { top: 0, bottom: 0, right: 0, left: 0};
  const scale = width
  //    const path = d3.geoPath();
  const projection = d3
        .geoAlbersUsa()
  //	  .fitExtent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]],
  //                     topojson.feature(offshore, offshore.objects[region]))
        .translate([width / 2, height / 2]) // translate to center of screen
        .scale([scale]) // scale things down so see entire US

  const path = d3.geoPath(projection)
  //   const path = d3.geoPath();
  let color = () => {}
  // switch quick and dirty to let users change color beter to use d3.interpolateRGB??
  switch (colorScheme) {
  case 'blue':
    color = d3.scaleSequentialQuantile(data.values, t =>
                                       d3.interpolateBlues(t)
                                      )
    break
  case 'green':
    color = d3.scaleSequentialQuantile(data.values, t =>
                                       d3.interpolateGreens(t)
                                      )
    break
  case 'red':
    color = d3.scaleSequentialQuantile(data.values, t =>
                                       d3.interpolateReds(t)
                                      )
    break
  case 'grey':
    color = d3.scaleSequentialQuantile(data.values, t =>
                                       d3.interpolateGreys(t)
                                      )
    break
  default:
    color = d3.scaleSequentialQuantile(data.values, t =>
                                       d3.interpolateGreens(t)
                                      )
  }
  if (minColor && maxColor) {
    color = d3
      .scaleSequentialQuantile()
      .interpolator(d3.interpolateRgb(minColor, maxColor))
      .domain(data.values.sort())
  }

  const format = d => {
    if (isNaN(d)) {
      return ''
    }
    else {
      return '$' + d3.format(',.0f')(d)
    }
  }

  const svg = d3.select(node)
  svg
    .append('g')
    .selectAll('path')
    .data(topojson.feature(offshore, offshore.objects[region]).features)

    .join('path')
    .attr('fill', d => color(data.get(d.id)))
    .attr('fill-opacity', 0.9)
    .attr('d', path)
    .attr('stroke', '#CACBCC')
    .attr('vector-effect', 'non-scaling-stroke')
    .on('click', (d, i) => {
      onClick(d, i)
    })
    .on('mouseover', function (d, i) {
      // ES6 function find the this node is alluding me
      d3.select(this)
        .style('fill-opacity', 0.7)
        .style('cursor', 'pointer')
    })
    .on('mouseout', (d, i) => {
      d3.selectAll('path').style('fill-opacity', 0.9)
    })
    .append('title')
    .text(d => `${ d.properties.name }  ${ format(data.get(d.id)) }`)

  svg
    .append('path')
    .datum(topojson.mesh(offshore, offshore.objects[region], (a, b) => a !== b))
    .attr('fill', 'none')
    .attr('stroke', '#9FA0A1')
    .attr('stroke-linejoin', 'round')
    .attr('d', path)
  return svg.node()
}

/**
 *  The function that does the building of the svg with d3
 *
 *  @param {*}  g - the group node we are going to build the legend in
 *  @param {string} title - the title of the map
 *  @param {string[][]} data - a two dimenstional arrray of fips and data, maybe county or state fips used to generate legend colors
 *  @param {string} [colorScheme=green] colorScheme current lets you modify color from red to blue green or gray ;
 *
 */

const legend = (g, title, data, color, labels) => {
  /*

    g.append("rect")
    .attr("x", 200)
    .attr("y", 300)
    .attr("width", ls_w)
    .attr("height", ls_h)
    .style("fill", '#FF00FF')
    .style("opacity", 1);

    g.append("text")
    .attr("x", 50)
    .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
    .text(function(d, i){ return "label "+i });
  */
  const width = 200
  const height = 20
  const sorted = data.values.sort((a, b) => a - b)

  const lowest = utils.formatToSigFig_Dollar(Math.floor(sorted[0]), 3)
  const median = utils.formatToSigFig_Dollar(
    Math.floor(sorted[Math.floor(sorted.length / 2)]),
    3
  )
  const highest = utils.formatToSigFig_Dollar(
    Math.floor(sorted[sorted.length - 1]),
    3
  )
  for (let ii = 0; ii < sorted.length; ii++) {
    g.append('rect')
      .attr('x', (ii * width) / sorted.length)
      .attr('width', width / sorted.length + 1)
      .attr('height', height)
      .attr('fill-opacity', 0.9)
      .style('fill', color(sorted[ii]))
  }

  g.append('text')
    .attr('class', 'caption')
    .attr('y', -6)
    .attr('fill', '#000')
    .attr('text-anchor', 'start')
    .attr('font-weight', 'bold')

    .text(title)

  if (labels) {
    g.call(
      d3
        .axisBottom(d3.scalePoint([lowest, median, highest], [0, width]))
        .tickSize(20)
    )
      .select('.domain')
      .remove()
  }
}

/**
 *  The function that mimics ObservableMap() funtcion to allow minimal change to prototype.
 *
 *  @param {array[][]}  d - two diminational array of data
 *  @return {object} returns an object with values as an array keys as an array and a get accessor for getting the data
 *
 */

const observableData = d => {
  //    let data= await d3.csv("https://raw.githubusercontent.com/rentry/rentry.github.io/master/data/revenue-test.csv", ({id, rate}) => [id, +rate]).then( (d) => {
  const r = { values: [], title: '', keyValues: {} }
  for (let ii = 0; ii < d.length; ii++) {
    r.values.push(d[ii][1])
    r.keyValues[d[ii][0]] = d[ii][1]
  }
  r.get = id => {
    return r.keyValues[id]
  }
  return r
}

/**
 *  The function that mimics Observable Map() funtcion for topojson data
 *
 *  @param {object}  us - topojson data object
 *  @return {object} returns an object with values as an array keys as an array and a get accessor for getting the data
 *
 */

const get_states = (us)=> {
  let r={values: [] , keys: [], keyValues: {}};
  for(let key in  us.objects.states.geometries) {
    let state= us.objects.states.geometries[key];
    let id=state.id;

    let value=state.properties.name;

    r.values.push(value);
    r.keys.push(id);
    r.keyValues[id]={id:id,name:value};

  }
  r.get = (id) => { return r.keyValues[id]};
  return r;
} 
