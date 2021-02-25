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
  const csvSize = Math.round(metaData[props.dataSet].csvSize / 1000000)
  const xlsxSize = Math.round(metaData[props.dataSet].xlsxSize / 1000000)
  return (<>
    <Link linkType="DownloadXls" href={href + '.xlsx'} >
      {props.children + ', ' + minDate.getMonth() + 1 + '/' + minDate.getFullYear() + ' - ' + maxDate.getMonth() + 1 + '/' + maxDate.getFullYear() + ' (Excel, ' + xlsxSize + ' MB)' }
    </Link>
    <Link linkType="DownloadCsv" href={href + '.csv'} >
      {props.children + ', ' + minDate.getMonth() + 1 + '/' + minDate.getFullYear() + ' - ' + maxDate.getMonth() + 1 + '/' + maxDate.getFullYear() + ' (csv, ' + csvSize + ' MB)' }
    </Link>
  </>
  )
}

export default DownloadDataFile
