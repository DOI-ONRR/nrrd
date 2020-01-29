/* eslint-disable no-tabs */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import utils from '../../../js/utils'
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

const Map = props => {
  // const mapJson=props.mapJson || "https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json";
  // use ONRR topojson file for land

  const mapJson = props.mapJson || '/maps/land/us-topology.json'
  const mapOffshoreJson =
        props.mapOffshoreJson || '/maps/offshore/offshore.json'
  const mapJsonObject = props.mapJsonObject

  const mapFeatures = props.mapFeatures || 'counties'
  const mapData = props.mapData || []
  console.debug('FEATURES', mapFeatures)

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
  let map

  useEffect(() => {
    if (typeof mapJsonObject !== 'object') {
      const promise = d3.json(mapJson)
      promise.then(us => {
        const data = observableData(mapData)
        data.title = mapTitle
        map = new D3Map(
          elemRef.current,
          us,
          mapFeatures,
          data,
          colorScheme,
          onClick,
          minColor,
          maxColor)
      })
    }
    else {
      const us = mapJsonObject
      const offshore = mapJsonObject.offshore
      const data = observableData(mapData)
      data.title = mapTitle
      map = new D3Map(
        elemRef.current,
        us,
        mapFeatures,
        data,
        colorScheme,
        onClick,
        minColor,
        maxColor
      )
    }
    map.zoom({ k: 2.0849315216822437, x: -633.6625582569186, y: -373.31911475784636 })
  })
  return (
    <div className={classes.map} ref={elemRef} >
      <div className={classes.legend} ></div>
      <div className={classes.map}>
      </div>
    </div>
  )
}

export default Map

const observableData = d => {
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
