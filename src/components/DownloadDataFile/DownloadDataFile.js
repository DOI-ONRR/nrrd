import React from 'react'
// import PropTypes from 'prop-types'

import metaData from '../../../static/downloads/downloads.json'
import Link from '../Link'
import utils from '../../js/utils'

const DownloadDataFile = props => {
  console.debug('MetaData', metaData)
  console.debug('childrin', props.children)
  console.debug('UTILS: ', utils)
  console.debug('childrin', props)
  const href = './../' + props.dataSet
  const minDate = new Date(metaData[props.dataSet].minDate)
  const maxDate = new Date(metaData[props.dataSet].maxDate)
  const size = Math.round(metaData[props.dataSet].size / 1000000)
  const minMonth = minDate.getMonth() + 1
  const minYear = minDate.getFullYear()
  const maxMonth = maxDate.getMonth() + 1
  const maxYear = maxDate.getFullYear()
  const range = (props.dataSet.match('month')) ? minMonth + '/' + minYear + ' - ' + maxMonth + '/' + maxYear : minYear + ' - ' + maxYear
  const suffix = (props.linkType === 'DownloadCsv') ? 'csv' : 'xlsx'
  return (<>
	  <Link linkType={props.linkType} href={ href + '.' + suffix } >
	    {props.children + ', ' + range + ' (' + suffix + ', ' + size + ' MB)' }
	  </Link>
  </>
  )
}

export default DownloadDataFile
