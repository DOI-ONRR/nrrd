import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

// utility functions
import { formatToCommaInt } from '../../../../js/utils'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  CircularProgress
  // not used useTheme
} from '@material-ui/core'

import { CircleChart } from '../../../data-viz/CircleChart'
import { useInView } from 'react-intersection-observer'

const APOLLO_QUERY = gql`
  query ProductionTopLocations($year: Int!, $location: String!, $commodity: String!, $state: String!, $period: String!) {
    state_production_summary: production_summary(
      where: {
        # location_type - State, County, Offshore, Native American, Nationwide Federal
        location_type: {_eq: $location},
        location_name: { _neq: "Not tied to a lease" },
        # year - 2019
        year: { _eq: $year },
        # prduct ex - Oil (bbl)
        product: {_eq: $commodity},
        # fipsCode
        state: {_eq: $state},
        # Fiscal Year/Calendar Year
        period: {_eq: $period}
      },
        order_by: {total: desc}
      ) {
        location_name
        unit_abbr
        year
        location
        total
      }
    production_summary(
      where: {
        location_type: {_nin: ["Nationwide Federal", "County", ""]},
        location: {_neq: "null"},
        location_name: { _neq: "Not tied to a lease" },
        year: { _eq: $year }, 
        product: {_eq: $commodity},
        period: {_eq: $period}
      }, order_by: {total: desc}
      ) {
        location_name
        unit_abbr
        year
        location
        total
      }
  }
`
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    '& .chart-container': {
	    display: 'flex',
	    flexDirection: 'column',
    },
  }
}))

/*
 * const useStyles = makeStyles(theme => ({
 *   root: {
 *     maxWidth: '100%',
 *     width: '100%',
 *     margin: theme.spacing(1),
 *     '@media (max-width: 768px)': {
 *       maxWidth: '100%',
 *       margin: 0,
 *     }
 *   },
 *   progressContainer: {
 *     maxWidth: '25%',
 *     display: 'flex',
 *     '& > *': {
 *       marginTop: theme.spacing(3),
 *       marginRight: 'auto',
 *       marginLeft: 'auto',
 *     }
 *   },
 *   circularProgressRoot: {
 *     color: theme.palette.primary.dark,
 *   },
 *   chartHorizontal: {
 *     '& .chart-container': {
 *       display: 'flex',
 *       '@media (max-width: 426px)': {
 *         display: 'block',
 *         margin: 0,
 *       },
 *       '& .chart': {
 *         marginRight: theme.spacing(2),
 *         width: '70%',
 *         '@media (max-width: 426px)': {
 *           marginRight: 0,
 *         },
 *       },
 *     },
 *   },
 *   chartVertical: {
 *     '& .chart-container': {
 *       display: 'block',
 *       margin: 0,
 *     },
 *     '& .chart': {
 *       margin: 0,
 *       width: '100%',
 *     },
 *   }
 * }))
 *  */
