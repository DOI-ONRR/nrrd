/* eslint-disable no-tabs */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import utils from '../../../js/utils'
import D3Map from './D3Map.js'
import useWindowSize from '../../../js/hooks/useWindowSize'
import MapControls from '../../sections/ExploreData/MapControls'
import { makeStyles } from '@material-ui/core/styles'

import { Box } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
    '& .mapContainer': {
      height: '100%',
      width: '100%',
    },
    '& .map': {
      height: '100%',
      width: '100%',
    },
    '& .legendWrap': {
      display: 'block',
      left: 5,
      width: 300,
      height: 50,
      zIndex: 10,
      margin: 5,
      position: 'absolute',
      padding: theme.spacing(1),
      background: theme.palette.common.white,
      borderRadius: 4,
      bottom: 10,
      [theme.breakpoints.down('xs')]: {
        bottom: 30,
      },
      '@media and (max-width: 600px)': {
        width: '100%',
      },
      '& svg': {
        top: 0,
      },
      '& .tick': {
        fontSize: theme.typography.body2,
      }
    },
    '& #float-button-group': {
	  display: 'block',
	  left: 10,
	  width: 50,
	  height: 150,
	  zIndex: 10,

	  position: 'absolute',
	  padding: theme.spacing(1),
	  borderRadius: 4,
	  bottom: 150,
	  '@media and (max-width: 600px)': {
	      transform: 'scale(0.75)',
	      left: 0,
        width: '100%',
	  },
    },
    '& #float-button-group:hover': {
      opacity: 1
    },
    '& .button': {
	    background: theme.palette.background.default,
      width: 50,
	    height: 50,
	    margin: 5
    },
  },
  buttonGroupGrouped: {
    padding: theme.spacing(0.5),
    background: theme.palette.background.default,
    margin: 0,
  },
  zoomButtonGroupContainer: {
    left: 10,
    bottom: 70,
    height: 100,
    position: 'absolute',
    '@media (max-width: 768px)': {
	    transform: 'scale(0.65)',
	    left: 0,
      bottom: 80,
    },
    '& svg': {
      height: '.75em',
      width: '.75em',
    },
  }

}))

/**
 * Map  a component for rendering maps dynamically from  data
 *
 * @param {string} [mapJson="https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json"]  mapJson - url to get the topojson used in map.
 * @param {string} [mapFeatures=counties] mapFeatures - A switch to view county data or state data
 * @param {string[][]} mapData - a two dimenstional arrray of fips and data, maybe county or state fips
 * @param {string} [colorScheme=green] colorScheme current lets you modify color from red to blue green or gray
 * @param {*} onClick function that determines what to do if area is clicked
 */

const Map = props => {
  const size = useWindowSize()

  // const mapJson=props.mapJson || "https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json";
  // use ONRR topojson file for land
  const mapJson = props.mapJson || '/maps/land/us-topology.json'
  const mapOffshoreJson =
        props.mapOffshoreJson || '/maps/offshore/offshore.json'
  const mapJsonObject = props.mapJsonObject

  const mapFeatures = props.mapFeatures || 'counties'
  // const mapData = props.mapData || []

  // mapData=props.offshoreData && mapData.concat(props.offshoreData);
  const elemRef = useRef(null)
  const colorScheme = props.colorScheme || 'green'
  const offshoreColorScheme = props.offshoreColorScheme || colorScheme
  const mapTitle = props.mapTitle
  const onClick =
        props.onClick ||
        function (d, i) {
          // console.debug('Default onClick function', d, i)
        }
  const classes = useStyles()
  const minColor = props.minColor
  const maxColor = props.maxColor
  const onZoom = props.onZoom_d || function () {
    // console.debug('Map onZoom default')
  }
  const disableMapControls = props.disableMapControls || false
  const onZoomEnd = props.onZoomEnd_d || function () {
    // console.debug('Map onZoomEnd default')
  }
  const zoomIn = props.zoomIn_d || function () {
    // console.debug('Map zoomIn default')
  }
  const mapZoom = props.mapZoom
  const mapX = props.mapX
  const mapY = props.mapY

  const { mapData, ...options } = props
  let map

  // Ugly hack to get around not being able to merge AKR Alaska Offshore Region
  const planningAreas = ['BFT', 'CHU', 'HOP', 'NOR', 'MAT', 'NAV', 'ALB', 'BOW', 'ALA', 'GEO', 'NAL', 'SHU', 'KOD', 'GOA', 'COK']
  const AKR = mapData.filter((d, i) => {
    if (d[0] === 'AKR') {
      return d[1]
    }
    return false
  })

  if (AKR && AKR.length > 0) {
    for (let ii = 0; ii < planningAreas.length; ii++) {
      mapData.push([planningAreas[ii], AKR[0][1]])
      // console.debug('AKR: ', planningAreas, ' : ', AKR[0])
    }
  }

  const createMap = () => {
    const us = mapJsonObject
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
      maxColor,
      mapZoom,
      mapX,
      mapY,
      options
    )
    if (props.zoomTo) {
	    map.zoomTo(props.zoomTo)
    }

    if (mapZoom) {
      map.zoom(mapZoom)
    }

    map.width = size.width
    map.height = size.height
  }

  useEffect(() => {
    createMap()
  }, [mapData, mapJsonObject, size.width])

  return (
    <Box className={classes.root}>
      <div className='mapContainer' ref={elemRef}>
        <div className='legendWrap'></div>
        <div className='map'></div>
        { !disableMapControls &&
          <MapControls handleClick={d => {
	          // console.log('handling click: ', d)
	        }}/>
        }
      </div>
    </Box>
  )
}

export default Map

/**
 *  The function that mimics ObservableMap() funtcion to allow minimal change to prototype.
 *
 *  @param {array[][]}  d - two diminational array of data
 *  @return {object} returns an object with values as an array keys as an array and a get accessor for getting the data
 *
 */

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
