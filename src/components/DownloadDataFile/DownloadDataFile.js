import React from 'react'
// import PropTypes from 'prop-types'

import metaData from '../../../static/downloads/downloads.json'
import Link from '../Link'
import utils from '../../js/utils'

const DownloadDataFile = props => {
  // console.debug('MetaData', metaData)
  // console.debug('childrin', props.children)
  // console.debug('UTILS: ', utils)
  // console.debug('childrin', props)
  const href = './../' + props.dataSet
  const minDate = metaData[props.dataSet]?.minDate
  const maxDate = metaData[props.dataSet]?.maxDate
  const size = utils.bytesToSize(metaData[props.dataSet]?.size)

  const range = minDate + ' - ' + maxDate
  const suffix = (props.linkType === 'DownloadCsv') ? 'csv' : 'xlsx'
  return (<>
	  <Link linkType={props.linkType} href={ href } >
	    {props.children + ', ' + range + ' (' + suffix + ', ' + size + ')' }
	  </Link>
  </>
  )
}

export default DownloadDataFile