const ProductionTopLocations = ({ title, ...props }) => {
  // console.log('ProudctionTopLocations props: ', props)
  const classes = useStyles()
  //  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR

  let locationType
  const state = props.fipsCode || ''

  switch (props.regionType) {
  case DFC.STATE:
    locationType = DFC.COUNTY_CAPITALIZED
    break
  case DFC.COUNTY_CAPITALIZED:
    locationType = ''
    break
  case DFC.OFFSHORE_CAPITALIZED:
    locationType = ''
    break
  default:
    locationType = props.fipsCode === DFC.NATIONWIDE_FEDERAL_FIPS ? DFC.STATE : ''
    break
  }

  const commodity = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  const key = `PTL${ year }${ state }${ commodity }${ period }`
  const xAxis = 'location_name'
  const yAxis = 'total'
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true
  })

  const { loading, error, data } = useQuery(APOLLO_QUERY,
    {
      variables: { year, location: locationType, commodity, state, period },
      skip: inView === false && (props.fipsCode === DFC.NATIVE_AMERICAN_FIPS ||
                                 props.regionType === DFC.COUNTY_CAPITALIZED ||
                                 props.regionType === DFC.OFFSHORE_CAPITALIZED)
    })

  if (loading) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </div>
    )
  }
  if (error) return `Error! ${ error.message }`

  let chartData = []
  let dataSet = (period === DFC.PERIOD_FISCAL_YEAR) ? `FY ${ year }` : `CY ${ year }`
  let unitAbbr = ''

  if (data) {
    if (data.state_production_summary.length || data.production_summary.length) {
	    if (data.state_production_summary.length > 0 && locationType === DFC.COUNTY_CAPITALIZED) {
        unitAbbr = data.state_production_summary[0].unit_abbr
        chartData = d3.nest()
			      .key(k => k.location_name)
			      .rollup(v => d3.sum(v, i => i.total))
			      .entries(data.state_production_summary).map(item => {
				  const r = { total: item.value, location_name: item.key, unit_abbr: unitAbbr }
				  return r
			      })
	    }
	    else { // Don't show top locations for any card except state and nationwide federal
        // quick and dirty - most definately probably a better way to handle this
        if (locationType !== DFC.COUNTY_CAPITALIZED) {
		    unitAbbr = data.production_summary[0].unit_abbr
		    let tmp = data.production_summary
		    if (props.fipsCode) {
            tmp = data.production_summary.filter(d => d.location !== 'NA')
		    }
		    chartData = d3.nest()
				  .key(k => k.location_name)
				  .rollup(v => d3.sum(v, i => i.total))
				  .entries(tmp).map(item => {
				      const r = { total: item.value, location_name: item.key, unit_abbr: unitAbbr }
				      return r
				  })
        }
	    }
	    dataSet = dataSet + ` (${ unitAbbr })`

	    if (chartData.length > 0) {
        return (
		    <div ref={ref}>
		    <Box className={classes.root}>
		    {title && <Box component="h4" fontWeight="bold" mb={2}>{title}</Box>}
		    <Box className={props.horizontal ? classes.chartHorizontal : classes.chartVertical}>
		    <CircleChart
		    key={key}
		    data={chartData}
		    xAxis={xAxis}
		    yAxis={yAxis}
		    legendHeaders={['Location name', dataSet]}
		    maxCircles={6}
		    chartTooltip={
                    d => {
			    const r = []
			    r[0] = d.data[xAxis]
			    r[1] = formatToCommaInt(d.data[yAxis])
			    return r
                    }
		    }
                  circleLabel={
                    d => {
                      const r = []
                      r[0] = d.data[xAxis]
                      r[1] = formatToCommaInt(d.data[yAxis])
                      return r
                    }
                  }
		    legendFormat={d => formatToCommaInt(d)}
		    legendPosition={props.horizontal ? 'right' : 'bottom'}
		    legendLabel={d => {
                    if (d === 'Native American') {
			    d = 'Native American lands'
                    }
                    else if (d === 'Gulf of Mexico, Central Gulf of Mexico') {
			    d = 'Central Gulf'
                    }
                    else if (d === 'Gulf of Mexico, Western Gulf of Mexico') {
			    d = 'Western Gulf'
                    }
                    return d
		    }}
		    showLabels={!!props.horizontal}
		    />
		    </Box>
		    </Box>
          </div>
        )
	    }
	    else {
        return <Box className={classes.root} ref={ref} ></Box>
	    }
    }
    else {
	    return (<div className={classes.progressContainer} ref={ref}>
	      <CircularProgress classes={{ root: classes.circularProgressRoot }} />
	    </div>)
    }
  }
  else {
    return (<div className={classes.progressContainer} ref={ref}>
	  <CircularProgress classes={{ root: classes.circularProgressRoot }} />
    </div>)
  }
}

export default ProductionTopLocations

ProductionTopLocations.propTypes = {
  title: PropTypes.string
}
